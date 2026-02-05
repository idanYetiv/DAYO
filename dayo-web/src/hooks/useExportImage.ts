import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas'

export type ExportFormat = 'story' | 'post'
export type ExportTemplate = 'fullDay' | 'diarySpotlight' | 'achievementGrid'
export type ExportStyle = 'playful' | 'minimal' | 'dark'

export interface ExportOptions {
  format: ExportFormat
  template: ExportTemplate
  style: ExportStyle
}

export interface ExportData {
  date: string
  dayOfWeek: string
  mood: string
  moodEmoji: string
  diaryText: string
  tasksCompleted: number
  totalTasks: number
  streak: number
}

// Diary export types
export type DiaryExportTemplate = 'diaryPage' | 'gratitudeCard' | 'highlightReel'

export interface DiaryExportData {
  date: string
  dayOfWeek: string
  mood: string
  moodEmoji: string
  diaryText: string
  gratitude: string[]
  highlights: DiaryHighlight[]
  tags: string[]
}

interface DiaryHighlight {
  emoji: string
  text: string
}

// Dimensions for each format
export const EXPORT_DIMENSIONS = {
  story: { width: 1080, height: 1920 },
  post: { width: 1080, height: 1080 },
} as const

export function useExportImage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = useCallback(
    async (element: HTMLElement): Promise<Blob | null> => {
      setIsGenerating(true)
      setError(null)

      try {
        const canvas = await html2canvas(element, {
          scale: 2, // 2x for retina quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        })

        return new Promise((resolve) => {
          canvas.toBlob(
            (blob) => {
              setIsGenerating(false)
              resolve(blob)
            },
            'image/png',
            1.0
          )
        })
      } catch (err) {
        setIsGenerating(false)
        setError('Failed to generate image')
        console.error('Export error:', err)
        return null
      }
    },
    []
  )

  const downloadImage = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const shareImage = useCallback(
    async (blob: Blob, title: string): Promise<boolean> => {
      // Check if Web Share API is available and supports files
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'dayo-summary.png', { type: 'image/png' })
        const shareData = { title, files: [file] }

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData)
            return true
          } catch (err) {
            // User cancelled or share failed
            if ((err as Error).name !== 'AbortError') {
              console.error('Share failed:', err)
            }
            return false
          }
        }
      }
      return false
    },
    []
  )

  return {
    generateImage,
    downloadImage,
    shareImage,
    isGenerating,
    error,
  }
}
