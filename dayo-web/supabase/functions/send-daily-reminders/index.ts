// Supabase Edge Function: Send Daily Reminders
// Triggered by external cron (GitHub Actions) every hour

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// APNs configuration
const APNS_KEY_ID = Deno.env.get('APNS_KEY_ID') || ''
const APNS_TEAM_ID = Deno.env.get('APNS_TEAM_ID') || ''
const APNS_PRIVATE_KEY = Deno.env.get('APNS_PRIVATE_KEY') || ''
const APNS_BUNDLE_ID = 'app.dayo.web' // Your iOS bundle ID

// Use sandbox for development, production for App Store
const APNS_HOST = Deno.env.get('APNS_PRODUCTION') === 'true'
  ? 'api.push.apple.com'
  : 'api.sandbox.push.apple.com'

interface DeviceToken {
  token: string
  platform: 'ios' | 'android' | 'web'
}

interface UserWithReminder {
  user_id: string
  daily_reminder_time: string
  profile_type: 'adult' | 'kid'
}

// Generate JWT for APNs authentication
async function generateAPNsJWT(): Promise<string> {
  const header = {
    alg: 'ES256',
    kid: APNS_KEY_ID,
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: APNS_TEAM_ID,
    iat: now,
  }

  // Import the private key
  const pemContent = APNS_PRIVATE_KEY
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')

  const keyData = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  )

  // Create JWT
  const encoder = new TextEncoder()
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const toSign = encoder.encode(`${headerB64}.${payloadB64}`)

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    toSign
  )

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  return `${headerB64}.${payloadB64}.${signatureB64}`
}

// Send push notification via APNs
async function sendAPNsNotification(
  token: string,
  title: string,
  body: string,
  jwt: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://${APNS_HOST}/3/device/${token}`, {
      method: 'POST',
      headers: {
        'authorization': `bearer ${jwt}`,
        'apns-topic': APNS_BUNDLE_ID,
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        aps: {
          alert: { title, body },
          sound: 'default',
          badge: 1,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`APNs error for token ${token.substring(0, 10)}...:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Failed to send to ${token.substring(0, 10)}...:`, error)
    return false
  }
}

// Get reminder message based on profile type
function getReminderMessage(profileType: 'adult' | 'kid'): { title: string; body: string } {
  if (profileType === 'kid') {
    const messages = [
      { title: "Hey Adventurer! 🌟", body: "Time to write about your day! What was the coolest thing that happened?" },
      { title: "Diary Time! 📝", body: "Your journal is waiting! What adventures did you have today?" },
      { title: "Don't forget! ✨", body: "Write in your diary before bed! You're doing amazing!" },
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  } else {
    const messages = [
      { title: "Time to reflect", body: "Take a moment to capture today's thoughts and moments." },
      { title: "Your daily check-in", body: "How was your day? A few minutes of journaling can make a difference." },
      { title: "End your day intentionally", body: "Reflect on today and set intentions for tomorrow." },
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
}

Deno.serve(async (req) => {
  // Verify request is authorized (optional: add API key check)
  const authHeader = req.headers.get('Authorization')
  const expectedKey = Deno.env.get('CRON_SECRET')

  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current hour in HH:00 format
    const now = new Date()
    const currentHour = now.getUTCHours().toString().padStart(2, '0') + ':00'

    console.log(`Checking for reminders at ${currentHour} UTC`)

    // Find users who have reminders enabled at this hour
    // Note: This is a simplified approach - you may want to handle timezones
    const { data: usersWithReminders, error: usersError } = await supabase
      .from('user_profiles')
      .select('user_id, daily_reminder_time, profile_type')
      .eq('notifications_enabled', true)
      .eq('daily_reminder_enabled', true)
      .like('daily_reminder_time', `${currentHour.substring(0, 2)}:%`)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return new Response(JSON.stringify({ error: usersError.message }), { status: 500 })
    }

    if (!usersWithReminders || usersWithReminders.length === 0) {
      console.log('No users with reminders at this hour')
      return new Response(JSON.stringify({ sent: 0, message: 'No reminders to send' }))
    }

    console.log(`Found ${usersWithReminders.length} users with reminders`)

    // Generate APNs JWT once for all requests
    const jwt = await generateAPNsJWT()

    let sentCount = 0
    let errorCount = 0

    // Process each user
    for (const user of usersWithReminders as UserWithReminder[]) {
      // Get device tokens for this user
      const { data: tokens, error: tokensError } = await supabase
        .from('device_tokens')
        .select('token, platform')
        .eq('user_id', user.user_id)
        .eq('platform', 'ios') // Only iOS for now

      if (tokensError || !tokens || tokens.length === 0) {
        continue
      }

      const message = getReminderMessage(user.profile_type)

      // Send to each device
      for (const deviceToken of tokens as DeviceToken[]) {
        const success = await sendAPNsNotification(
          deviceToken.token,
          message.title,
          message.body,
          jwt
        )

        if (success) {
          sentCount++
        } else {
          errorCount++
        }
      }
    }

    console.log(`Sent ${sentCount} notifications, ${errorCount} errors`)

    return new Response(
      JSON.stringify({
        sent: sentCount,
        errors: errorCount,
        usersChecked: usersWithReminders.length,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
})
