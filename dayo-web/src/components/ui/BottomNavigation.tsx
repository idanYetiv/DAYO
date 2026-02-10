import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, CalendarDays, Bot, Target, BookOpen, Settings } from 'lucide-react'

const navItems = [
  { id: 'today', labelKey: 'nav.today', icon: Calendar, path: '/today' },
  { id: 'calendar', labelKey: 'nav.calendar', icon: CalendarDays, path: '/calendar' },
  { id: 'ai', labelKey: 'nav.ai', icon: Bot, path: '/ai' },
  { id: 'goals', labelKey: 'nav.goals', icon: Target, path: '/goals' },
  { id: 'diary', labelKey: 'nav.diary', icon: BookOpen, path: '/diary' },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings, path: '/settings' },
]

export default function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-4 start-4 end-4 z-50">
      <div className="max-w-lg mx-auto">
        <div className="bottom-nav-bar flex items-center justify-between px-2 py-2 rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path ||
              (item.id === 'today' && location.pathname === '/')

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`bottom-nav-item flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'active' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {t(item.labelKey)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
