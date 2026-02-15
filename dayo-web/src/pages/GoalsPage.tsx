import { useState } from 'react'
import { Plus, Target, ChevronRight, Trophy, Calendar, MoreHorizontal, Loader2, X, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BottomNavigation from '../components/ui/BottomNavigation'
import ThemedHeader from '../components/ui/ThemedHeader'
import { useGoals, useCreateGoal, useDeleteGoal, useToggleMilestone, useCreateMilestone, useDeleteMilestone, calculateGoalProgress, type GoalWithMilestones } from '../hooks/useGoals'
import { toast } from 'sonner'

const defaultColors = ['#8B5CF6', '#10B981', '#F97316', '#3B82F6', '#EC4899', '#F59E0B']
const defaultIcons = ['🎯', '📚', '💪', '💰', '🚀', '❤️', '🏆', '✨', '🎨', '🧘']

export default function GoalsPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'yearly' | 'monthly' | 'weekly'>('all')
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [showAddMilestone, setShowAddMilestone] = useState<string | null>(null)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')

  // Hooks
  const { data: goals, isLoading, error } = useGoals(
    selectedCategory === 'all' ? undefined : selectedCategory
  )
  const createGoal = useCreateGoal()
  const deleteGoal = useDeleteGoal()
  const toggleMilestone = useToggleMilestone()
  const createMilestone = useCreateMilestone()
  const deleteMilestone = useDeleteMilestone()

  // Stats
  const stats = {
    total: goals?.length || 0,
    completed: goals?.filter(g => calculateGoalProgress(g) === 100).length || 0,
    inProgress: goals?.filter(g => {
      const progress = calculateGoalProgress(g)
      return progress > 0 && progress < 100
    }).length || 0,
  }

  const handleToggleMilestone = (milestoneId: string, currentCompleted: boolean) => {
    toggleMilestone.mutate(
      { id: milestoneId, completed: !currentCompleted },
      {
        onSuccess: () => {
          toast.success(!currentCompleted ? t('goalsPage.toast.milestoneCompleted') : t('goalsPage.toast.milestoneUnchecked'))
        },
        onError: () => {
          toast.error(t('goalsPage.toast.milestoneFailed'))
        }
      }
    )
  }

  const handleDeleteGoal = (goalId: string, goalTitle: string) => {
    if (confirm(t('goalsPage.deleteConfirm', { title: goalTitle }))) {
      deleteGoal.mutate(goalId, {
        onSuccess: () => {
          toast.success(t('goalsPage.toast.goalDeleted'))
          setExpandedGoal(null)
        },
        onError: () => {
          toast.error(t('goalsPage.toast.goalDeleteFailed'))
        }
      })
    }
  }

  const handleAddMilestone = (goalId: string) => {
    if (!newMilestoneTitle.trim()) return

    createMilestone.mutate(
      { goal_id: goalId, title: newMilestoneTitle.trim() },
      {
        onSuccess: () => {
          toast.success(t('goalsPage.toast.milestoneAdded'))
          setNewMilestoneTitle('')
          setShowAddMilestone(null)
        },
        onError: () => {
          toast.error(t('goalsPage.toast.milestoneAddFailed'))
        }
      }
    )
  }

  const handleDeleteMilestone = (milestoneId: string) => {
    deleteMilestone.mutate(milestoneId, {
      onSuccess: () => {
        toast.success(t('goalsPage.toast.milestoneDeleted'))
      },
      onError: () => {
        toast.error(t('goalsPage.toast.milestoneDeleteFailed'))
      }
    })
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      <ThemedHeader
        title={t('nav.goals')}
        showLogo={false}
        rightContent={
          <button
            onClick={() => setShowNewGoalModal(true)}
            className="flex items-center gap-1 bg-dayo-gradient text-white text-xs font-medium px-3 py-1.5 rounded-xl flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('goalsPage.newGoal')}
          </button>
        }
      />
      {/* Stats */}
      <div className="themed-header px-4 pb-3 -mt-1">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="stats-card rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-dayo-purple">{stats.total}</p>
              <p className="text-xs themed-text-secondary">{t('goalsPage.total')}</p>
            </div>
            <div className="stats-card rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
              <p className="text-xs themed-text-secondary">{t('goalsPage.completed')}</p>
            </div>
            <div className="stats-card rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-dayo-orange">{stats.inProgress}</p>
              <p className="text-xs themed-text-secondary">{t('goalsPage.inProgress')}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'yearly', 'monthly', 'weekly'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-dayo-purple text-white'
                  : 'bg-white text-dayo-gray-600 border border-dayo-gray-200'
              }`}
            >
              {category === 'all' ? t('goalsPage.allGoals') : t(`goalsPage.${category}Goals`)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-dayo-purple animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-red-600">{t('goalsPage.failedToLoad')}</p>
          </div>
        )}

        {/* Goals List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {(!goals || goals.length === 0) ? (
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-8 text-center">
                <Target className="w-12 h-12 text-dayo-gray-300 mx-auto mb-4" />
                <p className="text-dayo-gray-500 mb-4">{t('goalsPage.noGoals')}</p>
                <button
                  onClick={() => setShowNewGoalModal(true)}
                  className="text-sm text-dayo-purple font-medium"
                >
                  {t('goalsPage.createFirst')}
                </button>
              </div>
            ) : (
              goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  isExpanded={expandedGoal === goal.id}
                  onToggleExpand={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                  onToggleMilestone={handleToggleMilestone}
                  onDeleteGoal={handleDeleteGoal}
                  onDeleteMilestone={handleDeleteMilestone}
                  showAddMilestone={showAddMilestone === goal.id}
                  setShowAddMilestone={setShowAddMilestone}
                  newMilestoneTitle={newMilestoneTitle}
                  setNewMilestoneTitle={setNewMilestoneTitle}
                  onAddMilestone={handleAddMilestone}
                />
              ))
            )}
          </div>
        )}

        {/* Achievement Teaser */}
        {goals && goals.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-dayo-purple to-dayo-pink rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10" />
              <div>
                <p className="font-semibold">{t('goalsPage.keepGoing')}</p>
                <p className="text-sm text-white/80">
                  {stats.completed > 0
                    ? t('goalsPage.completedCount', { count: stats.completed })
                    : t('goalsPage.trackProgress')}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto" />
            </div>
          </div>
        )}
      </main>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <NewGoalModal
          onClose={() => setShowNewGoalModal(false)}
          onSubmit={createGoal.mutate}
          isLoading={createGoal.isPending}
        />
      )}

      <BottomNavigation />
    </div>
  )
}

// Goal Card Component
interface GoalCardProps {
  goal: GoalWithMilestones
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleMilestone: (id: string, completed: boolean) => void
  onDeleteGoal: (id: string, title: string) => void
  onDeleteMilestone: (id: string) => void
  showAddMilestone: boolean
  setShowAddMilestone: (id: string | null) => void
  newMilestoneTitle: string
  setNewMilestoneTitle: (title: string) => void
  onAddMilestone: (goalId: string) => void
}

function GoalCard({
  goal,
  isExpanded,
  onToggleExpand,
  onToggleMilestone,
  onDeleteGoal,
  onDeleteMilestone,
  showAddMilestone,
  setShowAddMilestone,
  newMilestoneTitle,
  setNewMilestoneTitle,
  onAddMilestone,
}: GoalCardProps) {
  const { t } = useTranslation()
  const progress = calculateGoalProgress(goal)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
      <div className="p-4 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.75rem] leading-none"
            style={{ backgroundColor: `${goal.color}15` }}
          >
            {goal.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-dayo-gray-900">{goal.title}</h3>
                {goal.description && (
                  <p className="text-xs text-dayo-gray-500 mt-0.5">{goal.description}</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteGoal(goal.id, goal.title)
                }}
                className="text-dayo-gray-400 p-1 hover:text-red-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-dayo-gray-500">{t('goalsPage.progress')}</span>
                <span className="font-medium" style={{ color: goal.color }}>
                  {progress}%
                </span>
              </div>
              <div className="h-2 bg-dayo-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: goal.color }}
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
              {goal.due_date && (
                <span className="text-xs text-dayo-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {t('goalsPage.due')} {new Date(goal.due_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Milestones */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-dayo-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-dayo-gray-500">{t('goalsPage.milestones')}</p>
            <button
              onClick={() => setShowAddMilestone(showAddMilestone ? null : goal.id)}
              className="text-xs text-dayo-purple font-medium"
            >
              {t('goalsPage.addMilestone')}
            </button>
          </div>

          {/* Add Milestone Input */}
          {showAddMilestone && (
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder={t('goalsPage.newMilestonePlaceholder')}
                className="flex-1 text-sm border border-dayo-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
                onKeyDown={(e) => e.key === 'Enter' && onAddMilestone(goal.id)}
                autoFocus
              />
              <button
                onClick={() => onAddMilestone(goal.id)}
                className="bg-dayo-purple text-white px-3 py-2 rounded-lg text-sm"
              >
                {t('actions.add')}
              </button>
            </div>
          )}

          {/* Milestones List */}
          <div className="space-y-2">
            {goal.milestones.length === 0 ? (
              <p className="text-xs text-dayo-gray-400 py-2">{t('goalsPage.noMilestones')}</p>
            ) : (
              goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-dayo-gray-50 group"
                >
                  <button
                    onClick={() => onToggleMilestone(milestone.id, milestone.completed)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      milestone.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-dayo-gray-300 hover:border-dayo-purple'
                    }`}
                  >
                    {milestone.completed && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      milestone.completed ? 'text-dayo-gray-400 line-through' : 'text-dayo-gray-700'
                    }`}
                  >
                    {milestone.title}
                  </span>
                  <button
                    onClick={() => onDeleteMilestone(milestone.id)}
                    className="opacity-0 group-hover:opacity-100 text-dayo-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// New Goal Modal Component
interface NewGoalModalProps {
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    category: 'yearly' | 'monthly' | 'weekly'
    color: string
    icon: string
    due_date?: string
  }) => void
  isLoading: boolean
}

function NewGoalModal({ onClose, onSubmit, isLoading }: NewGoalModalProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'yearly' | 'monthly' | 'weekly'>('monthly')
  const [color, setColor] = useState(defaultColors[0])
  const [icon, setIcon] = useState(defaultIcons[0])
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      color,
      icon,
      due_date: dueDate || undefined,
    })

    toast.success(t('goalsPage.toast.goalCreated'))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">{t('goalsPage.modal.title')}</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('goalsPage.modal.titleLabel')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('goalsPage.modal.titlePlaceholder')}
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('goalsPage.modal.descriptionLabel')}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('goalsPage.modal.descriptionPlaceholder')}
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('goalsPage.modal.categoryLabel')}</label>
            <div className="flex gap-2 mt-2">
              {(['yearly', 'monthly', 'weekly'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    category === cat
                      ? 'bg-dayo-purple text-white'
                      : 'bg-dayo-gray-100 text-dayo-gray-600'
                  }`}
                >
                  {t(`goalsPage.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('goalsPage.modal.iconLabel')}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultIcons.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    icon === i
                      ? 'bg-dayo-purple/10 ring-2 ring-dayo-purple'
                      : 'bg-dayo-gray-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('goalsPage.modal.colorLabel')}</label>
            <div className="flex gap-2 mt-2">
              {defaultColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-dayo-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">{t('goalsPage.modal.dueDateLabel')}</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="w-full bg-dayo-gradient text-white font-medium py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('goalsPage.modal.createButton')}
          </button>
        </form>
      </div>
    </div>
  )
}
