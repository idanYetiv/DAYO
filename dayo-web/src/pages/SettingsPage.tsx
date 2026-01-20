import { useState } from 'react'
import {
  Bell,
  Palette,
  Download,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Mail,
  Lock,
  Trash2,
  Crown,
  Loader2,
  X,
  Check,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import BottomNavigation from '../components/ui/BottomNavigation'
import {
  useUserProfile,
  useUpdateUserProfile,
  useExportUserData,
  useDeleteAccount,
  useChangePassword,
} from '../hooks/useUserProfile'
import { toast } from 'sonner'

const themeColors = [
  { id: 'purple', label: 'Purple', color: '#8B5CF6' },
  { id: 'blue', label: 'Blue', color: '#3B82F6' },
  { id: 'green', label: 'Green', color: '#10B981' },
  { id: 'orange', label: 'Orange', color: '#F97316' },
  { id: 'pink', label: 'Pink', color: '#EC4899' },
] as const

export default function SettingsPage() {
  const { user, signOut } = useAuthStore()
  const { data: profile, isLoading } = useUserProfile()
  const updateProfile = useUpdateUserProfile()
  const exportData = useExportUserData()
  const deleteAccount = useDeleteAccount()
  const changePassword = useChangePassword()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleToggle = (field: 'dark_mode' | 'notifications_enabled' | 'daily_reminder_enabled') => {
    if (!profile) return

    const newValue = !profile[field]
    updateProfile.mutate(
      { [field]: newValue },
      {
        onSuccess: () => {
          toast.success(`${field === 'dark_mode' ? 'Dark mode' : field === 'notifications_enabled' ? 'Notifications' : 'Daily reminder'} ${newValue ? 'enabled' : 'disabled'}`)
        },
        onError: () => {
          toast.error('Failed to update setting')
        }
      }
    )
  }

  const handleExportData = () => {
    exportData.mutate(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dayo-export-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Data exported successfully')
      },
      onError: () => {
        toast.error('Failed to export data')
      }
    })
  }

  const handleDeleteAccount = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success('Account deleted')
        signOut()
      },
      onError: () => {
        toast.error('Failed to delete account')
      }
    })
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
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-full bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 mb-6 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-dayo-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.display_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-dayo-gray-900">
                {profile?.display_name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-dayo-gray-500">{user?.email}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-dayo-gray-400" />
          </div>
        </button>

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
          </div>
        )}

        {!isLoading && profile && (
          <div className="space-y-6">
            {/* Preferences */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                Preferences
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                {/* Dark Mode */}
                <SettingToggle
                  icon={profile.dark_mode ? Moon : Sun}
                  label="Dark Mode"
                  value={profile.dark_mode}
                  onToggle={() => handleToggle('dark_mode')}
                />
                {/* Notifications */}
                <SettingToggle
                  icon={Bell}
                  label="Push Notifications"
                  value={profile.notifications_enabled}
                  onToggle={() => handleToggle('notifications_enabled')}
                  hasBorder
                />
                {/* Daily Reminder */}
                <SettingToggle
                  icon={Bell}
                  label="Daily Reminder"
                  description={profile.daily_reminder_time?.slice(0, 5) || '09:00'}
                  value={profile.daily_reminder_enabled}
                  onToggle={() => handleToggle('daily_reminder_enabled')}
                  hasBorder
                />
              </div>
            </div>

            {/* Appearance */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                Appearance
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Palette}
                  label="Theme Color"
                  description={themeColors.find(c => c.id === profile.theme_color)?.label || 'Purple'}
                  onClick={() => setShowThemeModal(true)}
                />
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                Account
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Mail}
                  label="Email"
                  description={user?.email || 'Not set'}
                  onClick={() => {}}
                  disabled
                />
                <SettingLink
                  icon={Lock}
                  label="Change Password"
                  onClick={() => setShowPasswordModal(true)}
                  hasBorder
                />
              </div>
            </div>

            {/* Privacy & Data */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                Privacy & Data
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Download}
                  label="Export Data"
                  description="Download all your data as JSON"
                  onClick={handleExportData}
                  isLoading={exportData.isPending}
                />
                <SettingLink
                  icon={Trash2}
                  label="Delete Account"
                  onClick={() => setShowDeleteModal(true)}
                  isDanger
                  hasBorder
                />
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                Support
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={HelpCircle}
                  label="Help Center"
                  onClick={() => window.open('https://dayo.app/help', '_blank')}
                />
                <SettingLink
                  icon={Mail}
                  label="Send Feedback"
                  onClick={() => window.open('mailto:support@dayo.app', '_blank')}
                  hasBorder
                />
              </div>
            </div>
          </div>
        )}

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

      {/* Modals */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={changePassword.mutate}
          isLoading={changePassword.isPending}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isLoading={deleteAccount.isPending}
        />
      )}

      {showThemeModal && profile && (
        <ThemeColorModal
          currentColor={profile.theme_color}
          onClose={() => setShowThemeModal(false)}
          onSelect={(color) => {
            updateProfile.mutate({ theme_color: color }, {
              onSuccess: () => {
                toast.success('Theme color updated')
                setShowThemeModal(false)
              }
            })
          }}
        />
      )}

      {showProfileModal && profile && (
        <EditProfileModal
          displayName={profile.display_name || ''}
          onClose={() => setShowProfileModal(false)}
          onSubmit={(name) => {
            updateProfile.mutate({ display_name: name }, {
              onSuccess: () => {
                toast.success('Profile updated')
                setShowProfileModal(false)
              }
            })
          }}
          isLoading={updateProfile.isPending}
        />
      )}

      <BottomNavigation />
    </div>
  )
}

// Setting Toggle Component
interface SettingToggleProps {
  icon: React.ElementType
  label: string
  description?: string
  value: boolean
  onToggle: () => void
  hasBorder?: boolean
}

function SettingToggle({ icon: Icon, label, description, value, onToggle, hasBorder }: SettingToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-4 hover:bg-dayo-gray-50 transition-colors ${
        hasBorder ? 'border-t border-dayo-gray-100' : ''
      }`}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-dayo-gray-100 text-dayo-gray-600">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-dayo-gray-900">{label}</p>
        {description && <p className="text-xs text-dayo-gray-500">{description}</p>}
      </div>
      <div
        className={`w-12 h-7 rounded-full p-1 transition-colors ${
          value ? 'bg-dayo-purple' : 'bg-dayo-gray-200'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  )
}

// Setting Link Component
interface SettingLinkProps {
  icon: React.ElementType
  label: string
  description?: string
  onClick: () => void
  hasBorder?: boolean
  isDanger?: boolean
  disabled?: boolean
  isLoading?: boolean
}

function SettingLink({ icon: Icon, label, description, onClick, hasBorder, isDanger, disabled, isLoading }: SettingLinkProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full flex items-center gap-3 p-4 hover:bg-dayo-gray-50 transition-colors disabled:opacity-50 ${
        hasBorder ? 'border-t border-dayo-gray-100' : ''
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          isDanger ? 'bg-red-50 text-red-500' : 'bg-dayo-gray-100 text-dayo-gray-600'
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${isDanger ? 'text-red-500' : 'text-dayo-gray-900'}`}>
          {label}
        </p>
        {description && <p className="text-xs text-dayo-gray-500">{description}</p>}
      </div>
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-dayo-gray-400 animate-spin" />
      ) : (
        <ChevronRight className="w-5 h-5 text-dayo-gray-400" />
      )}
    </button>
  )
}

// Change Password Modal
interface ChangePasswordModalProps {
  onClose: () => void
  onSubmit: (password: string) => void
  isLoading: boolean
}

function ChangePasswordModal({ onClose, onSubmit, isLoading }: ChangePasswordModalProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    onSubmit(password)
    toast.success('Password changed successfully')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">Change Password</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-dayo-gradient text-white font-medium py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}

// Delete Account Modal
interface DeleteAccountModalProps {
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

function DeleteAccountModal({ onClose, onConfirm, isLoading }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-red-500">Delete Account</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-dayo-gray-600">
            This action cannot be undone. All your data including tasks, diary entries, goals, and habits will be permanently deleted.
          </p>

          <div>
            <label className="text-sm font-medium text-dayo-gray-700">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              placeholder="DELETE"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-dayo-gray-200 text-dayo-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmText !== 'DELETE' || isLoading}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Theme Color Modal
interface ThemeColorModalProps {
  currentColor: string
  onClose: () => void
  onSelect: (color: 'purple' | 'blue' | 'green' | 'orange' | 'pink') => void
}

function ThemeColorModal({ currentColor, onClose, onSelect }: ThemeColorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">Theme Color</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {themeColors.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dayo-gray-50"
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: theme.color }}
              />
              <span className="flex-1 text-left font-medium text-dayo-gray-900">
                {theme.label}
              </span>
              {currentColor === theme.id && (
                <Check className="w-5 h-5 text-dayo-purple" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Edit Profile Modal
interface EditProfileModalProps {
  displayName: string
  onClose: () => void
  onSubmit: (name: string) => void
  isLoading: boolean
}

function EditProfileModal({ displayName, onClose, onSubmit, isLoading }: EditProfileModalProps) {
  const [name, setName] = useState(displayName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-dayo-gradient text-white font-medium py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
