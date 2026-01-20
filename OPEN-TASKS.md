# DAYO Open Tasks

**Last Updated:** January 19, 2026
**Status:** Core functionality complete, AI features added

---

## Completed Tasks

| Task | Description | Date |
|------|-------------|------|
| Task 0 | Initial setup (Vite, React, TS, Tailwind, routing) | Jan 3 |
| Task 1 | Supabase setup & database migration | Jan 3 |
| Task 2 | Database hooks - Tasks (useTasks.ts) | Jan 3 |
| Task 3 | Database hooks - Diary (useDiary.ts) | Jan 3 |
| Task 4 | Database hooks - User Stats (useUserStats.ts) | Jan 3 |
| Task 5 | Wire TodayPage with real data | Jan 17 |
| Task 6 | Wire Dashboard with real stats | Jan 17 |
| Task 7 | Calendar component | Jan 17 |
| Task 8 | Calendar page | Jan 17 |
| Task 11 | Streak calculation system | Jan 17 |
| Task 12 | Toast notifications | Jan 17 |
| Task 19 | Instagram Export (3 templates, 3 styles, 2 formats) | Jan 18 |
| Task 9 | OpenAI Integration (with mock mode) | Jan 19 |
| Task 10 | AI Chat UI (ChatWindow, ChatMessage, ChatInput) | Jan 19 |

---

## Open Tasks by Priority

### HIGH Priority - Growth Features

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| ~~19~~ | ~~Instagram Export~~ | ~~Share day summary as Story/Post image~~ | ✅ Done |

### MEDIUM Priority - Enhanced Features

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| ~~9~~ | ~~OpenAI Integration~~ | ~~Set up client, create API functions~~ | ✅ Done |
| ~~10~~ | ~~AI Chat UI~~ | ~~Chat interface, message bubbles, quick actions~~ | ✅ Done |
| 14 | Image Upload | Photos in diary entries, Supabase storage | - |
| 17 | Demo Data Seeder | Script to populate test data | - |
| 20 | Direct Instagram API | Post directly to Instagram (Business accounts) | Task 19 |

### LOW Priority - Polish

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 13 | Loading Skeletons | Shimmer loading states | - |
| 15 | Keyboard Shortcuts | Cmd+K for task, Cmd+D for diary | - |
| 16 | Animations | Framer Motion, task completion, transitions | - |
| 18 | Update README | Screenshots, deployment instructions | Most tasks |

---

## Detailed Task Breakdown

### Task 6: Wire Dashboard with Real Stats
**Priority:** HIGH
**Files:** `src/pages/DashboardPage.tsx`

**What to do:**
1. Use `useUserStats()` hook
2. Fetch real streak data
3. Calculate tasks completed this week
4. Show diary entries this month
5. Add loading states

**Acceptance Criteria:**
- [ ] Real streak displayed
- [ ] Real task count displayed
- [ ] Stats update on page load
- [ ] Loading skeleton while fetching

---

### Task 7: Calendar Component
**Priority:** HIGH
**Files to create:** `src/components/planner/Calendar.tsx`

**What to do:**
1. Build month grid with date-fns
2. Clickable day cells
3. Highlight today, selected date, days with entries
4. Month navigation arrows
5. Responsive design

**Props:**
```typescript
interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  daysWithEntries?: string[]
}
```

**Acceptance Criteria:**
- [ ] Shows current month
- [ ] Can navigate months
- [ ] Days are clickable
- [ ] Visual indicators for entries
- [ ] Mobile-friendly

---

### Task 8: Calendar Page
**Priority:** HIGH
**Depends on:** Task 7
**Files to create:** `src/pages/CalendarPage.tsx`
**Files to modify:** `src/App.tsx`

**What to do:**
1. Create CalendarPage component
2. Use Calendar component
3. Show selected day's tasks and diary
4. Add route `/calendar`
5. Add to navigation

**Acceptance Criteria:**
- [ ] Route works
- [ ] Calendar displays
- [ ] Selecting date loads that day's content
- [ ] Reuses TodayPage components

---

### Task 9: OpenAI Integration
**Priority:** MEDIUM
**Files to create:** `src/lib/openai.ts`

**What to do:**
1. Set up OpenAI client
2. Create functions:
   - `askAI(message, context)`
   - `getDailySummary(tasks, diary)`
   - `suggestGoals(diary)`
3. Error handling
4. Add `VITE_OPENAI_API_KEY` to .env.example

**Note:** Requires OpenAI API key

---

### Task 10: AI Chat UI
**Priority:** MEDIUM
**Depends on:** Task 9
**Files to create:**
- `src/components/ai/ChatMessage.tsx`
- `src/components/ai/ChatInput.tsx`
- `src/components/ai/ChatWindow.tsx`
- `src/pages/AIAssistantPage.tsx`

**What to do:**
1. Message bubble component (user vs AI)
2. Input with send button
3. Chat history in session
4. Loading state while AI responds
5. Quick action buttons ("Summarize my day")
6. Add route `/ai`

---

### Task 11: Streak Calculation
**Priority:** HIGH
**Files to create:** `src/lib/streakCalculator.ts`

**What to do:**
1. `updateDailyStreak(userId)` - call on activity
2. `calculateCurrentStreak(userId)` - count consecutive days
3. Update user_stats table
4. Track longest streak
5. Trigger on task add or diary save

**Logic:**
- If last_active_date is yesterday → increment streak
- If last_active_date is today → no change
- If last_active_date is older → reset streak to 1

---

### Task 12: Toast Notifications
**Priority:** MEDIUM
**Files to create:** `src/lib/toast.ts`
**Files to modify:** `src/App.tsx`, hooks

**What to do:**
1. Install `sonner`: `npm install sonner`
2. Add `<Toaster />` to App.tsx
3. Create toast wrapper functions
4. Add toasts to hooks:
   - Task created
   - Task completed
   - Diary saved
   - Errors

---

### Task 13: Loading Skeletons
**Priority:** LOW
**Files to create:**
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/TaskSkeleton.tsx`

**What to do:**
1. Base skeleton with shimmer animation
2. Task list skeleton (3-4 placeholder items)
3. Replace "Loading..." text in pages

---

### Task 14: Image Upload
**Priority:** MEDIUM
**Files to create:**
- `src/hooks/usePhotoUpload.ts`
- `src/components/diary/PhotoGallery.tsx`

**What to do:**
1. Add `photos` column to days table (TEXT[] or JSONB)
2. Create Supabase storage bucket `diary-photos`
3. Set up storage RLS policies
4. Upload hook with progress
5. Gallery component with delete

---

### Task 15: Keyboard Shortcuts
**Priority:** LOW
**Files to create:**
- `src/hooks/useKeyboardShortcuts.ts`
- `src/components/ui/ShortcutsModal.tsx`

**Shortcuts:**
- `Cmd/Ctrl + K` - Quick add task
- `Cmd/Ctrl + D` - Focus diary
- `Cmd/Ctrl + T` - Go to today
- `Cmd/Ctrl + /` - Show shortcuts help
- `Esc` - Close modals

---

### Task 16: Animations
**Priority:** LOW
**Install:** `npm install framer-motion`

**What to do:**
1. Task checkbox animation
2. Page transitions
3. Modal enter/exit
4. Streak milestone confetti
5. Respect `prefers-reduced-motion`

---

### Task 17: Demo Data Seeder
**Priority:** MEDIUM
**Files to create:** `scripts/seedDatabase.ts`

**What to do:**
1. Create script to insert:
   - 7 days of tasks
   - Diary entries with various moods
   - User stats with streak
2. Add npm script: `npm run seed`
3. Make idempotent (can run multiple times)

---

### Task 18: Update README
**Priority:** LOW (do last)
**Files to modify:** `README.md`

**What to do:**
1. Add screenshots
2. Update feature list
3. Add deployment instructions (Vercel)
4. Document environment variables

---

### Task 19: Instagram Export (NEW)
**Priority:** HIGH
**Spec Document:** `FEATURE-INSTAGRAM-EXPORT.md`
**Files to create:**
- `src/components/export/ExportModal.tsx`
- `src/components/export/ExportPreview.tsx`
- `src/components/export/templates/FullDayCard.tsx`
- `src/components/export/templates/DiarySpotlight.tsx`
- `src/components/export/templates/AchievementGrid.tsx`
- `src/hooks/useExportImage.ts`
- `src/lib/exportUtils.ts`

**Install:** `npm install html2canvas`

**What to do:**
1. Create export modal with live preview
2. Build 3 template options:
   - Full Day Card (date, mood, diary, tasks, streak)
   - Diary Spotlight (mood + diary focus)
   - Achievement Grid (visual stats grid)
3. Implement 3 visual styles:
   - Playful Illustrated (default)
   - Clean Minimal
   - Dark Premium
4. Support 2 formats:
   - Story (9:16 - 1080x1920)
   - Post (1:1 - 1080x1080)
5. Generate PNG using html2canvas
6. Download + Web Share API support
7. Add share button to TodayPage header
8. Add share option to CalendarPage day view

**Acceptance Criteria:**
- [ ] Export modal opens from TodayPage
- [ ] 3 template options selectable
- [ ] 3 style options selectable
- [ ] Story (9:16) format works
- [ ] Post (1:1) format works
- [ ] Download button saves PNG
- [ ] Share uses Web Share API (with download fallback)
- [ ] DAYO branding visible on all exports
- [ ] Works on mobile browsers

**Estimated Effort:** ~12 hours

---

### Task 20: Direct Instagram API (FUTURE)
**Priority:** MEDIUM
**Depends on:** Task 19
**Files to create:**
- Backend API endpoint (or Edge Function)
- OAuth integration with Instagram

**What to do:**
1. Set up Facebook Developer App
2. Implement Instagram OAuth flow
3. Use Instagram Content Publishing API
4. Add "Post to Instagram" button in ExportModal

**Requirements:**
- User needs Instagram Business/Creator account
- Facebook Developer account for app registration

**Note:** This is a Phase 2 enhancement after basic export works.

---

## Quick Start Commands

```bash
# Development
cd ~/DAYO/dayo-web
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build
```

---

## Recommended Order

1. ~~**Task 6** - Wire Dashboard (quick win)~~ ✅
2. ~~**Task 11** - Streak system (makes app feel real)~~ ✅
3. ~~**Task 12** - Toast notifications (user feedback)~~ ✅
4. ~~**Task 7 + 8** - Calendar (navigate history)~~ ✅
5. ~~**Task 19** - Instagram Export (viral growth feature)~~ ✅
6. ~~**Task 9 + 10** - AI features (differentiator)~~ ✅
7. **Task 14** - Image upload (rich content)
8. **Tasks 13, 15, 16** - Polish
9. **Task 17** - Seeder for testing
10. **Task 18** - Final README
11. **Task 20** - Direct Instagram API (Phase 2)

---

*5 tasks remaining to MVP (+ 1 Phase 2 task)*
