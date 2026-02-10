import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useProfileMode } from '../../hooks/useProfileMode'
import { useDirection } from '../../hooks/useDirection'
import { getTemplatesForMode, type DiaryTemplate } from '../../data/templates'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: DiaryTemplate) => void
}

export default function TemplateSelector({ isOpen, onClose, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isKidsMode } = useProfileMode()
  const templates = getTemplatesForMode(isKidsMode)

  if (!isOpen) return null

  const gridTemplates = templates.filter(t => t.sections.length > 0)
  const freewriteTemplate = templates.find(t => t.sections.length === 0)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dayo-gray-50">
      {/* Header */}
      <header className={`flex-shrink-0 px-4 py-3 flex items-center justify-between border-b safe-area-top ${
        isKidsMode
          ? 'bg-kids-gradient border-dayo-kids-yellow/30'
          : 'bg-white border-dayo-gray-100'
      }`}>
        <button
          onClick={onClose}
          className={`p-2 -ms-2 transition-colors ${
            isKidsMode ? 'text-white/80 hover:text-white' : 'text-dayo-gray-600 hover:text-dayo-gray-900'
          }`}
          type="button"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rtl-flip' : ''}`} />
        </button>
        <h2 className={`font-semibold ${isKidsMode ? 'text-white' : 'text-dayo-gray-900'}`}>
          {t('diary.chooseTemplate')}
        </h2>
        <div className="w-9" />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-lg mx-auto">
          <p className={`text-center mb-6 ${
            isKidsMode ? 'text-lg font-bold text-dayo-kids-orange-dark' : 'text-dayo-gray-600'
          }`}>
            {isKidsMode
              ? 'What adventure will you write about? \u{1F5FA}\u{FE0F}'
              : 'How would you like to write today?'}
          </p>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {gridTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className={`text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isKidsMode
                    ? 'bg-white border-dayo-kids-yellow/50 hover:border-dayo-kids-orange hover:shadow-kids'
                    : 'bg-white border-dayo-gray-100 hover:border-dayo-purple/30 hover:shadow-md'
                }`}
              >
                <span className="text-3xl mb-2 block">{template.icon}</span>
                <p className={`font-semibold text-sm mb-1 ${
                  isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-dayo-gray-900'
                }`}>
                  {template.name}
                </p>
                <p className="text-xs text-dayo-gray-500 line-clamp-2">
                  {template.description}
                </p>
              </button>
            ))}
          </div>

          {/* Freewrite option */}
          {freewriteTemplate && (
            <button
              onClick={() => onSelect(freewriteTemplate)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                isKidsMode
                  ? 'bg-white border-dayo-kids-yellow/50 hover:border-dayo-kids-orange hover:shadow-kids'
                  : 'bg-white border-dayo-gray-100 hover:border-dayo-purple/30 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{freewriteTemplate.icon}</span>
                <div>
                  <p className={`font-semibold text-sm ${
                    isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-dayo-gray-900'
                  }`}>
                    {freewriteTemplate.name}
                  </p>
                  <p className="text-xs text-dayo-gray-500">{freewriteTemplate.description}</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
