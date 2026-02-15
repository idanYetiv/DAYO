import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-dayo-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/" className="text-dayo-gray-500 hover:text-dayo-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-dayo-gray-900">Privacy Policy</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8 prose prose-gray">
        <p className="text-sm text-dayo-gray-400">Last updated: February 15, 2026</p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">1. Introduction</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          DAYO ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and safeguard your information when you use our mobile
          application and web service.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">2. Information We Collect</h2>

        <h3 className="text-lg font-medium text-dayo-gray-800 mt-6 mb-2">Account Information</h3>
        <p className="text-dayo-gray-600 leading-relaxed">
          When you create an account, we collect your email address for authentication purposes.
          You may also provide a display name.
        </p>

        <h3 className="text-lg font-medium text-dayo-gray-800 mt-6 mb-2">User Content</h3>
        <p className="text-dayo-gray-600 leading-relaxed">
          We store the content you create within the app, including:
        </p>
        <ul className="list-disc pl-6 text-dayo-gray-600 space-y-1">
          <li>Daily tasks and to-do items</li>
          <li>Diary entries and mood selections</li>
          <li>Goals (yearly, monthly, weekly)</li>
          <li>Habit tracking data</li>
          <li>Photos and sketches added to diary entries</li>
        </ul>

        <h3 className="text-lg font-medium text-dayo-gray-800 mt-6 mb-2">Photos & Camera</h3>
        <p className="text-dayo-gray-600 leading-relaxed">
          If you choose to add photos to your diary entries, we request access to your camera
          and/or photo library. Photos are uploaded and stored securely in our cloud storage.
          We only access your camera or photos when you explicitly initiate this action.
        </p>

        <h3 className="text-lg font-medium text-dayo-gray-800 mt-6 mb-2">Push Notifications</h3>
        <p className="text-dayo-gray-600 leading-relaxed">
          With your permission, we send push notifications for daily reminders. You can enable
          or disable notifications at any time in the app settings or your device settings.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">3. How We Store Your Data</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          Your data is stored securely using Supabase, which provides encrypted database storage
          and secure file storage. All data is protected with Row Level Security (RLS), ensuring
          only you can access your own information. Data is transmitted over HTTPS.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">4. How We Use Your Information</h2>
        <p className="text-dayo-gray-600 leading-relaxed">We use your information to:</p>
        <ul className="list-disc pl-6 text-dayo-gray-600 space-y-1">
          <li>Provide and maintain the DAYO service</li>
          <li>Authenticate your account</li>
          <li>Send daily reminder notifications (with your permission)</li>
          <li>Generate AI-powered insights about your diary entries (processed on-device or via secure API)</li>
          <li>Calculate streaks, statistics, and progress metrics</li>
        </ul>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">5. Data Sharing</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          We do not sell, trade, or share your personal data with third parties. Your diary
          entries, tasks, and goals are private to you. We do not use your data for advertising
          or tracking purposes.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">6. Children's Privacy</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          DAYO includes a Kids Mode designed for children aged 8-14. When using Kids Mode:
        </p>
        <ul className="list-disc pl-6 text-dayo-gray-600 space-y-1">
          <li>We collect the same types of data (tasks, diary entries) but with age-appropriate content</li>
          <li>No third-party tracking or advertising is used</li>
          <li>Parents/guardians should create and manage the account</li>
          <li>Parents can export or delete all data at any time through the Settings page</li>
        </ul>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">7. Your Rights</h2>
        <p className="text-dayo-gray-600 leading-relaxed">You have the right to:</p>
        <ul className="list-disc pl-6 text-dayo-gray-600 space-y-1">
          <li><strong>Access your data</strong> — View all your content within the app</li>
          <li><strong>Export your data</strong> — Download all your data as a JSON file from Settings &gt; Export Data</li>
          <li><strong>Delete your data</strong> — Permanently delete your account and all associated data from Settings &gt; Delete Account</li>
          <li><strong>Modify your data</strong> — Edit or delete individual entries at any time</li>
        </ul>
        <p className="text-dayo-gray-600 leading-relaxed mt-3">
          These rights are available to all users regardless of location, including rights under
          GDPR, CCPA, and other applicable privacy regulations.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">8. Data Retention</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          We retain your data for as long as your account is active. When you delete your account,
          all associated data is permanently removed from our servers.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">9. Security</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          We implement industry-standard security measures including encrypted storage,
          HTTPS transport, and Row Level Security policies. However, no method of electronic
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">10. Changes to This Policy</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by updating the "Last updated" date at the top of this page.
        </p>

        <h2 className="text-xl font-semibold text-dayo-gray-900 mt-8 mb-3">11. Contact Us</h2>
        <p className="text-dayo-gray-600 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="text-dayo-gray-600">
          <a href="mailto:support@dayo.app" className="text-dayo-purple hover:underline">
            support@dayo.app
          </a>
        </p>

        <div className="mt-12 pt-6 border-t border-dayo-gray-100">
          <p className="text-sm text-dayo-gray-400 text-center">
            &copy; {new Date().getFullYear()} DAYO. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}
