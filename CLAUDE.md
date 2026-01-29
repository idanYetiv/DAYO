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
- **iOS App** via Capacitor (App Store ready)

**Mission:** Plan. Reflect. Grow.

**Target Audiences:**
- **Adults** - Reflect on your journey, capture moments, grow intentionally
- **Kids (8-14)** - Adventure journal with fun prompts and drawings

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
| **iOS** | Capacitor 8 (Xcode project in `dayo-web/ios/`) |

---

## 5. Project Structure

```
~/DAYO/
├── CLAUDE.md                 # This file - session guide (READ FIRST)
├── OPEN-TASKS.md             # Current task backlog
├── PLAN-KIDS-ADULTS-MODE.md  # Kids/Adults mode plan (IMPLEMENTED)
│
├── DAYO-product-req.md       # Full product requirements
├── PRODUCT-SUMMARY.md        # Quick product overview
├── SYSTEM-ARCHITECTURE.md    # Technical architecture
│
├── README.md                 # Public project overview
├── CONTRIBUTING.md           # PR workflow guide
│
├── Claude-discussions/       # Session summaries (historical)
├── .claude/agents/           # 15 specialized subagents
│
└── dayo-web/                 # Main web application
    ├── src/
    │   ├── pages/            # Route components (11 pages)
    │   │   ├── LandingPage.tsx     # Public marketing page
    │   │   └── OnboardingPage.tsx  # Profile type selection
    │   ├── hooks/            # Data hooks
    │   │   ├── useProfileMode.ts   # Profile mode context hook
    │   │   └── useContentForMode.ts # Mode-specific content
    │   ├── contexts/         # React contexts
    │   │   └── ProfileModeContext.tsx
    │   ├── data/             # Static data files
    │   │   ├── moods.ts      # Adult/kids mood options
    │   │   ├── prompts.ts    # Diary prompts per mode
    │   │   └── encouragements.ts # Toast messages per mode
    │   ├── components/
    │   │   ├── ai/           # AI chat components
    │   │   ├── diary/        # Diary modal
    │   │   ├── export/       # Instagram export
    │   │   ├── kids/         # Kids-specific UI components
    │   │   ├── landing/      # Landing page components
    │   │   ├── onboarding/   # Onboarding components
    │   │   ├── planner/      # Tasks, calendar
    │   │   └── ui/           # Generic UI
    │   ├── styles/           # CSS files
    │   │   └── kids-theme.css # Kids mode theme
    │   ├── lib/              # Utilities (supabase, openai, toast)
    │   └── store/            # Zustand (authStore)
    ├── ios/                  # Capacitor iOS project (Xcode)
    ├── capacitor.config.ts   # Capacitor configuration
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
| **Capacitor iOS setup** | ✅ |

### Just Completed - Kids vs Adults Mode
**See:** `PLAN-KIDS-ADULTS-MODE.md`

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Database Foundation (profile_type) | ✅ |
| 2 | Profile Mode Context | ✅ |
| 3 | Theme System (kids colors) | ✅ |
| 4 | Mode-Aware Content (prompts) | ✅ |
| 5 | Kids UI Components | ✅ |
| 6 | Onboarding Flow | ✅ |
| 7 | Landing Page | ✅ |
| 8 | Polish (Tests) | **In Progress** |

### In Progress - Test Coverage
New Kids/Adults features need tests:
- Unit tests for hooks and data files
- Component tests for new UI components
- Integration tests for pages
- E2E tests for user flows

### Backlog
| Task | Priority |
|------|----------|
| Image upload for diary | Medium |
| Demo data seeder | Medium |
| Loading skeletons | Low |
| Keyboard shortcuts | Low |
| Animations (Framer Motion) | Low |
| Direct Instagram API | Phase 2 |

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

# iOS (requires Xcode installed)
npm run cap:build:ios    # Build web + sync to iOS
npm run cap:ios          # Open Xcode project
npm run cap:sync         # Sync web assets to iOS

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
- [ ] Review `PLAN-KIDS-ADULTS-MODE.md` for active feature
- [ ] Ask user what they want to work on

---

## 14. Documentation Index

| Document | Priority | Purpose |
|----------|----------|---------|
| `CLAUDE.md` | **READ FIRST** | Session bootstrap (this file) |
| `PLAN-KIDS-ADULTS-MODE.md` | **ACTIVE** | Kids vs Adults mode implementation plan |
| `OPEN-TASKS.md` | Reference | Task backlog with priorities |
| `DAYO-product-req.md` | Reference | Full product vision & requirements |
| `PRODUCT-SUMMARY.md` | Reference | Quick product overview |
| `SYSTEM-ARCHITECTURE.md` | Reference | Technical architecture details |
| `README.md` | Public | Project overview |
| `CONTRIBUTING.md` | Reference | PR workflow guide |
| `Claude-discussions/*.md` | Archive | Historical session summaries |

---

## 15. Current Priority

**Active:** Test coverage for Kids/Adults Mode features

Features implemented, now need tests:
- Unit, component, integration, and E2E tests
- See `OPEN-TASKS.md` for detailed test checklist

---

## 16. Development Guidelines

### IMPORTANT: Every Feature Must Have Tests

When implementing any new feature:

1. **Unit Tests** - For data files, utilities, and hooks
   - Test pure functions
   - Test hook behavior with mocked dependencies

2. **Component Tests** - For UI components
   - Test rendering
   - Test user interactions
   - Test different states (loading, error, empty)

3. **Integration Tests** - For pages
   - Test page renders with mocked data
   - Test component interactions

4. **E2E Tests** - For critical user flows
   - Test full user journeys
   - Test happy path and error cases

### Test File Locations
```
src/__tests__/
├── unit/           # Unit tests for lib, hooks
├── integration/    # Page integration tests
└── e2e/            # Playwright E2E tests
```

### Test Commands
```bash
npm run test:run    # Run all unit/integration tests
npm run test        # Watch mode
npm run test:e2e    # Run Playwright E2E tests
```

### Definition of Done
A feature is NOT complete until:
- [ ] Code is implemented
- [ ] TypeScript compiles (`npm run build`)
- [ ] Existing tests pass (`npm run test:run`)
- [ ] **New tests are written for the feature**
- [ ] Documentation is updated

---

*Last updated: January 29, 2026*
