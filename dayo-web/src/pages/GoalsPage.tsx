import { useState } from 'react'
import { Plus, Target, ChevronRight, Trophy, Calendar, MoreHorizontal } from 'lucide-react'
import BottomNavigation from '../components/ui/BottomNavigation'

interface Milestone {
  id: string
  title: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  category: 'yearly' | 'monthly' | 'weekly'
  progress: number
  color: string
  icon: string
  milestones: Milestone[]
  dueDate: string
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Read 24 Books',
    description: 'Read 2 books per month',
    category: 'yearly',
    progress: 25,
    color: '#8B5CF6',
    icon: '📚',
    dueDate: '2026-12-31',
    milestones: [
      { id: '1-1', title: 'Read 6 books (Q1)', completed: true },
      { id: '1-2', title: 'Read 12 books (Q2)', completed: false },
      { id: '1-3', title: 'Read 18 books (Q3)', completed: false },
      { id: '1-4', title: 'Read 24 books (Q4)', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Exercise 4x per week',
    description: 'Stay consistent with workouts',
    category: 'weekly',
    progress: 75,
    color: '#10B981',
    icon: '💪',
    dueDate: '2026-01-19',
    milestones: [
      { id: '2-1', title: 'Monday workout', completed: true },
      { id: '2-2', title: 'Wednesday workout', completed: true },
      { id: '2-3', title: 'Friday workout', completed: true },
      { id: '2-4', title: 'Sunday workout', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Launch DAYO MVP',
    description: 'Complete the MVP and deploy',
    category: 'monthly',
    progress: 60,
    color: '#F97316',
    icon: '🚀',
    dueDate: '2026-01-31',
    milestones: [
      { id: '3-1', title: 'Design complete', completed: true },
      { id: '3-2', title: 'Core features built', completed: true },
      { id: '3-3', title: 'Testing complete', completed: false },
      { id: '3-4', title: 'Deploy to production', completed: false },
    ],
  },
  {
    id: '4',
    title: 'Save $5000',
    description: 'Emergency fund goal',
    category: 'yearly',
    progress: 40,
    color: '#3B82F6',
    icon: '💰',
    dueDate: '2026-12-31',
    milestones: [
      { id: '4-1', title: 'Save $1000', completed: true },
      { id: '4-2', title: 'Save $2500', completed: true },
      { id: '4-3', title: 'Save $4000', completed: false },
      { id: '4-4', title: 'Save $5000', completed: false },
    ],
  },
]

const categoryLabels = {
  yearly: 'Yearly Goals',
  monthly: 'Monthly Goals',
  weekly: 'Weekly Goals',
}

export default function GoalsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'yearly' | 'monthly' | 'weekly'>('all')
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)

  const filteredGoals = selectedCategory === 'all'
    ? mockGoals
    : mockGoals.filter(goal => goal.category === selectedCategory)

  const stats = {
    total: mockGoals.length,
    completed: mockGoals.filter(g => g.progress === 100).length,
    inProgress: mockGoals.filter(g => g.progress > 0 && g.progress < 100).length,
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-dayo-gray-900">Goals</h1>
            <button className="flex items-center gap-1.5 bg-dayo-gradient text-white text-sm font-medium px-4 py-2 rounded-xl">
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-dayo-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-dayo-purple">{stats.total}</p>
              <p className="text-xs text-dayo-gray-500">Total</p>
            </div>
            <div className="bg-dayo-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
              <p className="text-xs text-dayo-gray-500">Completed</p>
            </div>
            <div className="bg-dayo-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-dayo-orange">{stats.inProgress}</p>
              <p className="text-xs text-dayo-gray-500">In Progress</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'yearly', 'monthly', 'weekly'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as typeof selectedCategory)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-dayo-purple text-white'
                  : 'bg-white text-dayo-gray-600 border border-dayo-gray-200'
              }`}
            >
              {category === 'all' ? 'All Goals' : categoryLabels[category as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-8 text-center">
              <Target className="w-12 h-12 text-dayo-gray-300 mx-auto mb-4" />
              <p className="text-dayo-gray-500 mb-4">No goals yet</p>
              <button className="text-sm text-dayo-purple font-medium">
                Create your first goal
              </button>
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${goal.color}15` }}
                    >
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-dayo-gray-900">{goal.title}</h3>
                          <p className="text-xs text-dayo-gray-500 mt-0.5">{goal.description}</p>
                        </div>
                        <button className="text-dayo-gray-400 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-dayo-gray-500">Progress</span>
                          <span className="font-medium" style={{ color: goal.color }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-dayo-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                          />
                        </div>
                      </div>

                      {/* Category & Due Date */}
                      <div className="flex items-center gap-3 mt-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
                        >
                          {goal.category}
                        </span>
                        <span className="text-xs text-dayo-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Milestones */}
                {expandedGoal === goal.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-dayo-gray-100">
                    <p className="text-xs font-medium text-dayo-gray-500 mb-3">MILESTONES</p>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-dayo-gray-50"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              milestone.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-dayo-gray-300'
                            }`}
                          >
                            {milestone.completed && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              milestone.completed ? 'text-dayo-gray-400 line-through' : 'text-dayo-gray-700'
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Achievement Teaser */}
        <div className="mt-6 bg-gradient-to-r from-dayo-purple to-dayo-pink rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <Trophy className="w-10 h-10" />
            <div>
              <p className="font-semibold">Keep going!</p>
              <p className="text-sm text-white/80">You're 2 goals away from your next achievement</p>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
