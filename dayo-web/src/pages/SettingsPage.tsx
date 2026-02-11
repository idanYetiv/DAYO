import { useState, useRef } from 'react'
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
  Users,
  Image,
  Upload,
  Globe,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDirection } from '../hooks/useDirection'
import { useAuthStore } from '../store/authStore'
import { useProfileMode, type ProfileType } from '../hooks/useProfileMode'
import BottomNavigation from '../components/ui/BottomNavigation'
import {
  useUserProfile,
  useUpdateUserProfile,
  useExportUserData,
  useDeleteAccount,
  useChangePassword,
} from '../hooks/useUserProfile'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { toast } from 'sonner'
import { visualThemesList, type VisualThemeId } from '../data/visualThemes'
import ThemedHeader from '../components/ui/ThemedHeader'
import { supportedLanguages, type LanguageCode } from '../i18n'

const themeColors = [
  { id: 'purple', labelKey: 'modals.themeColor.colors.purple', color: '#8B5CF6' },
  { id: 'blue', labelKey: 'modals.themeColor.colors.blue', color: '#3B82F6' },
  { id: 'green', labelKey: 'modals.themeColor.colors.green', color: '#10B981' },
  { id: 'orange', labelKey: 'modals.themeColor.colors.orange', color: '#F97316' },
  { id: 'pink', labelKey: 'modals.themeColor.colors.pink', color: '#EC4899' },
] as const

export default function SettingsPage() {
  const { t, i18n } = useTranslation('settings')
  const { user, signOut } = useAuthStore()
  const { data: profile, isLoading } = useUserProfile()
  const updateProfile = useUpdateUserProfile()
  const exportData = useExportUserData()
  const deleteAccount = useDeleteAccount()
  const changePassword = useChangePassword()
  const { profileType, setProfileType, isKidsMode } = useProfileMode()
  const { requestPermission, isSupported: isPushSupported } = usePushNotifications()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showVisualThemeModal, setShowVisualThemeModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showProfileModeModal, setShowProfileModeModal] = useState(false)
  const [showBackgroundModal, setShowBackgroundModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  const currentLanguage = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0]

  const handleToggle = (field: 'dark_mode' | 'notifications_enabled' | 'daily_reminder_enabled') => {
    if (!profile) return

    const newValue = !profile[field]
    const settingName = field === 'dark_mode'
      ? t('preferences.darkMode')
      : field === 'notifications_enabled'
        ? t('preferences.pushNotifications')
        : t('preferences.dailyReminder')

    updateProfile.mutate(
      { [field]: newValue },
      {
        onSuccess: () => {
          toast.success(t(newValue ? 'toast.enabled' : 'toast.disabled', { setting: settingName }))
        },
        onError: () => {
          toast.error(t('toast.updateError'))
        }
      }
    )
  }

  // Handle notifications toggle with push permission request
  const handleNotificationsToggle = async () => {
    if (!profile) return

    const enabling = !profile.notifications_enabled

    if (enabling && isPushSupported) {
      // Request push permission first
      const granted = await requestPermission()
      if (!granted) {
        toast.error(t('toast.updateError'))
        return
      }
    }

    // Update the setting
    updateProfile.mutate(
      { notifications_enabled: enabling },
      {
        onSuccess: () => {
          toast.success(t(enabling ? 'toast.enabled' : 'toast.disabled', { setting: t('preferences.pushNotifications') }))
        },
        onError: () => {
          toast.error(t('toast.updateError'))
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
        toast.success(t('toast.exportSuccess'))
      },
      onError: () => {
        toast.error(t('toast.exportError'))
      }
    })
  }

  const handleDeleteAccount = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('modals.deleteAccount.success'))
        signOut()
      },
      onError: () => {
        toast.error(t('modals.deleteAccount.error'))
      }
    })
  }

  const handleLanguageChange = (langCode: LanguageCode) => {
    i18n.changeLanguage(langCode)
    toast.success(t('modals.language.success'))
    setShowLanguageModal(false)
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      <ThemedHeader title={t('title')} showLogo={false} />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* User Card */}
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-full bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 mb-6 text-start"
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
            <ChevronRight className="w-5 h-5 text-dayo-gray-400 rtl-flip" />
          </div>
        </button>

        {/* Premium Banner */}
        <div className="bg-gradient-to-r from-dayo-purple to-dayo-pink rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-center gap-3">
            <Crown className="w-10 h-10" />
            <div className="flex-1">
              <p className="font-semibold">{t('premium.title')}</p>
              <p className="text-sm text-white/80">{t('premium.description')}</p>
            </div>
            <button className="bg-white text-dayo-purple px-4 py-2 rounded-xl text-sm font-medium">
              {t('actions.upgrade', { ns: 'common' })}
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
                {t('sections.preferences')}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                {/* Dark Mode */}
                <SettingToggle
                  icon={profile.dark_mode ? Moon : Sun}
                  label={t('preferences.darkMode')}
                  value={profile.dark_mode}
                  onToggle={() => handleToggle('dark_mode')}
                />
                {/* Notifications */}
                <SettingToggle
                  icon={Bell}
                  label={t('preferences.pushNotifications')}
                  value={profile.notifications_enabled}
                  onToggle={handleNotificationsToggle}
                  description={!isPushSupported ? t('preferences.notificationsUnavailable') : undefined}
                  hasBorder
                />
                {/* Daily Reminder */}
                <SettingToggle
                  icon={Bell}
                  label={t('preferences.dailyReminder')}
                  description={profile.daily_reminder_time?.slice(0, 5) || '09:00'}
                  value={profile.daily_reminder_enabled}
                  onToggle={() => handleToggle('daily_reminder_enabled')}
                  hasBorder
                />
              </div>
            </div>

            {/* Profile Mode */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                {t('sections.profileMode')}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Users}
                  label={t('profileMode.title')}
                  description={isKidsMode ? t('profileMode.kids.label') : t('profileMode.adult.label')}
                  onClick={() => setShowProfileModeModal(true)}
                />
              </div>
            </div>

            {/* Appearance */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                {t('sections.appearance')}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Globe}
                  label={t('modals.language.title')}
                  description={currentLanguage.nativeLabel}
                  onClick={() => setShowLanguageModal(true)}
                />
                <SettingLink
                  icon={Palette}
                  label={t('appearance.visualTheme')}
                  description={t(`modals.visualTheme.themes.${profile.visual_theme === 'night-ritual' ? 'nightRitual' : profile.visual_theme === 'private-notebook' ? 'privateNotebook' : profile.visual_theme === 'cosmic-calm' ? 'cosmicCalm' : profile.visual_theme || 'default'}.name`)}
                  onClick={() => setShowVisualThemeModal(true)}
                  hasBorder
                />
                <SettingLink
                  icon={Palette}
                  label={t('appearance.accentColor')}
                  description={t(themeColors.find(c => c.id === profile.theme_color)?.labelKey || 'modals.themeColor.colors.purple')}
                  onClick={() => setShowThemeModal(true)}
                  hasBorder
                />
                <SettingLink
                  icon={Image}
                  label={t('appearance.background')}
                  description={profile.background_image ? t('appearance.custom') : t('appearance.default')}
                  onClick={() => setShowBackgroundModal(true)}
                  hasBorder
                />
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                {t('sections.account')}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Mail}
                  label={t('account.email')}
                  description={user?.email || t('account.notSet')}
                  onClick={() => {}}
                  disabled
                />
                <SettingLink
                  icon={Lock}
                  label={t('account.changePassword')}
                  onClick={() => setShowPasswordModal(true)}
                  hasBorder
                />
              </div>
            </div>

            {/* Privacy & Data */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                {t('sections.privacyData')}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={Download}
                  label={t('privacyData.exportData')}
                  description={t('privacyData.exportDescription')}
                  onClick={handleExportData}
                  isLoading={exportData.isPending}
                />
                <SettingLink
                  icon={Trash2}
                  label={t('privacyData.deleteAccount')}
                  onClick={() => setShowDeleteModal(true)}
                  isDanger
                  hasBorder
                />
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-semibold text-dayo-gray-400 uppercase tracking-wider mb-2 px-1">
                {t('sections.support')}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
                <SettingLink
                  icon={HelpCircle}
                  label={t('support.helpCenter')}
                  onClick={() => window.open('https://dayo.app/help', '_blank')}
                />
                <SettingLink
                  icon={Mail}
                  label={t('support.sendFeedback')}
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
          {t('signOut')}
        </button>

        {/* App Version */}
        <p className="text-center text-xs text-dayo-gray-400 mt-6">
          {t('version', { version: '1.0.0' })}
        </p>
      </main>

      {/* Modals */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={(password) => {
            changePassword.mutate(password, {
              onSuccess: () => {
                toast.success(t('modals.changePassword.success'))
                setShowPasswordModal(false)
              },
              onError: () => {
                toast.error(t('modals.changePassword.error'))
              }
            })
          }}
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
                toast.success(t('modals.themeColor.success'))
                setShowThemeModal(false)
              }
            })
          }}
        />
      )}

      {showVisualThemeModal && profile && (
        <VisualThemeModal
          currentTheme={(profile.visual_theme as VisualThemeId) || 'default'}
          onClose={() => setShowVisualThemeModal(false)}
          onSelect={(themeId) => {
            updateProfile.mutate({ visual_theme: themeId }, {
              onSuccess: () => {
                toast.success(t('modals.visualTheme.success'))
                setShowVisualThemeModal(false)
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
                toast.success(t('modals.editProfile.success'))
                setShowProfileModal(false)
              }
            })
          }}
          isLoading={updateProfile.isPending}
        />
      )}

      {showProfileModeModal && (
        <ProfileModeModal
          currentMode={profileType}
          onClose={() => setShowProfileModeModal(false)}
          onSelect={(mode) => {
            setProfileType(mode)
            toast.success(t('profileMode.switchedTo', { mode: mode === 'kid' ? t('profileMode.kids.label') : t('profileMode.adult.label') }))
            setShowProfileModeModal(false)
          }}
        />
      )}

      {showBackgroundModal && (
        <BackgroundModal
          currentBackground={profile?.background_image || null}
          isKidsMode={isKidsMode}
          onClose={() => setShowBackgroundModal(false)}
          onSelect={(bg) => {
            updateProfile.mutate({ background_image: bg }, {
              onSuccess: () => {
                toast.success(t('modals.background.success'))
                setShowBackgroundModal(false)
              }
            })
          }}
        />
      )}

      {showLanguageModal && (
        <LanguageModal
          currentLanguage={i18n.language as LanguageCode}
          onClose={() => setShowLanguageModal(false)}
          onSelect={handleLanguageChange}
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
  const { isRTL } = useDirection()

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
      <div className="flex-1 text-start">
        <p className={`font-medium ${isDanger ? 'text-red-500' : 'text-dayo-gray-900'}`}>
          {label}
        </p>
        {description && <p className="text-xs text-dayo-gray-500">{description}</p>}
      </div>
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-dayo-gray-400 animate-spin" />
      ) : (
        <ChevronRight className={`w-5 h-5 text-dayo-gray-400 ${isRTL ? 'rtl-flip' : ''}`} />
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
  const { t } = useTranslation('settings')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError(t('modals.changePassword.errors.tooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('modals.changePassword.errors.mismatch'))
      return
    }
    onSubmit(password)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white modal-content rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">{t('modals.changePassword.title')}</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('modals.changePassword.newPassword')}</label>
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
            <label className="text-sm font-medium text-dayo-gray-700">{t('modals.changePassword.confirmPassword')}</label>
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
            {t('modals.changePassword.submit')}
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
      <div className="bg-white modal-content rounded-2xl w-full max-w-md">
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
  const { t } = useTranslation('settings')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white modal-content rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">{t('modals.themeColor.title')}</h2>
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
              <span className="flex-1 text-start font-medium text-dayo-gray-900">
                {t(theme.labelKey)}
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

// Visual Theme Modal
interface VisualThemeModalProps {
  currentTheme: VisualThemeId
  onClose: () => void
  onSelect: (themeId: VisualThemeId) => void
}

// Theme preview decorations
const themeDecorations: Record<VisualThemeId, React.ReactNode> = {
  'default': null,
  'night-ritual': (
    // Moon and stars
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-2 right-3 w-6 h-6 bg-yellow-100 rounded-full shadow-lg shadow-yellow-200/50" />
      <div className="absolute top-2 right-3 w-5 h-5 bg-[#1a1a2e] rounded-full translate-x-1" />
      {/* Stars */}
      <div className="absolute top-3 left-3 w-1 h-1 bg-white rounded-full opacity-80" />
      <div className="absolute top-5 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
      <div className="absolute top-2 left-12 w-1 h-1 bg-white rounded-full opacity-70" />
      <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
      {/* Clouds */}
      <div className="absolute bottom-2 right-0 w-16 h-4 bg-gradient-to-t from-slate-700/30 to-transparent rounded-full blur-sm" />
    </div>
  ),
  'diary': (
    // Sun setting
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-5 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-t-full opacity-90" />
      {/* Water reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-orange-500/40 to-transparent" />
    </div>
  ),
  'private-notebook': (
    // Notebook lines
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute top-4 left-2 right-2 h-px bg-gray-400" />
      <div className="absolute top-7 left-2 right-2 h-px bg-gray-400" />
      <div className="absolute top-10 left-2 right-2 h-px bg-gray-400" />
      <div className="absolute top-13 left-2 right-2 h-px bg-gray-400" />
    </div>
  ),
  'cosmic-calm': (
    // Stars and nebula
    <div className="absolute inset-0 overflow-hidden">
      {/* Stars */}
      <div className="absolute top-2 left-3 w-1 h-1 bg-purple-200 rounded-full opacity-90" />
      <div className="absolute top-4 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
      <div className="absolute top-3 right-4 w-1 h-1 bg-purple-300 rounded-full opacity-80" />
      <div className="absolute top-6 left-5 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
      <div className="absolute bottom-3 right-6 w-1 h-1 bg-indigo-300 rounded-full opacity-75" />
      <div className="absolute bottom-5 left-10 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
      <div className="absolute top-8 right-8 w-0.5 h-0.5 bg-purple-200 rounded-full opacity-65" />
      {/* Nebula glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-purple-500/20 rounded-full blur-xl" />
    </div>
  ),
}

function VisualThemeModal({ currentTheme, onClose, onSelect }: VisualThemeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white modal-content dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-dayo-gray-900 dark:text-white">Visual Theme</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            {visualThemesList.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onSelect(theme.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  currentTheme === theme.id
                    ? 'border-dayo-purple ring-2 ring-dayo-purple/20'
                    : 'border-dayo-gray-200 dark:border-gray-600 hover:border-dayo-gray-300'
                }`}
              >
                <div
                  className="h-20 rounded-lg mb-2 relative overflow-hidden"
                  style={{ background: theme.backgroundImage || theme.colors.gradient }}
                >
                  {/* Theme decorations */}
                  {themeDecorations[theme.id]}

                  {/* Mini card preview */}
                  <div
                    className="absolute bottom-1.5 left-1.5 right-1.5 h-6 rounded opacity-90"
                    style={{
                      background: theme.colors.cardBg,
                      border: theme.isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
                    }}
                  />

                  {currentTheme === theme.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-dayo-gray-900 dark:text-white text-sm">
                  {theme.name}
                </p>
                <p className="text-xs text-dayo-gray-500 dark:text-gray-400">
                  {theme.description}
                </p>
              </button>
            ))}
          </div>
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
      <div className="bg-white modal-content rounded-2xl w-full max-w-md">
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

// Profile Mode Modal
interface ProfileModeModalProps {
  currentMode: ProfileType
  onClose: () => void
  onSelect: (mode: ProfileType) => void
}

const profileModes: { id: ProfileType; label: string; description: string; emoji: string }[] = [
  {
    id: 'adult',
    label: 'Adults Mode',
    description: 'Calm, reflective journaling experience',
    emoji: '✨',
  },
  {
    id: 'kid',
    label: 'Kids Mode',
    description: 'Fun, colorful adventure journal',
    emoji: '🦁',
  },
]

function ProfileModeModal({ currentMode, onClose, onSelect }: ProfileModeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white modal-content rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">Profile Mode</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {profileModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                currentMode === mode.id
                  ? 'border-dayo-purple bg-dayo-purple/5'
                  : 'border-dayo-gray-100 hover:border-dayo-gray-200'
              }`}
            >
              <span className="text-3xl">{mode.emoji}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-dayo-gray-900">{mode.label}</p>
                <p className="text-sm text-dayo-gray-500">{mode.description}</p>
              </div>
              {currentMode === mode.id && (
                <Check className="w-5 h-5 text-dayo-purple" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Background Modal
interface BackgroundModalProps {
  currentBackground: string | null
  isKidsMode: boolean
  onClose: () => void
  onSelect: (background: string | null) => void
}

// Preset backgrounds - gradients and patterns
const adultBackgrounds = [
  { id: 'none', label: 'Default', value: null, preview: 'bg-dayo-gray-50' },
  { id: 'gradient-purple', label: 'Purple Mist', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', preview: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { id: 'gradient-ocean', label: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #17a2b8 100%)', preview: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
  { id: 'gradient-sunset', label: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', preview: 'bg-gradient-to-br from-pink-400 to-rose-500' },
  { id: 'gradient-forest', label: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', preview: 'bg-gradient-to-br from-teal-500 to-green-400' },
  { id: 'gradient-night', label: 'Night Sky', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', preview: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' },
]

const kidsBackgrounds = [
  { id: 'none', label: 'Default', value: null, preview: 'bg-dayo-kids-yellow/10' },
  { id: 'rainbow', label: 'Rainbow', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 20%, #48dbfb 40%, #ff9ff3 60%, #54a0ff 80%, #5f27cd 100%)', preview: 'bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-purple-500' },
  { id: 'candy', label: 'Candy Land', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', preview: 'bg-gradient-to-br from-pink-300 to-pink-200' },
  { id: 'space', label: 'Space Adventure', value: 'linear-gradient(135deg, #0c0c2d 0%, #1a1a4e 50%, #2d2d6b 100%)', preview: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800' },
  { id: 'jungle', label: 'Jungle', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', preview: 'bg-gradient-to-br from-emerald-800 to-green-500' },
  { id: 'ocean', label: 'Under the Sea', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #00d4ff 100%)', preview: 'bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-400' },
  { id: 'sunshine', label: 'Sunshine', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', preview: 'bg-gradient-to-br from-yellow-400 to-orange-400' },
]

function BackgroundModal({ currentBackground, isKidsMode, onClose, onSelect }: BackgroundModalProps) {
  const backgrounds = isKidsMode ? kidsBackgrounds : adultBackgrounds
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        onSelect(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">Background</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {/* Preset backgrounds */}
          <p className="text-sm font-medium text-dayo-gray-700 mb-3">Presets</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onSelect(bg.value)}
                className={`aspect-square rounded-xl overflow-hidden relative ${bg.preview} ${
                  currentBackground === bg.value ? 'ring-2 ring-dayo-purple ring-offset-2' : 'hover:opacity-80'
                }`}
              >
                {currentBackground === bg.value && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
                <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-white text-center bg-black/30 rounded px-1">
                  {bg.label}
                </span>
              </button>
            ))}
          </div>

          {/* Custom photo upload */}
          <p className="text-sm font-medium text-dayo-gray-700 mb-3">Custom Photo</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-dayo-gray-200 rounded-xl hover:border-dayo-purple transition-colors flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-dayo-gray-400" />
            <span className="text-sm text-dayo-gray-500">Upload your own photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Show current custom background if set */}
          {currentBackground && !backgrounds.some(b => b.value === currentBackground) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-dayo-gray-700 mb-2">Current Custom</p>
              <div
                className="aspect-video rounded-xl bg-cover bg-center ring-2 ring-dayo-purple"
                style={{ backgroundImage: currentBackground.startsWith('data:') ? `url(${currentBackground})` : currentBackground }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Language Modal
interface LanguageModalProps {
  currentLanguage: LanguageCode
  onClose: () => void
  onSelect: (langCode: LanguageCode) => void
}

function LanguageModal({ currentLanguage, onClose, onSelect }: LanguageModalProps) {
  const { t } = useTranslation('settings')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white modal-content rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">{t('modals.language.title')}</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dayo-gray-50"
            >
              <span className="text-2xl">{lang.code === 'he' ? '🇮🇱' : '🇺🇸'}</span>
              <div className="flex-1 text-start">
                <span className="font-medium text-dayo-gray-900">{lang.nativeLabel}</span>
                <span className="text-sm text-dayo-gray-500 ms-2">({lang.label})</span>
              </div>
              {currentLanguage === lang.code && (
                <Check className="w-5 h-5 text-dayo-purple" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
