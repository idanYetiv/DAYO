# DAYO Development Task Backlog - WITH TESTING

**Last Updated:** January 3, 2026 - 9:20 PM
**Project:** DAYO Web App POC
**Base Path:** `/Users/idanyativ/DAYO/dayo-web`

---

## ✅ Progress Tracker

- **Completed:** Task 0, Task 1
- **Ready to Start:** Tasks 2-6 (Database Integration) + Testing Setup
- **Blocked:** None! All systems go! 🚀

---

## 🎯 PARALLEL EXECUTION PLAN

### **Session 1: Core Database + Testing Setup (NOW!)**
**Open 4 tabs and assign:**

| Tab | Task | Time | What |
|-----|------|------|------|
| **Tab 1** | Task 2 | 20 min | useTasks hook |
| **Tab 2** | Task 3 | 20 min | useDiary hook |
| **Tab 3** | Task 4 | 15 min | useUserStats hook |
| **Tab 4** | Task 19 | 25 min | Setup Vitest + Unit Tests |

**Then continue:**
| Tab | Task | Time | What |
|-----|------|------|------|
| **Tab 1** | Task 5 | 30 min | Wire TodayPage |
| **Tab 2** | Task 20 | 30 min | Component Tests |
| **Tab 3** | Task 6 | 20 min | Wire Dashboard |
| **Tab 4** | Task 21 | 35 min | Setup E2E Tests |

---

## Phase 1: Foundation ✅ COMPLETE

### ✅ Task 0: Initial Setup
**Status:** ✅ COMPLETE

### ✅ Task 1: Supabase Setup & Database Migration
**Status:** ✅ COMPLETE
- Database tables created
- `.env` configured
- Authentication working

---

## Phase 2: Database Integration (START NOW - PARALLEL)

### Task 2: Create Database Hooks - Tasks
**Status:** ⏳ READY TO START
**Priority:** HIGH
**Time:** 20 minutes
**Assignee:** Tab 1

**Description:** Create React Query hooks for CRUD operations on tasks.

**Steps:**
1. Create file: `src/hooks/useTasks.ts`
2. Implement functions:
   ```typescript
   export function useTasks(userId: string) {
     // Fetch all tasks for user
   }

   export function useCreateTask() {
     // Mutation to create task
   }

   export function useUpdateTask() {
     // Mutation to update task (toggle complete, edit title)
   }

   export function useDeleteTask() {
     // Mutation to delete task
   }
   ```
3. Use React Query's `useQuery` and `useMutation`
4. Include optimistic updates for instant UI feedback
5. Handle errors with proper error states
6. Add proper TypeScript types

**Acceptance Criteria:**
- [ ] Can fetch tasks from database
- [ ] Can create new task
- [ ] Can update task (toggle complete)
- [ ] Can delete task
- [ ] Optimistic updates work
- [ ] Error handling implemented
- [ ] TypeScript types correct

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useTasks.ts`

**Dependencies:** Task 1 ✅
**Blocks:** Task 5

**Testing:** Should be covered by Task 22 (Service Tests)

---

### Task 3: Create Database Hooks - Diary
**Status:** ⏳ READY TO START
**Priority:** HIGH
**Time:** 20 minutes
**Assignee:** Tab 2

**Description:** Create React Query hooks for diary/day entries.

**Steps:**
1. Create file: `src/hooks/useDiary.ts`
2. Implement functions:
   ```typescript
   export function useDayEntry(date: string, userId: string) {
     // Fetch day entry for specific date
   }

   export function useUpsertDayEntry() {
     // Create or update day entry
   }

   export function useUpdateMood() {
     // Update mood only
   }
   ```
3. Handle auto-save logic (debounced for text)
4. Include loading and error states
5. Add TypeScript types

**Acceptance Criteria:**
- [ ] Can fetch day entry by date
- [ ] Can create/update diary text
- [ ] Can update mood separately
- [ ] Auto-save working (debounced)
- [ ] TypeScript types correct

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useDiary.ts`

**Dependencies:** Task 1 ✅
**Blocks:** Task 5

**Testing:** Should be covered by Task 22 (Service Tests)

---

### Task 4: Create Database Hooks - User Stats
**Status:** ⏳ READY TO START
**Priority:** MEDIUM
**Time:** 15 minutes
**Assignee:** Tab 3

**Description:** Create hooks for user statistics and streaks.

**Steps:**
1. Create file: `src/hooks/useUserStats.ts`
2. Implement functions:
   ```typescript
   export function useUserStats(userId: string) {
     // Fetch user stats (streaks, etc.)
   }

   export function useUpdateStreak() {
     // Update streak when user is active
   }
   ```
3. Add logic to auto-update stats when user completes tasks/diary
4. Include TypeScript types

**Acceptance Criteria:**
- [ ] Can fetch user stats
- [ ] Streak updates work
- [ ] TypeScript types correct

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/useUserStats.ts`

**Dependencies:** Task 1 ✅
**Blocks:** Task 6

**Testing:** Should be covered by Task 22 (Service Tests)

---

### Task 5: Wire Up TodayPage with Real Data
**Status:** ⏳ PENDING
**Priority:** HIGH
**Time:** 30 minutes
**Assignee:** Tab 1 (after Task 2)

**Description:** Replace local state in TodayPage with real database calls.

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
- [ ] Real-time updates work

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/TodayPage.tsx`

**Dependencies:** Task 2, Task 3
**Blocks:** None

**Testing:** Should be covered by Task 20 (Component Tests) and Task 21 (E2E Tests)

---

### Task 6: Update Dashboard with Real Stats
**Status:** ⏳ PENDING
**Priority:** MEDIUM
**Time:** 20 minutes
**Assignee:** Tab 3 (after Task 4)

**Description:** Show real statistics on the dashboard.

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

**Testing:** Should be covered by Task 20 (Component Tests)

---

## Phase 3: Testing Infrastructure (PARALLEL WITH PHASE 2)

### Task 19: Setup Vitest + Unit Test Infrastructure
**Status:** ⏳ READY TO START
**Priority:** HIGH
**Time:** 25 minutes
**Assignee:** Tab 4

**Description:** Set up Vitest for unit testing with proper configuration.

**Steps:**
1. Install dependencies:
   ```bash
   npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```
2. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test/setup.ts',
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         exclude: ['node_modules/', 'src/test/']
       }
     }
   })
   ```
3. Create test setup file: `src/test/setup.ts`
4. Add test scripts to package.json:
   ```json
   "test": "vitest",
   "test:ui": "vitest --ui",
   "test:coverage": "vitest --coverage"
   ```
5. Create example unit test: `src/lib/__tests__/utils.test.ts`
6. Document testing guidelines in `TESTING.md`

**Acceptance Criteria:**
- [ ] Vitest installed and configured
- [ ] Test setup file created
- [ ] Coverage configured
- [ ] Example test passing
- [ ] npm test works
- [ ] Testing guide documented

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/vitest.config.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/test/setup.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/lib/__tests__/utils.test.ts`
- `/Users/idanyativ/DAYO/dayo-web/TESTING.md`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/package.json`

**Dependencies:** None
**Blocks:** Task 20, Task 22

---

### Task 20: Component Tests
**Status:** ⏳ PENDING
**Priority:** HIGH
**Time:** 30 minutes
**Assignee:** Tab 2 (after Task 3)

**Description:** Create component tests for auth and main pages.

**Steps:**
1. Create test files:
   - `src/pages/__tests__/LoginPage.test.tsx`
   - `src/pages/__tests__/SignupPage.test.tsx`
   - `src/pages/__tests__/TodayPage.test.tsx`
   - `src/pages/__tests__/DashboardPage.test.tsx`
2. Test LoginPage:
   - Renders correctly
   - Email input works
   - Password input works
   - Form submission works
   - Error handling works
   - Google OAuth button present
3. Test SignupPage:
   - Renders correctly
   - Validation works
   - Password match check
   - Form submission
4. Test TodayPage:
   - Renders with mock data
   - Task list displays
   - Can add task
   - Can complete task
   - Can delete task
   - Diary textarea works
   - Mood selector works
5. Test DashboardPage:
   - Renders with mock stats
   - Stats display correctly

**Acceptance Criteria:**
- [ ] All component tests pass
- [ ] Coverage > 80% for tested components
- [ ] Mock Supabase in tests
- [ ] Test user interactions
- [ ] Test error states
- [ ] Test loading states

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/pages/__tests__/LoginPage.test.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/pages/__tests__/SignupPage.test.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/pages/__tests__/TodayPage.test.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/pages/__tests__/DashboardPage.test.tsx`
- `/Users/idanyativ/DAYO/dayo-web/src/test/mocks/supabase.ts` (mock helpers)

**Dependencies:** Task 19
**Blocks:** None

---

### Task 21: Setup E2E Tests with Playwright
**Status:** ⏳ PENDING
**Priority:** HIGH
**Time:** 35 minutes
**Assignee:** Tab 4 (after Task 19)

**Description:** Set up Playwright for end-to-end testing.

**Steps:**
1. Install Playwright:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```
2. Create `playwright.config.ts`:
   ```typescript
   import { defineConfig, devices } from '@playwright/test'

   export default defineConfig({
     testDir: './e2e',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:5173',
       trace: 'on-first-retry',
     },
     projects: [
       { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
     ],
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:5173',
       reuseExistingServer: !process.env.CI,
     },
   })
   ```
3. Create E2E test files:
   - `e2e/auth.spec.ts` - Login/signup flows
   - `e2e/tasks.spec.ts` - Task CRUD operations
   - `e2e/diary.spec.ts` - Diary entry flows
4. Create test helpers: `e2e/helpers/auth.ts`
5. Add scripts to package.json:
   ```json
   "test:e2e": "playwright test",
   "test:e2e:ui": "playwright test --ui"
   ```

**Acceptance Criteria:**
- [ ] Playwright installed
- [ ] Config file created
- [ ] Auth flow tests pass
- [ ] Task CRUD tests pass
- [ ] Diary tests pass
- [ ] Tests run in CI-ready mode

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/playwright.config.ts`
- `/Users/idanyativ/DAYO/dayo-web/e2e/auth.spec.ts`
- `/Users/idanyativ/DAYO/dayo-web/e2e/tasks.spec.ts`
- `/Users/idanyativ/DAYO/dayo-web/e2e/diary.spec.ts`
- `/Users/idanyativ/DAYO/dayo-web/e2e/helpers/auth.ts`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/package.json`

**Dependencies:** Task 19, Task 5 (for meaningful tests)
**Blocks:** None

---

### Task 22: Service/Integration Tests
**Status:** ⏳ PENDING
**Priority:** MEDIUM
**Time:** 30 minutes
**Assignee:** Any tab after hooks are done

**Description:** Test database hooks and services with real Supabase (test env).

**Steps:**
1. Create `src/hooks/__tests__/useTasks.test.ts`
2. Create `src/hooks/__tests__/useDiary.test.ts`
3. Create `src/hooks/__tests__/useUserStats.test.ts`
4. Use Supabase test instance or mock
5. Test:
   - Data fetching
   - Mutations
   - Error handling
   - Optimistic updates
6. Create test utilities: `src/test/dbHelpers.ts`

**Acceptance Criteria:**
- [ ] All hooks tested
- [ ] Database operations tested
- [ ] Error cases covered
- [ ] Tests are isolated (clean up after)

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/__tests__/useTasks.test.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/__tests__/useDiary.test.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/hooks/__tests__/useUserStats.test.ts`
- `/Users/idanyativ/DAYO/dayo-web/src/test/dbHelpers.ts`

**Dependencies:** Task 2, Task 3, Task 4, Task 19
**Blocks:** None

---

### Task 23: System Tests & Test Coverage Report
**Status:** ⏳ PENDING
**Priority:** MEDIUM
**Time:** 25 minutes
**Assignee:** Any tab

**Description:** Create comprehensive system tests and coverage reporting.

**Steps:**
1. Create system test suite: `e2e/system/fullFlow.spec.ts`
2. Test complete user journey:
   - Sign up → Login → Add tasks → Write diary → View dashboard → Logout
3. Set up coverage thresholds in `vitest.config.ts`:
   ```typescript
   coverage: {
     statements: 80,
     branches: 70,
     functions: 80,
     lines: 80
   }
   ```
4. Create CI workflow: `.github/workflows/test.yml`
5. Add coverage badge to README
6. Create test reporting script

**Acceptance Criteria:**
- [ ] System tests pass
- [ ] Coverage meets thresholds
- [ ] CI workflow configured
- [ ] Coverage report generated

**Files to Create:**
- `/Users/idanyativ/DAYO/dayo-web/e2e/system/fullFlow.spec.ts`
- `/Users/idanyativ/DAYO/dayo-web/.github/workflows/test.yml`

**Files to Modify:**
- `/Users/idanyativ/DAYO/dayo-web/vitest.config.ts`
- `/Users/idanyativ/DAYO/dayo-web/README.md`

**Dependencies:** Task 19, Task 20, Task 21
**Blocks:** None

---

## Phase 4: Enhanced Features (Later)

### Task 7-18: Calendar, AI, Polish, etc.
**Status:** ⏳ TODO (After Phase 2 & 3 complete)

See original TASK-BACKLOG.md for details.

---

## 🎯 IMMEDIATE ACTION PLAN

### **RIGHT NOW - Open 4 Claude Tabs:**

**Tab 1:**
```
"Do Task 2 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

**Tab 2:**
```
"Do Task 3 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

**Tab 3:**
```
"Do Task 4 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

**Tab 4:**
```
"Do Task 19 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

### **After First Round Completes (~20-25 min):**

**Tab 1:**
```
"Do Task 5 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

**Tab 2:**
```
"Do Task 20 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

**Tab 3:**
```
"Do Task 6 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

**Tab 4:**
```
"Do Task 21 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

### **Final Round (~30 min later):**

**Any 2 tabs:**
```
"Do Task 22 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
"Do Task 23 from /Users/idanyativ/DAYO/TASK-BACKLOG-UPDATED.md"
```

---

## 📊 Expected Results

**After 2 hours:**
- ✅ Working MVP with database
- ✅ Unit tests setup + passing
- ✅ Component tests + passing
- ✅ E2E tests setup + passing
- ✅ Service tests + passing
- ✅ Coverage > 80%
- ✅ CI ready

**Test Coverage Goals:**
- **Unit Tests:** Utilities, helpers, pure functions
- **Component Tests:** All pages + key components
- **E2E Tests:** Critical user flows
- **Service Tests:** Database hooks + API calls
- **System Tests:** Full user journey

---

## 🚀 LET'S GO!

**Your move:** Open 4 Claude tabs and copy-paste the commands above! 🔥
