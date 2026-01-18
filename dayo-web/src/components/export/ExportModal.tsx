import { useState, useRef } from 'react'
import { X, Download, Share2, Image, Sparkles, Layout, Grid3X3 } from 'lucide-react'
import { useExportImage, type ExportData, type ExportFormat, type ExportTemplate, type ExportStyle, EXPORT_DIMENSIONS } from '../../hooks/useExportImage'
import { generateFilename } from '../../lib/exportUtils'
import { toast } from 'sonner'
import FullDayCard from './templates/FullDayCard'
import DiarySpotlight from './templates/DiarySpotlight'
import AchievementGrid from './templates/AchievementGrid'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: ExportData
}

const templates: { id: ExportTemplate; name: string; icon: typeof Layout }[] = [
  { id: 'fullDay', name: 'Full Day', icon: Layout },
  { id: 'diarySpotlight', name: 'Diary', icon: Sparkles },
  { id: 'achievementGrid', name: 'Grid', icon: Grid3X3 },
]

const styles: { id: ExportStyle; name: string; preview: string }[] = [
  { id: 'playful', name: 'Playful', preview: 'linear-gradient(135deg, #FEF3C7, #E9D5FF)' },
  { id: 'minimal', name: 'Minimal', preview: '#FFFFFF' },
  { id: 'dark', name: 'Dark', preview: 'linear-gradient(135deg, #1F2937, #111827)' },
]

const formats: { id: ExportFormat; name: string; ratio: string }[] = [
  { id: 'story', name: 'Story', ratio: '9:16' },
  { id: 'post', name: 'Post', ratio: '1:1' },
]

export default function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [template, setTemplate] = useState<ExportTemplate>('fullDay')
  const [style, setStyle] = useState<ExportStyle>('playful')
  const [format, setFormat] = useState<ExportFormat>('story')

  const exportRef = useRef<HTMLDivElement>(null)
  const { generateImage, downloadImage, shareImage, isGenerating } = useExportImage()

  if (!isOpen) return null

  const handleExport = async (action: 'download' | 'share') => {
    if (!exportRef.current) return

    const blob = await generateImage(exportRef.current)
    if (!blob) {
      toast.error('Failed to generate image')
      return
    }

    const filename = generateFilename(data.date, format)

    if (action === 'share') {
      const shared = await shareImage(blob, 'My DAYO Day Summary')
      if (shared) {
        toast.success('Shared successfully!')
        onClose()
      } else {
        // Fallback to download
        downloadImage(blob, filename)
        toast.success('Downloaded! Share from your photos.')
      }
    } else {
      downloadImage(blob, filename)
      toast.success('Image downloaded!')
    }
  }

  const renderTemplate = () => {
    const props = { data, style, format }
    switch (template) {
      case 'fullDay':
        return <FullDayCard {...props} />
      case 'diarySpotlight':
        return <DiarySpotlight {...props} />
      case 'achievementGrid':
        return <AchievementGrid {...props} />
    }
  }

  // Calculate preview scale
  const dimensions = EXPORT_DIMENSIONS[format]
  const maxPreviewHeight = 400
  const scale = maxPreviewHeight / dimensions.height

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dayo-gray-100">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-dayo-purple" />
            <h2 className="text-lg font-semibold text-dayo-gray-900">Export Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors rounded-full hover:bg-dayo-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex justify-center mb-4">
            <div
              className="relative overflow-hidden rounded-xl shadow-lg border border-dayo-gray-200"
              style={{
                width: dimensions.width * scale,
                height: dimensions.height * scale,
              }}
            >
              <div
                ref={exportRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-dayo-gray-700 mb-2">
              Template
            </label>
            <div className="flex gap-2">
              {templates.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                      template === t.id
                        ? 'bg-dayo-purple text-white shadow-md'
                        : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Style Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-dayo-gray-700 mb-2">
              Style
            </label>
            <div className="flex gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    style === s.id
                      ? 'ring-2 ring-dayo-purple ring-offset-2'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    background: s.preview,
                    color: s.id === 'dark' ? '#F9FAFB' : '#1F2937',
                    border: s.id === 'minimal' ? '1px solid #E5E7EB' : 'none',
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-dayo-gray-700 mb-2">
              Format
            </label>
            <div className="flex gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    format === f.id
                      ? 'bg-dayo-purple text-white shadow-md'
                      : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
                  }`}
                >
                  {f.name} ({f.ratio})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4 border-t border-dayo-gray-100 bg-dayo-gray-50">
          <button
            onClick={() => handleExport('download')}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-dayo-gray-200 rounded-xl text-dayo-gray-700 font-medium hover:bg-dayo-gray-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Download'}
          </button>
          <button
            onClick={() => handleExport('share')}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-dayo-purple text-white rounded-xl font-medium hover:bg-dayo-purple/90 transition-colors disabled:opacity-50 shadow-md"
          >
            <Share2 className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
