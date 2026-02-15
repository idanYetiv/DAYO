import { isNativePlatform } from './platform'

// Placeholder API key — replace with your actual RevenueCat API key
const REVENUECAT_API_KEY = 'appl_XXXXXXXX'

let initialized = false

export async function initializeRevenueCat(): Promise<void> {
  if (!isNativePlatform() || initialized) return

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY })
    initialized = true
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error)
  }
}

export async function identifyUser(userId: string): Promise<void> {
  if (!isNativePlatform() || !initialized) return

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logIn({ appUserID: userId })
  } catch (error) {
    console.error('Failed to identify RevenueCat user:', error)
  }
}

export async function logoutUser(): Promise<void> {
  if (!isNativePlatform() || !initialized) return

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logOut()
  } catch (error) {
    console.error('Failed to logout RevenueCat user:', error)
  }
}
