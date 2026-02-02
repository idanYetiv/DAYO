import { useState, useEffect, lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { useProfileMode } from '../../hooks/useProfileMode'
import type { DiaryTemplate, TemplateSection } from '../../data/templates'

const DiaryEditor = lazy(() => import('./DiaryEditor'))

interface TemplatedTextareaProps {
  template: DiaryTemplate
  initialText?: string
  onChange: (text: string) => void
  onChangeTemplate: () => void
}

interface SectionValues {
  [sectionId: string]: string | string[]
}

function parseSectionsFromText(text: string, template: DiaryTemplate): SectionValues {
  const values: SectionValues = {}
  if (!text) {
    template.sections.forEach(section => {
      values[section.id] = section.type === 'list' ? ['', '', ''] : ''
    })
    return values
  }

  const sectionPattern = /### (.+)\n([\s\S]*?)(?=### |$)/g
  const matches: Record<string, string> = {}
  let match
  while ((match = sectionPattern.exec(text)) !== null) {
    matches[match[1].trim()] = match[2].trim()
  }

  template.sections.forEach(section => {
    const content = matches[section.label] || ''
    if (section.type === 'list') {
      const items = content
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(Boolean)
      values[section.id] = items.length > 0 ? [...items, '', '', ''].slice(0, 3) : ['', '', '']
    } else {
      values[section.id] = content
    }
  })

  return values
}

function serializeSections(values: SectionValues, template: DiaryTemplate): string {
  return template.sections
    .map(section => {
      const value = values[section.id]
      if (section.type === 'list' && Array.isArray(value)) {
        const items = value.filter(v => v.trim())
        if (items.length === 0) return ''
        return `### ${section.label}\n${items.map(item => `- ${item}`).join('\n')}`
      }
      if (typeof value === 'string' && value.trim()) {
        return `### ${section.label}\n${value}`
      }
      return ''
    })
    .filter(Boolean)
    .join('\n\n')
}

export default function TemplatedTextarea({
  template,
  initialText = '',
  onChange,
  onChangeTemplate,
}: TemplatedTextareaProps) {
  const { isKidsMode } = useProfileMode()
  const [sectionValues, setSectionValues] = useState<SectionValues>(() =>
    parseSectionsFromText(initialText, template)
  )

  useEffect(() => {
    setSectionValues(parseSectionsFromText(initialText, template))
  }, [template.id])

  useEffect(() => {
    const serialized = serializeSections(sectionValues, template)
    onChange(serialized)
  }, [sectionValues])

  const handleTextChange = (sectionId: string, value: string) => {
    setSectionValues(prev => ({ ...prev, [sectionId]: value }))
  }

  const handleListChange = (sectionId: string, index: number, value: string) => {
    setSectionValues(prev => {
      const list = Array.isArray(prev[sectionId]) ? [...(prev[sectionId] as string[])] : ['', '', '']
      list[index] = value
      return { ...prev, [sectionId]: list }
    })
  }

  const renderSection = (section: TemplateSection) => {
    const sectionEmoji = section.label === 'Main Focus' ? '\u{1F3AF}'
      : section.label === 'Morning Gratitude' ? '\u{1F64F}'
      : section.label === 'Intention' ? '\u{1F4AB}'
      : section.label === 'Best Moment' ? '\u{2728}'
      : section.label === 'What I Learned' ? '\u{1F4DA}'
      : section.label === 'Tomorrow' ? '\u{1F680}'
      : section.label === 'People' ? '\u{1F465}'
      : section.label === 'Simple Things' ? '\u{2600}\u{FE0F}'
      : section.label === 'Growth' ? '\u{1F331}'
      : section.label === 'This Week\'s Wins' ? '\u{1F3C6}'
      : section.label === 'Challenges' ? '\u{1F4AA}'
      : section.label === 'Next Week' ? '\u{1F4C5}'
      : section.label === 'My Adventure' ? '\u{1F30D}'
      : section.label === 'Favorite Part' ? '\u{2B50}'
      : section.label === 'Who Was There' ? '\u{1F46B}'
      : section.label === 'Today\'s Superpower' ? '\u{26A1}'
      : section.label === 'Mission Accomplished' ? '\u{2705}'
      : section.label === 'Sidekick of the Day' ? '\u{1F91D}'
      : '\u{1F4DD}'

    return (
      <div
        key={section.id}
        className={`rounded-2xl border p-4 ${
          isKidsMode
            ? 'bg-white border-dayo-kids-yellow/50'
            : 'bg-white border-dayo-gray-100'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{sectionEmoji}</span>
          <span className={`font-semibold text-sm ${
            isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-dayo-gray-900'
          }`}>
            {section.label}
          </span>
        </div>
        <p className="text-xs text-dayo-gray-400 mb-3">{section.prompt}</p>

        {section.type === 'list' ? (
          <div className="space-y-2">
            {(Array.isArray(sectionValues[section.id]) ? sectionValues[section.id] as string[] : ['', '', '']).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-dayo-gray-400 text-sm">{index + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange(section.id, index, e.target.value)}
                  placeholder={section.placeholder}
                  className={`flex-1 border rounded-xl px-3 py-2 text-sm outline-none transition-colors ${
                    isKidsMode
                      ? 'border-dayo-kids-yellow/50 focus:border-dayo-kids-orange bg-dayo-kids-yellow/5'
                      : 'border-dayo-gray-200 focus:border-dayo-purple/50'
                  }`}
                />
              </div>
            ))}
          </div>
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-dayo-gray-400" />
            </div>
          }>
            <DiaryEditor
              initialContent={(sectionValues[section.id] as string) || ''}
              onChange={(md) => handleTextChange(section.id, md)}
              placeholder={section.placeholder}
              className={`border rounded-xl px-3 py-2 text-sm ${
                isKidsMode
                  ? 'border-dayo-kids-yellow/50 bg-dayo-kids-yellow/5'
                  : 'border-dayo-gray-200'
              }`}
            />
          </Suspense>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Template Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{template.icon}</span>
          <span className={`font-semibold text-sm ${
            isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-dayo-gray-900'
          }`}>
            {template.name}
          </span>
        </div>
        <button
          onClick={onChangeTemplate}
          type="button"
          className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
            isKidsMode
              ? 'text-dayo-kids-orange hover:bg-dayo-kids-yellow/20'
              : 'text-dayo-purple hover:bg-dayo-purple/10'
          }`}
        >
          Change
        </button>
      </div>

      {/* Sections */}
      {template.sections.map(renderSection)}
    </div>
  )
}

export { parseSectionsFromText, serializeSections }
