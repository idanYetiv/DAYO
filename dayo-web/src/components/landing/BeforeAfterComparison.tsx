import { useTranslation } from 'react-i18next'

export default function BeforeAfterComparison() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-6 bg-dayo-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dayo-gray-900 mb-4">
            {t('landing.notJustNotes')}
          </h2>
          <p className="text-dayo-gray-500 max-w-2xl mx-auto">
            {t('landing.notJustNotesDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Before */}
          <div className="rounded-2xl border-2 border-dayo-gray-200 bg-white p-6 relative">
            <div className="absolute -top-3 start-6 bg-dayo-gray-200 text-dayo-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              {t('landing.before')}
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-dayo-gray-400 font-medium">Jan 31</p>
              <div className="space-y-2 text-sm text-dayo-gray-500">
                <p>Had a good day.</p>
                <p>Went to work.</p>
                <p>Nothing else to say.</p>
              </div>
              <div className="pt-4 border-t border-dayo-gray-100">
                <p className="text-xs text-dayo-gray-300 italic">{t('landing.noMoodNoPhotos')}</p>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 relative shadow-md">
            <div className="absolute -top-3 start-6 bg-dayo-gradient text-white text-xs font-semibold px-3 py-1 rounded-full">
              {t('landing.withDayo')}
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{'\u{2728}'}</span>
                  <span className="text-sm font-semibold text-amber-800">Amazing</span>
                </div>
                <span className="text-amber-500">{'\u{2B50}'}</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-amber-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{'\u{1F305}'}</span>
                  <span className="text-xs font-semibold text-amber-800">Morning Intention</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-dayo-gray-600">
                    {'\u{1F3AF}'} Focus: Ship the new diary feature
                  </p>
                  <p className="text-xs text-dayo-gray-600">
                    {'\u{1F64F}'} Grateful for my team, morning coffee, sunny weather
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-dayo-gray-400">{'\u{1F4F7}'} 2 photos</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-white text-dayo-gray-600 px-2 py-0.5 rounded-full border border-amber-200">
                  {'\u{1F4BC}'} Work
                </span>
                <span className="text-xs bg-white text-dayo-gray-600 px-2 py-0.5 rounded-full border border-amber-200">
                  {'\u{1F4DA}'} Growth
                </span>
                <span className="text-xs text-dayo-gray-400 ms-auto">142 words</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
