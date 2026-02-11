import { useState } from 'react'
import { Plus, Calendar, Trash2, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Task {
  id: string
  title: string
  completed: boolean
}

interface TasksSectionProps {
  tasks: Task[]
  isLoading: boolean
  onAddTask: (title: string) => void
  onToggleTask: (id: string, completed: boolean) => void
  onDeleteTask: (id: string) => void
  isCreating?: boolean
}

export default function TasksSection({
  tasks,
  isLoading,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  isCreating,
}: TasksSectionProps) {
  const { t } = useTranslation()
  const [showInput, setShowInput] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    onAddTask(newTaskTitle)
    setNewTaskTitle('')
    setShowInput(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dayo-gray-900">{t('tasks.title')}</h3>
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-1.5 bg-dayo-orange hover:bg-dayo-orange-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('tasks.addTask')}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 overflow-hidden">
        {/* Add task input */}
        {showInput && (
          <form onSubmit={handleSubmit} className="p-4 border-b border-dayo-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={t('tasks.placeholder')}
                className="flex-1 px-4 py-2 border border-dayo-gray-200 rounded-xl focus:ring-2 focus:ring-dayo-purple/20 focus:border-dayo-purple outline-none transition-all text-sm"
                autoFocus
                disabled={isCreating}
              />
              <button
                type="submit"
                disabled={isCreating || !newTaskTitle.trim()}
                className="bg-dayo-purple hover:bg-dayo-purple-dark text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {isCreating ? t('actions.adding') : t('actions.add')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false)
                  setNewTaskTitle('')
                }}
                className="text-dayo-gray-400 hover:text-dayo-gray-600 px-2"
              >
                {t('actions.cancel')}
              </button>
            </div>
          </form>
        )}

        {/* Tasks list or empty state */}
        {isLoading ? (
          <div className="py-16 text-center">
            <p className="text-dayo-gray-400">{t('tasks.loading')}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-12 h-12 text-dayo-gray-300 mx-auto mb-4" />
            <p className="text-dayo-gray-500 mb-4">{t('tasks.empty')}</p>
            {!showInput && (
              <button
                onClick={() => setShowInput(true)}
                className="text-sm text-dayo-gray-600 border border-dayo-gray-200 hover:border-dayo-purple/30 px-4 py-2 rounded-xl transition-colors"
              >
                {t('tasks.addFirst')}
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-dayo-gray-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 hover:bg-dayo-gray-50 transition-colors group"
              >
                <button
                  onClick={() => onToggleTask(task.id, task.completed)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-dayo-gray-300 hover:border-dayo-purple'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? 'line-through text-dayo-gray-400'
                      : 'text-dayo-gray-900'
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-dayo-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
