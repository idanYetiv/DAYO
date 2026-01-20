# DAYO Project - Claude Session Guide

> **Read this file at the start of each session to get up to speed quickly.**

---

## 1. Session Setup (REQUIRED)

```bash
# Set git config for personal GitHub account
cd ~/DAYO
git config user.name "idanYetiv"
git config user.email "idanyativ@gmail.com"
```

---

## 2. Project Overview

**DAYO** = "Your Day. Your Story. Your Growth."

A life companion app combining:
- Daily task planner
- Personal diary with mood tracking
- Habit tracking with streaks
- Goal management (yearly/monthly/weekly)
- AI-powered assistant
- Gamification features
- Instagram export for sharing

**Mission:** Plan. Reflect. Grow.

---

## 3. Links & Deployments

| Resource | URL |
|----------|-----|
| **Production** | https://dayo-web.vercel.app |
| **GitHub** | https://github.com/idanYetiv/DAYO |
| **Vercel Project** | dayo-web |
| **Supabase** | https://srhxwubcfcuvgmrqyabf.supabase.co |

---

## 4. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS (custom dayo-* classes) |
| Build | Vite 7 |
| Routing | React Router 7 |
| Server State | React Query 5 |
| Client State | Zustand |
| Backend | Supabase (Auth, Database, Storage) |
| Database | PostgreSQL with RLS |
| Hosting | Vercel |
| Testing | Vitest + Playwright |

---

## 5. Project Structure

```
~/DAYO/
├── CLAUDE.md                 # This file - session guide
├── DAYO-product-req.md       # Full product requirements
├── OPEN-TASKS.md             # Current task backlog
├── SYSTEM-ARCHITECTURE.md    # Technical architecture
├── README.md                 # Project overview
├── CONTRIBUTING.md           # PR workflow guide
├── DEPLOYMENT-PLAN.md        # Deployment roadmap
├── FEATURE-INSTAGRAM-EXPORT.md
├── Claude-discussions/       # Session summaries
│   ├── 01-planning-questions.md
│   ├── 02-initial-setup-summary.md
│   ├── 03-session-summary-jan13.md
│   └── 04-session-summary-jan17.md
├── .claude/agents/           # 15 specialized subagents
└── dayo-web/                 # Main web application
    ├── src/
    │   ├── pages/            # Route components (9 pages)
    │   ├── hooks/            # Data hooks (useTasks, useDiary, useUserStats, useAI)
    │   ├── components/       # UI components
    │   │   ├── ai/           # AI chat components
    │   │   ├── diary/        # Diary modal
    │   │   ├── export/       # Instagram export
    │   │   ├── planner/      # Tasks, calendar
    │   │   └── ui/           # Generic UI
    │   ├── lib/              # Utilities (supabase, openai, toast)
    │   └── store/            # Zustand (authStore)
    └── .env                  # Supabase credentials
```

---

## 6. Database Schema

```sql
-- Daily entries with mood and diary
days (id, user_id, date, mood, diary_text)

-- Tasks for each day
tasks (id, user_id, date, title, completed)

-- User statistics and streaks
user_stats (user_id, current_streak, longest_streak, last_active_date)
```

All tables use Row Level Security (RLS).

---

## 7. Current Feature Status

### Completed
| Feature | Status |
|---------|--------|
| Auth (email/password) | ✅ |
| Daily tasks CRUD | ✅ |
| Diary with mood tracking | ✅ |
| Calendar navigation | ✅ |
| Dashboard with real stats | ✅ |
| Streak system | ✅ |
| Toast notifications | ✅ |
| Instagram export (3 templates) | ✅ |
| AI Assistant (mock mode) | ✅ |
| Bottom navigation | ✅ |

### Pending (from OPEN-TASKS.md)
| # | Task | Priority |
|---|------|----------|
| 14 | Image upload for diary | Medium |
| 17 | Demo data seeder | Medium |
| 13 | Loading skeletons | Low |
| 15 | Keyboard shortcuts | Low |
| 16 | Animations (Framer Motion) | Low |
| 18 | Update README | Low |
| 20 | Direct Instagram API | Phase 2 |

---

## 8. Team Agents (.claude/agents/)

| Agent | Role |
|-------|------|
| agent-organizer | Routes tasks, coordinates workflows |
| ceo | Strategic decisions, vision |
| product-manager | Requirements, priorities, roadmap |
| project-manager | Timelines, coordination |
| tech-lead | Architecture, code quality |
| frontend-developer | React/TypeScript UI |
| backend-developer | API, database |
| ux-designer | User experience, design |
| qa-engineer | Testing, quality |
| devops-engineer | Infrastructure |
| delivery-engineer | Releases, CI/CD |
| data-engineer | Data pipelines |
| content-marketer | Growth, social media |
| market-researcher | User research |
| context-manager | Documentation |

---

## 9. Quick Commands

```bash
# Development
cd ~/DAYO/dayo-web
npm run dev              # Start dev server (localhost:5173)

# Type check
npx tsc --noEmit

# Build
npm run build

# Deploy to production
cd ~/DAYO/dayo-web
vercel --prod --yes

# Git workflow
git checkout -b feat/feature-name
git add . && git commit -m "feat: description"
git push -u origin feat/feature-name
gh pr create --title "feat: title" --body "description"
```

---

## 10. Environment Variables

```bash
# Required in dayo-web/.env
VITE_SUPABASE_URL=https://srhxwubcfcuvgmrqyabf.supabase.co
VITE_SUPABASE_ANON_KEY=<key>

# Optional (enables real AI)
VITE_OPENAI_API_KEY=<key>
```

---

## 11. Key Patterns

### Component Pattern
```typescript
// src/components/[category]/ComponentName.tsx
interface ComponentNameProps {
  // Props with explicit types
}

export default function ComponentName({ prop }: ComponentNameProps) {
  // Hooks at top
  // Event handlers
  // Render
}
```

### Data Hook Pattern
```typescript
// src/hooks/useFeature.ts
export function useFeature() {
  return useQuery({...})  // React Query for fetching
}

export function useCreateFeature() {
  return useMutation({...})  // React Query for mutations
}
```

### Styling
- Tailwind utility classes
- Custom colors: `dayo-purple`, `dayo-orange`, `dayo-pink`, `dayo-gray-*`
- Custom shadows: `shadow-dayo`, `shadow-dayo-lg`

---

## 12. Open PRs

Check current PRs:
```bash
gh pr list
```

---

## 13. Session Checklist

At the start of each session:
- [ ] Read this CLAUDE.md
- [ ] Run git config setup (Section 1)
- [ ] Check `git status` for uncommitted work
- [ ] Check `gh pr list` for open PRs
- [ ] Review OPEN-TASKS.md for current priorities
- [ ] Ask user what they want to work on

---

## 14. Documentation Index

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Session bootstrap (this file) |
| `DAYO-product-req.md` | Full product vision & requirements |
| `OPEN-TASKS.md` | Current task backlog with priorities |
| `SYSTEM-ARCHITECTURE.md` | Technical architecture details |
| `README.md` | Public project overview |
| `CONTRIBUTING.md` | PR workflow guide |
| `Claude-discussions/*.md` | Historical session summaries |

---

*Last updated: January 19, 2026*
