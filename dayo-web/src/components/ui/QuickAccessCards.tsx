import { useNavigate } from 'react-router-dom'
import { Target, BookOpen, Sparkles } from 'lucide-react'

export default function QuickAccessCards() {
  const navigate = useNavigate()

  const cards = [
    {
      id: 'goals',
      label: 'Goals',
      icon: Target,
      path: '/goals',
      color: 'text-dayo-purple',
    },
    {
      id: 'diary',
      label: 'Diary',
      icon: BookOpen,
      path: '/diary',
      color: 'text-dayo-purple',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: Sparkles,
      path: '/dashboard',
      color: 'text-dayo-orange',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <button
            key={card.id}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-dayo-gray-100 hover:border-dayo-purple/30 hover:shadow-dayo transition-all flex flex-col items-center gap-2"
          >
            <Icon className={`w-7 h-7 ${card.color}`} />
            <span className="text-sm font-medium text-dayo-gray-700">{card.label}</span>
          </button>
        )
      })}
    </div>
  )
}
