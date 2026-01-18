# Feature: Export to Instagram

**Status:** Planning
**Priority:** Medium-High
**Estimated Effort:** 3-4 development sessions

---

## Overview

Allow users to export their daily summary as a shareable image for Instagram Stories (9:16) or Posts (1:1).

### Goals

1. **User Value:** Beautiful shareable memory of their day
2. **Growth:** Organic marketing through user shares
3. **Engagement:** Public accountability drives habit consistency
4. **Brand:** Every share includes DAYO branding

---

## User Flow

```
TodayPage / CalendarPage
         │
         ▼
   [Share Button] 🔗
         │
         ▼
┌─────────────────────────────────────────┐
│         Export Preview Modal            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [Live Preview]             │   │
│  │                                 │   │
│  │      Rendered template          │   │
│  │      with user's data           │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Template:  [1] [2] [3]                │
│                                         │
│  Style:     [Playful] [Minimal] [Dark] │
│                                         │
│  Format:    [Story 9:16] [Post 1:1]    │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  Download   │  │  Share          │  │
│  │     📥      │  │     📤          │  │
│  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Templates

### Template 1: "Full Day Card" (Default)

Best for: Users who want to share complete daily summary

**Content:**
- Date
- Mood emoji + label
- Diary excerpt (first 100 chars or user-selected quote)
- Tasks completed (X/Y)
- Current streak
- DAYO branding

**Story Layout (9:16 - 1080x1920):**
```
┌────────────────────────────────┐
│                                │
│      ✨ Friday                 │
│      January 18, 2026          │
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │         🥰               │  │
│  │    Feeling Happy         │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │  "Today was amazing!     │  │
│  │   Finally finished my    │  │
│  │   side project and       │  │
│  │   went for a sunset      │  │
│  │   run by the beach..."   │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│      ✅ 5/6 Tasks Done         │
│                                │
│      🔥 12 Day Streak          │
│                                │
│  ────────────────────────────  │
│                                │
│      📝 dayo.app               │
│                                │
└────────────────────────────────┘
```

**Post Layout (1:1 - 1080x1080):**
```
┌────────────────────────────────────────┐
│                                        │
│  ✨ Friday, January 18                 │
│                                        │
│  ┌────────────────────────────────┐   │
│  │  🥰 Happy                      │   │
│  │                                │   │
│  │  "Today was amazing!           │   │
│  │   Finally finished my          │   │
│  │   side project..."             │   │
│  └────────────────────────────────┘   │
│                                        │
│  ┌─────────┐        ┌─────────┐       │
│  │  ✅ 5/6 │        │  🔥 12  │       │
│  │  Tasks  │        │  Streak │       │
│  └─────────┘        └─────────┘       │
│                                        │
│  ──────────────────────────────────   │
│  📝 dayo.app                          │
└────────────────────────────────────────┘
```

---

### Template 2: "Diary Spotlight"

Best for: Users who wrote meaningful diary entry

**Content:**
- Mood emoji (large, centered)
- Diary text (prominent)
- Date + streak (subtle footer)
- DAYO branding

**Story Layout (9:16):**
```
┌────────────────────────────────┐
│                                │
│                                │
│                                │
│            🥰                  │
│                                │
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │  "Today I realized that  │  │
│  │   the small wins are     │  │
│  │   what matter most.      │  │
│  │                          │  │
│  │   Completed 5 tasks,     │  │
│  │   had a great call with  │  │
│  │   mom, and feeling       │  │
│  │   grateful for this      │  │
│  │   beautiful day."        │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│                                │
│  ────────────────────────────  │
│  Jan 18, 2026 • 🔥 12 days     │
│                                │
│       📝 dayo.app              │
│                                │
└────────────────────────────────┘
```

---

### Template 3: "Achievement Grid"

Best for: Quick visual summary, less text-focused

**Content:**
- Date header
- 3-column grid: Mood, Tasks, Streak
- Short diary quote
- DAYO branding

**Story Layout (9:16):**
```
┌────────────────────────────────┐
│                                │
│       My Day ✨                │
│       January 18, 2026         │
│                                │
│                                │
│  ┌────────┐┌────────┐┌────────┐│
│  │        ││        ││        ││
│  │   🥰   ││   ✅   ││   🔥   ││
│  │        ││        ││        ││
│  │ Happy  ││  5/6   ││   12   ││
│  │        ││ Tasks  ││  Days  ││
│  │        ││        ││        ││
│  └────────┘└────────┘└────────┘│
│                                │
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │  "Great productive day!" │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│                                │
│  ────────────────────────────  │
│       📝 dayo.app              │
│                                │
└────────────────────────────────┘
```

---

## Visual Styles

### Style 1: Playful Illustrated (Default)

```css
Background: Soft gradient (#FEF3C7 → #FECACA → #E9D5FF)
Cards: White with rounded corners (24px)
Text: Playful sans-serif (Nunito or similar)
Accents: Colorful, warm tones
Shadows: Soft, playful
Emoji: Large, prominent
```

### Style 2: Clean Minimal

```css
Background: Pure white (#FFFFFF)
Cards: Light gray borders, minimal shadow
Text: Clean sans-serif (Inter)
Accents: DAYO purple (#8B5CF6)
Shadows: Subtle
Emoji: Medium size
```

### Style 3: Dark Premium

```css
Background: Dark gradient (#1F2937 → #111827)
Cards: Dark gray with subtle borders
Text: White, elegant sans-serif
Accents: Glowing purple/orange
Shadows: Glowing effect
Emoji: Medium size with glow
```

---

## Technical Implementation

### Approach: HTML Canvas (html2canvas)

**Why this approach:**
- Client-side only (no backend needed)
- Reuses existing React components
- Works offline
- Zero API costs
- Full styling control

### Dependencies

```bash
npm install html2canvas
```

### File Structure

```
src/
├── components/
│   └── export/
│       ├── ExportModal.tsx         # Main modal component
│       ├── ExportPreview.tsx       # Live preview wrapper
│       ├── templates/
│       │   ├── FullDayCard.tsx     # Template 1
│       │   ├── DiarySpotlight.tsx  # Template 2
│       │   └── AchievementGrid.tsx # Template 3
│       └── styles/
│           ├── PlayfulStyle.tsx    # Style 1
│           ├── MinimalStyle.tsx    # Style 2
│           └── DarkStyle.tsx       # Style 3
├── hooks/
│   └── useExportImage.ts           # Canvas generation logic
└── lib/
    └── exportUtils.ts              # Share API, download helpers
```

### Core Hook: useExportImage

```typescript
import html2canvas from 'html2canvas'

interface ExportOptions {
  format: 'story' | 'post'  // 9:16 or 1:1
  template: 1 | 2 | 3
  style: 'playful' | 'minimal' | 'dark'
}

interface ExportData {
  date: string
  mood: string
  moodEmoji: string
  diaryText: string
  tasksCompleted: number
  totalTasks: number
  streak: number
}

export function useExportImage() {
  const generateImage = async (
    elementRef: RefObject<HTMLElement>,
    options: ExportOptions
  ): Promise<Blob> => {
    const canvas = await html2canvas(elementRef.current!, {
      scale: 2,  // 2x for retina quality
      useCORS: true,
      backgroundColor: null,
      width: options.format === 'story' ? 1080 : 1080,
      height: options.format === 'story' ? 1920 : 1080,
    })

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
    })
  }

  const downloadImage = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareImage = async (blob: Blob, title: string) => {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'dayo-summary.png', { type: 'image/png' })

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          files: [file],
        })
        return true
      }
    }
    return false  // Fallback to download
  }

  return { generateImage, downloadImage, shareImage }
}
```

### Template Component Example

```typescript
// src/components/export/templates/FullDayCard.tsx

interface FullDayCardProps {
  data: ExportData
  style: 'playful' | 'minimal' | 'dark'
  format: 'story' | 'post'
}

export function FullDayCard({ data, style, format }: FullDayCardProps) {
  const styles = getStyleConfig(style)
  const dimensions = format === 'story'
    ? { width: 1080, height: 1920 }
    : { width: 1080, height: 1080 }

  return (
    <div
      style={{
        ...dimensions,
        background: styles.background,
        padding: 60,
        fontFamily: styles.fontFamily,
      }}
    >
      {/* Date Header */}
      <div style={{ color: styles.textPrimary, fontSize: 48 }}>
        ✨ {format(new Date(data.date), 'EEEE')}
      </div>
      <div style={{ color: styles.textSecondary, fontSize: 32 }}>
        {format(new Date(data.date), 'MMMM d, yyyy')}
      </div>

      {/* Mood Card */}
      <div style={{
        background: styles.cardBg,
        borderRadius: 24,
        padding: 40,
        marginTop: 60,
      }}>
        <div style={{ fontSize: 80, textAlign: 'center' }}>
          {data.moodEmoji}
        </div>
        <div style={{
          fontSize: 36,
          textAlign: 'center',
          color: styles.textPrimary
        }}>
          Feeling {data.mood}
        </div>
      </div>

      {/* Diary Excerpt */}
      {data.diaryText && (
        <div style={{
          background: styles.cardBg,
          borderRadius: 24,
          padding: 40,
          marginTop: 30,
        }}>
          <div style={{
            fontSize: 28,
            color: styles.textPrimary,
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            "{truncate(data.diaryText, 150)}"
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ marginTop: 60 }}>
        <div style={{ fontSize: 32, color: styles.textPrimary }}>
          ✅ {data.tasksCompleted}/{data.totalTasks} Tasks Done
        </div>
        <div style={{ fontSize: 32, color: styles.accent, marginTop: 20 }}>
          🔥 {data.streak} Day Streak
        </div>
      </div>

      {/* Branding */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <div style={{
          borderTop: `1px solid ${styles.border}`,
          paddingTop: 30,
          fontSize: 24,
          color: styles.textSecondary,
        }}>
          📝 dayo.app
        </div>
      </div>
    </div>
  )
}
```

### Export Modal Component

```typescript
// src/components/export/ExportModal.tsx

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: ExportData
}

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [template, setTemplate] = useState<1 | 2 | 3>(1)
  const [style, setStyle] = useState<'playful' | 'minimal' | 'dark'>('playful')
  const [format, setFormat] = useState<'story' | 'post'>('story')
  const [isGenerating, setIsGenerating] = useState(false)

  const previewRef = useRef<HTMLDivElement>(null)
  const { generateImage, downloadImage, shareImage } = useExportImage()

  const handleExport = async (action: 'download' | 'share') => {
    setIsGenerating(true)
    try {
      const blob = await generateImage(previewRef, { format, template, style })
      const filename = `dayo-${data.date}-${format}.png`

      if (action === 'share') {
        const shared = await shareImage(blob, 'My DAYO Summary')
        if (!shared) {
          downloadImage(blob, filename)
          toast.info('Downloaded! Share from your photos.')
        }
      } else {
        downloadImage(blob, filename)
        toast.success('Image downloaded!')
      }
    } catch (error) {
      toast.error('Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Preview */}
      <div className="preview-container">
        <div ref={previewRef} className="preview-scale">
          <TemplateRenderer
            template={template}
            style={style}
            format={format}
            data={data}
          />
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setTemplate(1)}>Full Day</button>
        <button onClick={() => setTemplate(2)}>Diary Focus</button>
        <button onClick={() => setTemplate(3)}>Grid</button>
      </div>

      {/* Style Selector */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setStyle('playful')}>Playful</button>
        <button onClick={() => setStyle('minimal')}>Minimal</button>
        <button onClick={() => setStyle('dark')}>Dark</button>
      </div>

      {/* Format Selector */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setFormat('story')}>Story (9:16)</button>
        <button onClick={() => setFormat('post')}>Post (1:1)</button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleExport('download')}
          disabled={isGenerating}
        >
          📥 Download
        </button>
        <button
          onClick={() => handleExport('share')}
          disabled={isGenerating}
        >
          📤 Share
        </button>
      </div>
    </Modal>
  )
}
```

---

## Integration Points

### TodayPage Integration

Add share button to the TodayPage header:

```typescript
// In TodayPage.tsx header section
<button
  onClick={() => setShowExportModal(true)}
  className="p-2 text-dayo-gray-400 hover:text-dayo-purple"
>
  <Share2 className="w-5 h-5" />
</button>

// Add modal at bottom of component
<ExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  data={{
    date: today,
    mood: selectedMood,
    moodEmoji: moodEmojis[selectedMood] || '😊',
    diaryText: diaryText,
    tasksCompleted: completedTasks,
    totalTasks: tasks.length,
    streak: currentStreak,
  }}
/>
```

### CalendarPage Integration

Add share button when viewing a past day:

```typescript
// When a day is selected in calendar
{selectedDay && (
  <button onClick={() => openExportForDay(selectedDay)}>
    Share this day
  </button>
)}
```

---

## Future Enhancements

### Phase 2: Direct Instagram Sharing

**Requirements:**
- Instagram Business/Creator account
- Facebook Developer App
- Instagram Graph API access

**Flow:**
```
User clicks "Post to Instagram"
         │
         ▼
OAuth flow with Instagram
         │
         ▼
Upload image to Instagram
via Content Publishing API
         │
         ▼
User sees success + link to post
```

**API Endpoint (if we add backend):**
```typescript
// POST /api/instagram/publish
{
  imageBase64: string
  caption: string
  accessToken: string
}
```

---

## Acceptance Criteria

### MVP (Phase 1)
- [ ] Export modal opens from TodayPage
- [ ] 3 template options selectable
- [ ] 3 style options selectable
- [ ] Story (9:16) format works
- [ ] Post (1:1) format works
- [ ] Download button saves PNG
- [ ] Share button uses Web Share API (where available)
- [ ] DAYO branding visible on all exports
- [ ] Works on mobile browsers

### Future (Phase 2)
- [ ] Direct Instagram posting
- [ ] Caption suggestions
- [ ] Hashtag recommendations
- [ ] Post scheduling
- [ ] Analytics (shares tracked)

---

## Task Breakdown

| # | Task | Effort | Priority |
|---|------|--------|----------|
| 1 | Create ExportModal component shell | 1hr | P0 |
| 2 | Build Template 1 (Full Day Card) | 2hr | P0 |
| 3 | Build Template 2 (Diary Spotlight) | 1.5hr | P0 |
| 4 | Build Template 3 (Achievement Grid) | 1.5hr | P0 |
| 5 | Implement 3 visual styles | 2hr | P0 |
| 6 | Add html2canvas integration | 1hr | P0 |
| 7 | Implement download functionality | 0.5hr | P0 |
| 8 | Implement Web Share API | 1hr | P0 |
| 9 | Add format toggle (story/post) | 1hr | P0 |
| 10 | Integrate into TodayPage | 0.5hr | P0 |
| 11 | Integrate into CalendarPage | 0.5hr | P1 |
| 12 | Mobile responsive testing | 1hr | P0 |
| 13 | Direct Instagram API | 4hr | P2 |

**Total MVP Effort:** ~12 hours

---

## Design Assets Needed

1. **Playful Style Background Gradient** - Warm pastel gradient
2. **Dark Style Background** - Premium dark gradient
3. **Font Selection** - Nunito for playful, Inter for minimal
4. **Icon Set** - Consistent emoji rendering

---

*Created: January 18, 2026*
*Status: Ready for Implementation*
