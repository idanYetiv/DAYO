import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Shield,
  Download,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Crown,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import BottomNavigation from '../components/ui/BottomNavigation'

interface SettingItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  type: 'link' | 'toggle' | 'select'
  value?: boolean | string
  options?: string[]
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

export default function SettingsPage() {
  const { user, signOut } = useAuthStore()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', icon: User, type: 'link' },
        { id: 'email', label: 'Email', description: user?.email || 'Not set', icon: Mail, type: 'link' },
        { id: 'password', label: 'Change Password', icon: Lock, type: 'link' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'theme', label: 'Dark Mode', icon: darkMode ? Moon : Sun, type: 'toggle', value: darkMode },
        { id: 'notifications', label: 'Push Notifications', icon: Bell, type: 'toggle', value: notifications },
        { id: 'reminder', label: 'Daily Reminder', description: '9:00 AM', icon: Bell, type: 'toggle', value: dailyReminder },
      ],
    },
    {
      title: 'Appearance',
      items: [
        { id: 'theme-color', label: 'Theme Color', description: 'Purple', icon: Palette, type: 'link' },
        { id: 'app-icon', label: 'App Icon', description: 'Default', icon: Smartphone, type: 'link' },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        { id: 'app-lock', label: 'App Lock', description: 'Disabled', icon: Shield, type: 'link' },
        { id: 'export', label: 'Export Data', icon: Download, type: 'link' },
        { id: 'delete', label: 'Delete Account', icon: Trash2, type: 'link' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: HelpCircle, type: 'link' },
        { id: 'feedback', label: 'Send Feedback', icon: Mail, type: 'link' },
      ],
    },
  ]

  const handleToggle = (id: string) => {
    switch (id) {
      case 'theme':
        setDarkMode(!darkMode)
        break
      case 'notifications':
        setNotifications(!notifications)
        break
      case 'reminder':
        setDailyReminder(!dailyReminder)
        break
    }
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-dayo-gray-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-dayo-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-dayo-gray-900">
                {user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-dayo-gray-500">{user?.email}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-dayo-gray-400" />
          </div>
        </div>

        {/* Premium Banner */}
        <div className="bg-gradient-to-r from-dayo-purple to-dayo-pink rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-center gap-3">
            <Crown className="w-10 h-10" />
            <div className="flex-1">
              <p className="font-semibold">Upgrade to Premium</p>
              <p className="text-sm text-white/80">Unlock all features and remove limits</p>
            </div>
            <button className="bg-white text-dayo-purple px-4 py-2 rounded-xl text-sm font-medium">
              Upgrade
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                {section.items.map((item, index) => {
                  const Icon = item.icon
                  const isLast = index === section.items.length - 1
                  const isDelete = item.id === 'delete'

                  return (
                    <button
                      key={item.id}
                      onClick={() => item.type === 'toggle' && handleToggle(item.id)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-dayo-gray-50 transition-colors ${
                        !isLast ? 'border-b border-dayo-gray-100' : ''
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isDelete
                            ? 'bg-red-50 text-red-500'
                            : 'bg-dayo-gray-100 text-dayo-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${isDelete ? 'text-red-500' : 'text-dayo-gray-900'}`}>
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-xs text-dayo-gray-500">{item.description}</p>
                        )}
                      </div>
                      {item.type === 'toggle' ? (
                        <div
                          className={`w-12 h-7 rounded-full p-1 transition-colors ${
                            item.value ? 'bg-dayo-purple' : 'bg-dayo-gray-200'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              item.value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-dayo-gray-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-dayo-gray-100 text-red-500 font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        {/* App Version */}
        <p className="text-center text-xs text-dayo-gray-400 mt-6">
          DAYO v1.0.0
        </p>
      </main>

      <BottomNavigation />
    </div>
  )
}
