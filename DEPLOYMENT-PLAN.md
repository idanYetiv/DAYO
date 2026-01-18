# DAYO - First Deployment Plan

**Target:** Deploy working MVP with Goals & Habits
**Timeline:** ~5-6 hours of parallel work
**Deploy To:** Vercel (recommended) or Netlify

---

## 🎯 UPDATED POC SCOPE (MUST HAVE)

### **Phase 1:** ✅ COMPLETE
- Database setup
- Authentication
- useTasks hook

### **Phase 2:** ✅ COMPLETE
- useTasks hook ✅
- useDiary hook ✅
- useUserStats hook ✅
- Vitest setup ✅

### **Phase 3:** 🎯 NEXT (Round 2 - ~60 min)
- Wire TodayPage with database
- Wire Dashboard
- Component tests
- E2E tests

### **Phase 4:** 🔥 CRITICAL (Round 3 - ~90 min)
- Calendar view
- AI Assistant
- Streak system
- Toast notifications

### **Phase 5:** 💪 MUST HAVE (Round 4 - ~90 min)
- **Goals & Habits System** ← NEW!
  - Database schema for goals
  - CRUD operations
  - Link goals to tasks
  - Progress tracking
  - Habit streaks

### **Phase 6:** 🚀 DEPLOY (Round 5 - ~30 min)
- Git commit & push
- Deploy to Vercel
- Environment setup
- Test production

---

## 📋 NEW TASKS FOR GOALS & HABITS

### Task 24: Goals & Habits Database Schema
**Time:** 20 minutes
**Priority:** MUST HAVE

**Steps:**
1. Create SQL migration for:
   ```sql
   -- Goals table
   CREATE TABLE goals (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     goal_type TEXT NOT NULL, -- 'yearly', 'monthly', 'weekly'
     target_date DATE,
     status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Milestones table
   CREATE TABLE milestones (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     due_date DATE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Habits table
   CREATE TABLE habits (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     frequency TEXT NOT NULL, -- 'daily', 'weekly', 'custom'
     current_streak INTEGER DEFAULT 0,
     best_streak INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Habit completions table
   CREATE TABLE habit_completions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
     completed_date DATE NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(habit_id, completed_date)
   );
   ```
2. Add RLS policies
3. Run in Supabase
4. Update TypeScript types in `lib/supabase.ts`

---

### Task 25: Goals CRUD Hooks
**Time:** 25 minutes
**Priority:** MUST HAVE

**Create:** `src/hooks/useGoals.ts`

**Functions:**
- `useGoals()` - Fetch all goals
- `useCreateGoal()` - Create new goal
- `useUpdateGoal()` - Update goal
- `useDeleteGoal()` - Delete goal
- `useCompleteMilestone()` - Mark milestone done
- `useGoalProgress()` - Calculate progress %

---

### Task 26: Habits CRUD Hooks
**Time:** 25 minutes
**Priority:** MUST HAVE

**Create:** `src/hooks/useHabits.ts`

**Functions:**
- `useHabits()` - Fetch all habits
- `useCreateHabit()` - Create new habit
- `useUpdateHabit()` - Update habit
- `useDeleteHabit()` - Delete habit
- `useMarkHabitComplete()` - Mark today as done
- `useHabitStreak()` - Calculate current streak

---

### Task 27: Goals Page UI
**Time:** 40 minutes
**Priority:** MUST HAVE

**Create:** `src/pages/GoalsPage.tsx`

**Features:**
- List goals by type (yearly/monthly/weekly)
- Add new goal button
- Goal card with:
  - Title, description
  - Target date
  - Progress bar
  - Milestones checklist
- Edit/delete goal
- Mark milestones complete
- Celebration on goal completion

---

### Task 28: Habits Page UI
**Time:** 35 minutes
**Priority:** MUST HAVE

**Create:** `src/pages/HabitsPage.tsx`

**Features:**
- List all habits
- Today's habit checklist
- Streak counter for each habit
- Add new habit
- Mark today as complete
- Streak visualization (calendar heatmap)
- Edit/delete habit

---

### Task 29: Git Commit & Push
**Time:** 10 minutes
**Priority:** DEPLOYMENT

**Steps:**
1. Review all changes
2. Create `.gitignore` (ensure `.env` ignored)
3. Git add all files
4. Commit with message
5. Push to GitHub/GitLab
6. Verify remote

---

### Task 30: Deploy to Vercel
**Time:** 20 minutes
**Priority:** DEPLOYMENT

**Steps:**
1. Connect GitHub repo to Vercel
2. Configure environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
3. Deploy
4. Test production URL
5. Verify all features work
6. Share URL!

---

## 🚀 PARALLEL EXECUTION PLAN

### **Round 1:** ✅ COMPLETE
- Tab 1: Task 2 ✅ (useTasks)
- Tab 2: Task 3 ✅ (useDiary)
- Tab 3: Task 4 ✅ (useUserStats)
- Tab 4: Task 19 ✅ (Vitest)

### **Round 2:** After Round 1 (~25 min from now)
- Tab 1: Task 5 (Wire TodayPage)
- Tab 2: Task 20 (Component tests)
- Tab 3: Task 6 (Wire Dashboard)
- Tab 4: Task 21 (E2E tests)

### **Round 3:** After Round 2 (~90 min from now)
- Tab 1: Task 7-8 (Calendar)
- Tab 2: Task 9-10 (AI Assistant)
- Tab 3: Task 11 (Streaks)
- Tab 4: Task 12 (Toast notifications)

### **Round 4:** After Round 3 (~180 min from now) - GOALS & HABITS!
- Tab 1: Task 24 (Goals schema) → Task 25 (Goals hooks) → Task 27 (Goals UI)
- Tab 2: Task 26 (Habits hooks) → Task 28 (Habits UI)
- Tab 3: Task 22 (Service tests for goals/habits)
- Tab 4: Task 13 (Loading skeletons)

### **Round 5:** After Round 4 (~270 min from now) - DEPLOY!
- Tab 1: Task 29 (Git push)
- Tab 2: Task 30 (Deploy to Vercel)
- Tab 3: Task 23 (System tests + coverage)
- Tab 4: Task 18 (Update README with screenshots)

---

## ⏱️ TOTAL TIMELINE

| Phase | Duration | Cumulative | Status |
|-------|----------|------------|--------|
| Round 1 | 25 min | 25 min | ✅ Complete |
| Round 2 | 60 min | 85 min | 🎯 Next |
| Round 3 | 90 min | 175 min | ⏳ Waiting |
| Round 4 | 90 min | 265 min | ⏳ Waiting |
| Round 5 | 30 min | **295 min** | ⏳ Waiting |

**Total:** ~5 hours = **Deployed MVP with Goals & Habits!** 🚀

---

## 🎯 WHAT YOU'LL HAVE AT DEPLOYMENT

### **Core Features:**
✅ Authentication (email/password)
✅ Daily planner with tasks
✅ Diary with mood tracking
✅ Calendar view (navigate all days)
✅ AI assistant (chat + summaries)
✅ Streak tracking & gamification
✅ Dashboard with stats
✅ **Goals system** (yearly/monthly/weekly)
✅ **Habits tracking** (daily streaks)
✅ Toast notifications
✅ Loading states & skeletons
✅ Dark mode
✅ Responsive design

### **Testing:**
✅ Unit tests (80%+ coverage)
✅ Component tests
✅ E2E tests
✅ Service tests
✅ System tests

### **Deployment:**
✅ Live on Vercel
✅ Production database
✅ Environment configured
✅ SSL/HTTPS
✅ Fast global CDN

---

## 📊 DEPLOYMENT CHECKLIST

### **Pre-Deployment:**
- [ ] All features working locally
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] `.env.example` updated
- [ ] README updated

### **Deployment:**
- [ ] Code pushed to Git
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Production URL works
- [ ] All features tested in prod

### **Post-Deployment:**
- [ ] Share URL with team
- [ ] Test on mobile devices
- [ ] Monitor for errors
- [ ] Celebrate! 🎉

---

## 🚀 NEXT STEPS

**When Round 1 Finishes (~20 min):**
1. Verify Tasks 3, 4, 19 complete
2. Start Round 2 (I'll give you commands)
3. Keep momentum going!

**After All Rounds:**
1. Deploy to Vercel
2. Share your live DAYO app!
3. Get feedback
4. Plan next features

---

## 💪 YOU'LL HAVE BUILT:

**A production-ready life companion app with:**
- Full authentication
- Daily planning & diary
- Goals & habits tracking
- AI-powered insights
- Calendar navigation
- Gamification (streaks)
- Beautiful UI/UX
- 80%+ test coverage
- Deployed & live!

**In just 5 hours of parallel work!** 🔥

---

**Ready to build something amazing?** YALLA! 🚀
