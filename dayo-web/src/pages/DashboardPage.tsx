import { Link } from 'react-router-dom'
import { Flame, CheckCircle, BookOpen, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUserStats, useAggregatedStats } from '../hooks/useUserStats'

export default function DashboardPage() {
  const { user, signOut } = useAuthStore()
  const userId = user?.id || ''

  // Fetch real data
  const { data: userStats, isLoading: statsLoading } = useUserStats(userId)
  const { data: aggregatedStats, isLoading: aggLoading } = useAggregatedStats(userId)

  const isLoading = statsLoading || aggLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            DAYO
          </h1>
          <div className="flex items-center gap-6">
            <Link
              to="/today"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Today
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              Dashboard
            </Link>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Streaks Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Streak
              </h3>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Loader2 className="w-10 h-10 mx-auto text-blue-500 animate-spin" />
              ) : (
                <>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {userStats?.current_streak || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    days in a row
                  </p>
                  {userStats?.longest_streak && userStats.longest_streak > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Best: {userStats.longest_streak} days
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tasks This Week
              </h3>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Loader2 className="w-10 h-10 mx-auto text-green-500 animate-spin" />
              ) : (
                <>
                  <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {aggregatedStats?.tasksCompletedThisWeek || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    completed
                  </p>
                  {aggregatedStats?.totalTasksCompleted && aggregatedStats.totalTasksCompleted > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Total: {aggregatedStats.totalTasksCompleted} all time
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Diary Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Diary Entries
              </h3>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Loader2 className="w-10 h-10 mx-auto text-purple-500 animate-spin" />
              ) : (
                <>
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {aggregatedStats?.diaryEntriesThisMonth || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    this month
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/today"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Today
            </Link>
            <Link
              to="/goals"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              View Goals
            </Link>
            <Link
              to="/habits"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              View Habits
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
