import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, CalendarDays, Flame, Target, BookOpen, Settings } from 'lucide-react'

const navItems = [
  { id: 'today', label: 'Today', icon: Calendar, path: '/today' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { id: 'habits', label: 'Habits', icon: Flame, path: '/habits' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
  { id: 'diary', label: 'Diary', icon: BookOpen, path: '/diary' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

export default function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-dayo-gray-100 px-2 py-2 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path ||
            (item.id === 'today' && location.pathname === '/')

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-dayo-purple bg-dayo-purple/10'
                  : 'text-dayo-gray-400 hover:text-dayo-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
