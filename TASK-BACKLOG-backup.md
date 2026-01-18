# DAYO Development Task Backlog

**Last Updated:** January 3, 2026
**Project:** DAYO Web App POC
**Base Path:** `/Users/idanyativ/DAYO/dayo-web`

---

## How to Use This Backlog

1. Each task is **independent** and can be worked on in parallel (except Phase 1)
2. Tasks marked with 🔒 are **blockers** - must complete before others
3. Tasks in the same phase can be done **simultaneously** in different Claude tabs
4. Each task has clear **acceptance criteria** and **file locations**
5. Mark tasks as ✅ when complete

---

## Phase 1: Foundation (MUST DO FIRST) 🔒

### ✅ Task 0: Initial Setup (COMPLETED)
**Status:** ✅ DONE
**What:** Project structure, auth pages, routing, Tailwind setup

---

### Task 1: Supabase Setup & Database Migration 🔒
**Status:** ⏳ TODO
**Priority:** CRITICAL - BLOCKER
**Estimated Time:** 15 minutes
**Assignee:** Tab 1

**Description:**
Set up Supabase project and create database tables.

**Steps:**
1. Go to https://supabase.com and sign in
2. Create new project:
   - Name: `DAYO`
   - Database password: [save this securely]
   - Region: [choose closest]
3. Wait for database provisioning (~2 min)
4. Go to **SQL Editor** in sidebar
5. Copy SQL from `dayo-web/README.md` (lines 56-151)
6. Paste and run the SQL
7. Verify tables created: **Database > Tables** should show `days`, `tasks`, `user_stats`
8. Go to **Project Settings > API**
9. Copy:
   - Project URL (e.g., https://xxx.supabase.co)
   - `anon` `public` key (long string)
10. Create `.env` file in `dayo-web/`:
```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
11. Test: Run `npm run dev` and try to sign up

**Acceptance Criteria:**
- [ ] Tables created in Supabase
- [ ] `.env` file exists with credentials
- [ ] Can sign up and log in successfully

**Files Modified:**
- Create: `/Users/idanyativ/DAYO/dayo-web/.env`

**Dependencies:** None
**Blocks:** All Phase 2 tasks

---

## Phase 2: Database Integration (PARALLEL AFTER TASK 1)

These tasks can be done **simultaneously** in different tabs after Task 1 is complete.

---

### Task 2: Create Database Hooks - Tasks
**Status:** ⏳ TODO
**Priority:** HIGH
**Estimated Time:** 20 minutes
**Assignee:** Tab 2

**Description:**
Create React Query hooks for CRUD operations on tasks.

**Steps:**
1. Create file: `src/hooks/useTasks.ts`
2. Implement:
   - `useTasks(date)` - fetch tasks for a specific day
   - `useCreateTask()` - mutation to create task
   - `useUpdateTask()` - mutation to update task (toggle complete)
   - `useDeleteTask()` - mutation to delete task
3. Use React Query's `useQuery` and `useMutation`
4. Include optimistic updates
5. Handle errors with error states

**Example Code Structure:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useTasks(date: string) {
  return useQuery({
    queryKey: ['tasks', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', date)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    }
  })
}

// Similar for mutations...
```

**Acceptance Criteria:**
- [ ] All CRUD operations work
- [ ] Optimistic updates implemented
- [ ] Error handling included
- [ ] TypeScript types correct

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useTasks.ts`

**Dependencies:** Task 1
**Blocks:** Task 5

---

### Task 3: Create Database Hooks - Diary
**Status:** ⏳ TODO
**Priority:** HIGH
**Estimated Time:** 20 minutes
**Assignee:** Tab 3

**Description:**
Create React Query hooks for diary/day entries.

**Steps:**
1. Create file: `src/hooks/useDiary.ts`
2. Implement:
   - `useDayEntry(date)` - fetch diary entry for specific day
   - `useUpsertDayEntry()` - create or update day entry
   - `useUpdateMood()` - update mood only
3. Handle auto-save logic (debounced)
4. Include loading and error states

**Example Code Structure:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useDayEntry(date: string) {
  return useQuery({
    queryKey: ['day', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('days')
        .select('*')
        .eq('date', date)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    }
  })
}

// Implement mutations...
```

**Acceptance Criteria:**
- [ ] Can fetch day entry
- [ ] Can create/update diary text
- [ ] Can update mood
- [ ] Auto-save working
- [ ] TypeScript types correct

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useDiary.ts`

**Dependencies:** Task 1
**Blocks:** Task 5

---

### Task 4: Create Database Hooks - User Stats
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 15 minutes
**Assignee:** Tab 4

**Description:**
Create hooks for user statistics and streaks.

**Steps:**
1. Create file: `src/hooks/useUserStats.ts`
2. Implement:
   - `useUserStats()` - fetch user stats
   - `useUpdateStreak()` - update streak when user is active
   - `calculateStreak()` - utility to calculate current streak
3. Add logic to auto-update stats when user completes tasks/diary

**Acceptance Criteria:**
- [ ] Can fetch user stats
- [ ] Streak calculation works
- [ ] Auto-update on activity

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useUserStats.ts`

**Dependencies:** Task 1
**Blocks:** Task 6

---

### Task 5: Wire Up TodayPage with Real Data
**Status:** ⏳ TODO
**Priority:** HIGH
**Estimated Time:** 30 minutes
**Assignee:** Tab 2 (after completing Task 2)

**Description:**
Replace local state in TodayPage with real database calls.

**Steps:**
1. Update `src/pages/TodayPage.tsx`
2. Replace useState with hooks from Task 2 and Task 3
3. Wire up task list to `useTasks`
4. Wire up diary to `useDayEntry`
5. Wire up mood selector to `useUpdateMood`
6. Add loading spinners
7. Add error messages
8. Test all CRUD operations

**Acceptance Criteria:**
- [ ] Tasks persist to database
- [ ] Diary saves to database
- [ ] Mood saves to database
- [ ] Loading states show
- [ ] Errors display properly
- [ ] Page refreshes maintain state

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/TodayPage.tsx`

**Dependencies:** Task 2, Task 3
**Blocks:** None

---

### Task 6: Update Dashboard with Real Stats
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 20 minutes
**Assignee:** Tab 4 (after completing Task 4)

**Description:**
Show real statistics on the dashboard.

**Steps:**
1. Update `src/pages/DashboardPage.tsx`
2. Use `useUserStats()` hook
3. Fetch and display:
   - Current streak
   - Tasks completed this week
   - Diary entries this month
4. Add loading states
5. Style the cards

**Acceptance Criteria:**
- [ ] Real data displayed
- [ ] Stats update in real-time
- [ ] Loading states work

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/DashboardPage.tsx`

**Dependencies:** Task 4
**Blocks:** None

---

## Phase 3: Enhanced Features (PARALLEL)

These can all be done in parallel after Phase 2.

---

### Task 7: Create Calendar Component
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 45 minutes
**Assignee:** Tab 5

**Description:**
Build a calendar component to navigate between days.

**Steps:**
1. Create `src/components/planner/Calendar.tsx`
2. Use `date-fns` for date manipulation
3. Show month grid with clickable days
4. Highlight:
   - Today
   - Days with entries
   - Current selection
5. Navigate months with arrows
6. Make it responsive

**Example Structure:**
```typescript
interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  daysWithEntries: string[] // Array of dates with entries
}
```

**Acceptance Criteria:**
- [ ] Shows current month
- [ ] Can navigate months
- [ ] Can select dates
- [ ] Highlights days with entries
- [ ] Responsive design

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/components/planner/Calendar.tsx`

**Dependencies:** None
**Blocks:** Task 8

---

### Task 8: Create Calendar Page
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 30 minutes
**Assignee:** Tab 5 (after Task 7)

**Description:**
Create a page showing calendar + selected day's content.

**Steps:**
1. Create `src/pages/CalendarPage.tsx`
2. Use Calendar component from Task 7
3. Show selected day's tasks and diary below calendar
4. Add route in `App.tsx`: `/calendar`
5. Add navigation link in header

**Acceptance Criteria:**
- [ ] Calendar displays
- [ ] Selecting date shows that day's content
- [ ] Navigation works
- [ ] Responsive layout

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/CalendarPage.tsx`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/App.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/pages/TodayPage.tsx` (add nav link)
- `/Users/idanyativ/DAYO/dayo-web/src/pages/DashboardPage.tsx` (add nav link)

**Dependencies:** Task 7
**Blocks:** None

---

### Task 9: AI Assistant - OpenAI Integration
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 25 minutes
**Assignee:** Tab 6

**Description:**
Create service for OpenAI API integration.

**Steps:**
1. Create `src/lib/openai.ts`
2. Set up OpenAI client
3. Create functions:
   - `askAI(message, context)` - Send message with user context
   - `getDailySummary(tasks, diary)` - Get AI summary of day
   - `getWeeklySummary()` - Get weekly insights
   - `suggestGoals(diary)` - Suggest goals based on diary
4. Add error handling
5. Add streaming support (optional)

**Note:** Requires `VITE_OPENAI_API_KEY` in `.env`

**Acceptance Criteria:**
- [ ] OpenAI client configured
- [ ] Can send messages
- [ ] Can get summaries
- [ ] Error handling works
- [ ] Responses formatted nicely

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/lib/openai.ts`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/.env.example` (add OpenAI key placeholder)

**Dependencies:** None
**Blocks:** Task 10

---

### Task 10: AI Chat Component & Page
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 40 minutes
**Assignee:** Tab 6 (after Task 9)

**Description:**
Create chat interface for AI assistant.

**Steps:**
1. Create `src/components/ai/ChatMessage.tsx` - Single message bubble
2. Create `src/components/ai/ChatInput.tsx` - Input field
3. Create `src/components/ai/ChatWindow.tsx` - Full chat interface
4. Create `src/pages/AIAssistantPage.tsx` - Page wrapper
5. Add route `/ai` in App.tsx
6. Style with chat bubbles (user vs AI)
7. Add "Ask AI about today" quick actions
8. Show loading state while AI responds

**Acceptance Criteria:**
- [ ] Can send messages
- [ ] AI responses display
- [ ] Chat history persists in session
- [ ] Loading states work
- [ ] Beautiful chat UI

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/components/ai/ChatMessage.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/components/ai/ChatInput.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/components/ai/ChatWindow.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/pages/AIAssistantPage.tsx`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/App.tsx`

**Dependencies:** Task 9
**Blocks:** None

---

### Task 11: Streak Calculation Logic
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 30 minutes
**Assignee:** Tab 7

**Description:**
Implement automatic streak tracking.

**Steps:**
1. Create `src/lib/streakCalculator.ts`
2. Implement:
   - `updateDailyStreak(userId)` - Call when user is active
   - `calculateCurrentStreak(userId)` - Count consecutive days
   - `checkStreakBreak(userId)` - Detect if streak broken
3. Create database function (optional):
   - Supabase Edge Function or RPC to update streaks
4. Call streak update when:
   - User adds task
   - User writes diary entry
5. Show confetti animation on milestone streaks (7, 30, 100 days)

**Acceptance Criteria:**
- [ ] Streak increments daily
- [ ] Streak resets if day missed
- [ ] Longest streak tracked
- [ ] Database updates correctly

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/lib/streakCalculator.ts`

**Dependencies:** Task 1, Task 4
**Blocks:** None

---

### Task 12: Add Toast Notifications
**Status:** ⏳ TODO
**Priority:** LOW
**Estimated Time:** 25 minutes
**Assignee:** Tab 8

**Description:**
Add toast notification system for user feedback.

**Steps:**
1. Install: `npm install sonner`
2. Add Toaster component to App.tsx
3. Create wrapper: `src/lib/toast.ts`
4. Add toasts for:
   - Task created ✅
   - Task completed 🎉
   - Diary saved 📝
   - Errors ❌
   - Streak milestone 🔥
5. Style toasts to match theme

**Acceptance Criteria:**
- [ ] Toasts display on actions
- [ ] Styled properly
- [ ] Auto-dismiss after 3-5 seconds
- [ ] Different types (success, error, info)

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/lib/toast.ts`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/App.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useTasks.ts` (add toast calls)
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useDiary.ts` (add toast calls)

**Dependencies:** None
**Blocks:** None

---

## Phase 4: Polish & Extras (PARALLEL)

---

### Task 13: Add Loading Skeletons
**Status:** ⏳ TODO
**Priority:** LOW
**Estimated Time:** 30 minutes
**Assignee:** Tab 9

**Description:**
Replace "Loading..." text with skeleton components.

**Steps:**
1. Create `src/components/ui/Skeleton.tsx` - Base skeleton
2. Create `src/components/ui/TaskSkeleton.tsx` - Task list skeleton
3. Create `src/components/ui/DiarySkeleton.tsx` - Diary skeleton
4. Use in TodayPage, CalendarPage, DashboardPage
5. Animate with shimmer effect

**Acceptance Criteria:**
- [ ] Skeletons show while loading
- [ ] Smooth transition to content
- [ ] Shimmer animation

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/components/ui/Skeleton.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/components/ui/TaskSkeleton.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/components/ui/DiarySkeleton.tsx`

**Files to Modify:**
- All page components

**Dependencies:** None
**Blocks:** None

---

### Task 14: Add Image Upload for Diary
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 40 minutes
**Assignee:** Tab 10

**Description:**
Allow users to upload photos to diary entries.

**Steps:**
1. Update database schema:
   - Add `photos` column (array of URLs) to `days` table
2. Set up Supabase Storage bucket: `diary-photos`
3. Configure RLS policies for storage
4. Create `src/hooks/usePhotoUpload.ts`
5. Add image upload UI to TodayPage
6. Add image gallery display
7. Implement delete photo

**Acceptance Criteria:**
- [ ] Can upload images
- [ ] Images display in gallery
- [ ] Can delete images
- [ ] Storage RLS works
- [ ] Image compression (optional)

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/usePhotoUpload.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/components/diary/PhotoGallery.tsx`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/TodayPage.tsx`
- Database schema (add SQL migration)

**Dependencies:** Task 1
**Blocks:** None

---

### Task 15: Add Keyboard Shortcuts
**Status:** ⏳ TODO
**Priority:** LOW
**Estimated Time:** 20 minutes
**Assignee:** Tab 11

**Description:**
Add keyboard shortcuts for power users.

**Steps:**
1. Create `src/hooks/useKeyboardShortcuts.ts`
2. Implement shortcuts:
   - `Ctrl/Cmd + K` - Quick add task
   - `Ctrl/Cmd + D` - Focus diary
   - `Ctrl/Cmd + T` - Go to today
   - `Ctrl/Cmd + /` - Show shortcuts menu
   - `Esc` - Close modals
3. Add shortcuts help modal
4. Add visual indicators

**Acceptance Criteria:**
- [ ] Shortcuts work
- [ ] Help menu shows all shortcuts
- [ ] Doesn't conflict with browser shortcuts

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useKeyboardShortcuts.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/components/ui/ShortcutsModal.tsx`

**Dependencies:** None
**Blocks:** None

---

### Task 16: Add Animations & Micro-interactions
**Status:** ⏳ TODO
**Priority:** LOW
**Estimated Time:** 35 minutes
**Assignee:** Tab 12

**Description:**
Polish with delightful animations.

**Steps:**
1. Install: `npm install framer-motion`
2. Add animations:
   - Task completion (checkmark animation)
   - Streak milestone (confetti)
   - Page transitions (fade in)
   - Modal enter/exit
   - Hover effects
3. Add haptic feedback indicators
4. Keep animations subtle and fast

**Acceptance Criteria:**
- [ ] Smooth transitions
- [ ] Completion animations
- [ ] Performance not impacted
- [ ] Accessible (respects prefers-reduced-motion)

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/TodayPage.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/pages/DashboardPage.tsx`
- Other components as needed

**Dependencies:** None
**Blocks:** None

---

## Testing & Documentation Tasks

### Task 17: Create Demo Data Seeder
**Status:** ⏳ TODO
**Priority:** MEDIUM
**Estimated Time:** 20 minutes
**Assignee:** Any tab

**Description:**
Create script to seed database with demo data for testing.

**Steps:**
1. Create `scripts/seedDatabase.ts`
2. Add sample:
   - Tasks for last 7 days
   - Diary entries with different moods
   - User stats with streak
3. Create npm script: `npm run seed`

**Acceptance Criteria:**
- [ ] Script creates realistic data
- [ ] Can run multiple times (idempotent)
- [ ] Helps with testing

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/scripts/seedDatabase.ts`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/package.json` (add script)

**Dependencies:** Task 1
**Blocks:** None

---

### Task 18: Update Project README
**Status:** ⏳ TODO
**Priority:** LOW
**Estimated Time:** 15 minutes
**Assignee:** Any tab

**Description:**
Update README with latest features and screenshots.

**Steps:**
1. Add screenshots of:
   - Login page
   - Today page
   - Calendar view
   - Dashboard
   - AI chat
2. Update feature list
3. Update setup instructions if needed
4. Add deployment instructions

**Acceptance Criteria:**
- [ ] README reflects current state
- [ ] Screenshots added
- [ ] Clear and helpful

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/README.md`

**Dependencies:** Most features complete
**Blocks:** None

---

## Task Assignment Strategy

### Recommended Parallel Execution

**Session 1: Core Database (3 tabs)**
- Tab 1: Task 1 (Supabase setup) - 15 min
- Then split:
  - Tab 1 → Task 2 (useTasks) → Task 5 (Wire TodayPage)
  - Tab 2 → Task 3 (useDiary) → helps with Task 5
  - Tab 3 → Task 4 (useUserStats) → Task 6 (Dashboard)

**Session 2: Features (4 tabs in parallel)**
- Tab 4 → Task 7 (Calendar) → Task 8 (Calendar Page)
- Tab 5 → Task 9 (OpenAI) → Task 10 (AI Chat)
- Tab 6 → Task 11 (Streaks)
- Tab 7 → Task 12 (Toast notifications)

**Session 3: Polish (4-5 tabs in parallel)**
- Tab 8 → Task 13 (Skeletons)
- Tab 9 → Task 14 (Image upload)
- Tab 10 → Task 15 (Keyboard shortcuts)
- Tab 11 → Task 16 (Animations)
- Tab 12 → Task 17 (Seed data)

---

## Progress Tracking

Update this section as tasks complete:

### Completed ✅
- Task 0: Initial setup

### In Progress ⏳
- None yet

### Blocked 🚫
- Tasks 2-18 (waiting for Task 1)

---

## Notes for Claude Instances

When picking up a task:
1. **Read the full task description**
2. **Check dependencies** - don't start if blocked
3. **Follow the file paths exactly**
4. **Test your changes** before marking complete
5. **Update this file** when done (change ⏳ to ✅)
6. **Document any issues** in the task notes

Good luck! Let's build DAYO! 🚀
