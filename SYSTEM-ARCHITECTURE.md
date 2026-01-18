# DAYO System Architecture

**Version:** 1.0
**Last Updated:** January 18, 2026
**Status:** Production-Ready POC

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Database Layer](#3-database-layer)
4. [Backend Services](#4-backend-services)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Deployment Strategy](#6-deployment-strategy)
7. [Scaling Strategy](#7-scaling-strategy)
8. [Cost Analysis](#8-cost-analysis)
9. [Security Considerations](#9-security-considerations)
10. [Future Roadmap](#10-future-roadmap)

---

## 1. System Overview

### What is DAYO?

DAYO is a **life companion app** combining:
- Daily task planning
- Personal diary/journaling with mood tracking
- Habit tracking with streaks
- Goal management
- AI-powered insights (planned)
- Gamification features

### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + TypeScript | UI Framework |
| **Styling** | Tailwind CSS | Design System |
| **State (Client)** | Zustand | Auth & UI state |
| **State (Server)** | React Query v5 | Data fetching & caching |
| **Backend** | Supabase (BaaS) | Auth, Database, Storage |
| **Database** | PostgreSQL | Data persistence |
| **Build** | Vite 7 | Dev server & bundling |
| **Testing** | Vitest + Playwright | Unit & E2E tests |

### Current Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVERLESS ARCHITECTURE                  │
│                                                             │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────────┐   │
│  │ React   │───►│  Supabase   │───►│   PostgreSQL     │   │
│  │ SPA     │◄───│  (BaaS)     │◄───│   (Managed)      │   │
│  └─────────┘    └─────────────┘    └──────────────────┘   │
│       │               │                                    │
│       │         ┌─────┴─────┐                              │
│       │         │           │                              │
│       │    ┌────▼───┐ ┌─────▼────┐                        │
│       │    │  Auth  │ │ Storage  │                        │
│       │    │Service │ │ (Photos) │                        │
│       │    └────────┘ └──────────┘                        │
│       │                                                    │
│  ┌────▼────────────────────────────────────────────────┐  │
│  │                   CDN (Vercel)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 USER LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Mobile    │  │   Desktop   │  │   Tablet    │  │    PWA      │        │
│  │  (Safari)   │  │  (Chrome)   │  │  (Safari)   │  │  (Future)   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CDN / EDGE LAYER                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Vercel Edge Network                            │  │
│  │  • Global CDN distribution (100+ PoPs)                                │  │
│  │  • Static asset caching                                               │  │
│  │  • Automatic HTTPS                                                    │  │
│  │  • Edge Functions (optional)                                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION LAYER                                 │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                         React SPA (Client-Side)                        ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 ││
│  │  │    Pages     │  │  Components  │  │    Hooks     │                 ││
│  │  │  • Today     │  │  • TaskList  │  │  • useTasks  │                 ││
│  │  │  • Calendar  │  │  • Calendar  │  │  • useDiary  │                 ││
│  │  │  • Dashboard │  │  • DiaryMod  │  │  • useStats  │                 ││
│  │  │  • Goals     │  │  • NavBar    │  │              │                 ││
│  │  │  • Habits    │  │  • StatsRow  │  │              │                 ││
│  │  │  • Settings  │  │              │  │              │                 ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 ││
│  │           │                │                │                          ││
│  │           ▼                ▼                ▼                          ││
│  │  ┌──────────────────────────────────────────────────────────────────┐ ││
│  │  │                     State Management Layer                        │ ││
│  │  │  ┌─────────────────┐        ┌─────────────────────────────────┐  │ ││
│  │  │  │    Zustand      │        │       React Query v5            │  │ ││
│  │  │  │  (Client State) │        │      (Server State)             │  │ ││
│  │  │  │  • Auth State   │        │  • Query Cache                  │  │ ││
│  │  │  │  • UI State     │        │  • Optimistic Updates           │  │ ││
│  │  │  │  • Theme        │        │  • Background Refetch           │  │ ││
│  │  │  └─────────────────┘        └─────────────────────────────────┘  │ ││
│  │  └──────────────────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND-AS-A-SERVICE                              │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                        Supabase Platform                               ││
│  │                                                                        ││
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐      ││
│  │  │    Auth    │  │  Database  │  │  Storage   │  │  Realtime  │      ││
│  │  │            │  │            │  │            │  │  (Future)  │      ││
│  │  │ • Email/PW │  │ PostgreSQL │  │ • Photos   │  │            │      ││
│  │  │ • OAuth    │  │ • RLS      │  │ • Exports  │  │ • Presence │      ││
│  │  │ • JWT      │  │ • Triggers │  │            │  │ • Sync     │      ││
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘      ││
│  │        │               │               │               │              ││
│  │        └───────────────┴───────────────┴───────────────┘              ││
│  │                                │                                       ││
│  │                    ┌───────────▼───────────┐                          ││
│  │                    │     PostgREST API     │                          ││
│  │                    │  (Auto-generated)     │                          ││
│  │                    └───────────────────────┘                          ││
│  └────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                      PostgreSQL Database                               ││
│  │                                                                        ││
│  │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                  ││
│  │  │    days     │   │    tasks    │   │ user_stats  │                  ││
│  │  │             │   │             │   │             │                  ││
│  │  │ • id (PK)   │   │ • id (PK)   │   │ • user_id   │                  ││
│  │  │ • user_id   │◄──│ • user_id   │   │   (PK/FK)   │                  ││
│  │  │ • date      │   │ • date      │   │ • streak    │                  ││
│  │  │ • mood      │   │ • title     │   │ • longest   │                  ││
│  │  │ • diary_text│   │ • completed │   │ • last_date │                  ││
│  │  └─────────────┘   └─────────────┘   └─────────────┘                  ││
│  │         │                 │                 │                          ││
│  │         └─────────────────┴─────────────────┘                          ││
│  │                           │                                            ││
│  │              ┌────────────▼────────────┐                               ││
│  │              │   auth.users (FK ref)   │                               ││
│  │              │   (Supabase managed)    │                               ││
│  │              └─────────────────────────┘                               ││
│  └────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Layer

### Entity-Relationship Diagram

```
┌──────────────────────┐         ┌──────────────────────┐
│     auth.users       │         │      user_stats      │
│    (Supabase)        │         │                      │
├──────────────────────┤         ├──────────────────────┤
│ id (UUID) PK         │◄────────│ user_id (UUID) PK/FK │
│ email                │    1:1  │ current_streak       │
│ created_at           │         │ longest_streak       │
│ ...                  │         │ last_active_date     │
└──────────────────────┘         │ created_at           │
         │                       │ updated_at           │
         │                       └──────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────┐         ┌──────────────────────┐
│        days          │         │        tasks         │
├──────────────────────┤         ├──────────────────────┤
│ id (UUID) PK         │         │ id (UUID) PK         │
│ user_id (UUID) FK    │◄────────│ user_id (UUID) FK    │
│ date (DATE) UNIQUE*  │   1:N   │ date (DATE)          │
│ mood (TEXT)          │         │ title (TEXT)         │
│ diary_text (TEXT)    │         │ completed (BOOL)     │
│ created_at           │         │ created_at           │
│ updated_at           │         │ updated_at           │
└──────────────────────┘         └──────────────────────┘

* UNIQUE constraint on (user_id, date)
```

### Table Schemas

#### `days` - Diary Entries

```sql
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT,                    -- amazing, happy, okay, sad, stressed
  diary_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)         -- One entry per user per day
);

-- Auto-update trigger
CREATE TRIGGER update_days_updated_at
  BEFORE UPDATE ON days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### `tasks` - Daily Tasks

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tasks_user_date ON tasks(user_id, date);
```

#### `user_stats` - Streak Tracking

```sql
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

All tables enforce user isolation at the database level:

```sql
-- Example for 'days' table (same pattern for all)
ALTER TABLE days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can SELECT own days"
  ON days FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can INSERT own days"
  ON days FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can UPDATE own days"
  ON days FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can DELETE own days"
  ON days FOR DELETE USING (auth.uid() = user_id);
```

### Data Flow

```
User Action → React Component → React Query Mutation → Supabase Client → PostgreSQL

                 ┌──────────────────────────────────────────────────┐
                 │              React Query Cache                   │
                 │  ┌────────────────┐  ┌────────────────────────┐ │
  Optimistic ───►│  │ ['tasks', date]│  │ ['dayEntry', date]     │ │
   Update        │  │  [task1,task2] │  │ {mood:'happy',text:''} │ │
                 │  └────────────────┘  └────────────────────────┘ │
                 └──────────────────────────────────────────────────┘
                           │                      │
                           ▼                      ▼
                 ┌──────────────────────────────────────────────────┐
                 │              Supabase PostgREST                  │
                 │         (Auto-generated REST API)                │
                 └──────────────────────────────────────────────────┘
                                      │
                                      ▼
                 ┌──────────────────────────────────────────────────┐
                 │              PostgreSQL + RLS                    │
                 │     (Filters by auth.uid() automatically)        │
                 └──────────────────────────────────────────────────┘
```

---

## 4. Backend Services

### Service Architecture

DAYO uses a **Backend-as-a-Service (BaaS)** model with Supabase providing:

| Service | Provider | Purpose |
|---------|----------|---------|
| **Authentication** | Supabase Auth | User identity management |
| **Database** | Supabase (PostgreSQL) | Data persistence |
| **Storage** | Supabase Storage | Photo uploads (future) |
| **API** | PostgREST (auto-generated) | RESTful endpoints |
| **Realtime** | Supabase Realtime | Live subscriptions (future) |

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                               │
│                                                                          │
│   ┌──────────┐     ┌──────────────┐     ┌──────────────┐                │
│   │  User    │────►│  Login Page  │────►│   Supabase   │                │
│   │  Input   │     │  (React)     │     │    Auth      │                │
│   └──────────┘     └──────────────┘     └──────────────┘                │
│                           │                    │                         │
│                           │                    ▼                         │
│                           │           ┌──────────────┐                   │
│                           │           │  JWT Token   │                   │
│                           │           │  (Session)   │                   │
│                           │           └──────────────┘                   │
│                           │                    │                         │
│                           ▼                    ▼                         │
│                    ┌─────────────────────────────────────┐              │
│                    │         Zustand Auth Store          │              │
│                    │  { user, loading, signOut() }       │              │
│                    └─────────────────────────────────────┘              │
│                                     │                                    │
│                                     ▼                                    │
│                    ┌─────────────────────────────────────┐              │
│                    │     Protected Route Access          │              │
│                    │  (All pages except login/signup)    │              │
│                    └─────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘

Supported Methods:
  • Email/Password (primary)
  • Google OAuth (social login)
```

### API Layer

Supabase auto-generates a RESTful API from the database schema:

| Endpoint Pattern | Method | Description |
|-----------------|--------|-------------|
| `/rest/v1/tasks` | GET | List user's tasks |
| `/rest/v1/tasks` | POST | Create task |
| `/rest/v1/tasks?id=eq.{id}` | PATCH | Update task |
| `/rest/v1/tasks?id=eq.{id}` | DELETE | Delete task |
| `/rest/v1/days` | GET | List diary entries |
| `/rest/v1/days` | POST/PATCH | Upsert diary |
| `/rest/v1/user_stats` | GET/PATCH | Read/update stats |

### React Hooks → API Mapping

```typescript
// Frontend Hook         →  API Call
useTasks(date)           →  GET /tasks?date=eq.{date}&user_id=eq.{uid}
useCreateTask()          →  POST /tasks
useUpdateTask()          →  PATCH /tasks?id=eq.{id}
useDeleteTask()          →  DELETE /tasks?id=eq.{id}
useDayEntry(date)        →  GET /days?date=eq.{date}&user_id=eq.{uid}
useUpsertDayEntry()      →  POST /days (with upsert)
useUserStats(userId)     →  GET /user_stats?user_id=eq.{uid}
useUpdateStreak()        →  PATCH /user_stats?user_id=eq.{uid}
```

---

## 5. Frontend Architecture

### Component Hierarchy

```
App.tsx (Root)
├── QueryClientProvider (React Query)
├── Toaster (Sonner notifications)
└── Routes
    ├── /login → LoginPage
    ├── /signup → SignupPage
    └── [Protected Routes]
        ├── /today → TodayPage
        │   ├── Header (greeting + streak badge)
        │   ├── DateNavigation
        │   ├── QuoteCard
        │   ├── StatsRow
        │   ├── TasksSection
        │   │   └── TaskItem (× N)
        │   ├── HabitsSection
        │   │   └── HabitCard (× 4)
        │   ├── QuickAccessCards
        │   ├── BottomNavigation
        │   └── DiaryEntryModal (conditional)
        │
        ├── /calendar → CalendarPage
        │   ├── Calendar (month grid)
        │   ├── SelectedDayPreview
        │   └── BottomNavigation
        │
        ├── /dashboard → DashboardPage
        │   ├── StatCards (streak, tasks, entries)
        │   ├── QuickAccessCards
        │   └── BottomNavigation
        │
        ├── /diary → DiaryPage
        ├── /habits → HabitsPage
        ├── /goals → GoalsPage
        └── /settings → SettingsPage
```

### State Management Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT                                  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      CLIENT STATE (Zustand)                        │  │
│  │                                                                    │  │
│  │  useAuthStore                                                      │  │
│  │  ├── user: User | null                                            │  │
│  │  ├── loading: boolean                                             │  │
│  │  ├── setUser(user)                                                │  │
│  │  ├── signOut()                                                    │  │
│  │  └── initialize()                                                 │  │
│  │                                                                    │  │
│  │  Use for: Authentication, UI preferences, theme                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    SERVER STATE (React Query)                      │  │
│  │                                                                    │  │
│  │  Query Keys                    Cached Data                         │  │
│  │  ─────────────                 ───────────                         │  │
│  │  ['tasks', '2026-01-18']  →   [{id, title, completed}...]         │  │
│  │  ['dayEntry', '2026-01-18'] → {mood, diary_text}                  │  │
│  │  ['user_stats', 'uid123']  →  {current_streak, longest_streak}    │  │
│  │  ['aggregated_stats', 'uid'] → {weekTasks, monthEntries}          │  │
│  │                                                                    │  │
│  │  Features:                                                         │  │
│  │  • Automatic background refetch                                   │  │
│  │  • Optimistic updates                                             │  │
│  │  • Cache invalidation                                             │  │
│  │  • Request deduplication                                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    LOCAL STATE (useState/useReducer)               │  │
│  │                                                                    │  │
│  │  Component-specific state:                                         │  │
│  │  • selectedDate (TodayPage)                                       │  │
│  │  • showDiaryModal (TodayPage)                                     │  │
│  │  • currentMonth (Calendar)                                        │  │
│  │  • form inputs                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design System

```
DAYO Color Palette
══════════════════════════════════════════════════════
Primary:    #8B5CF6 (Purple)     - Brand color, CTAs
Accent:     #F97316 (Orange)     - Streaks, highlights
Secondary:  #EC4899 (Pink)       - Gradients
Background: #F9FAFB (Gray-50)    - Page background
Surface:    #FFFFFF (White)      - Cards, modals
Text:       #111827 (Gray-900)   - Primary text
Muted:      #6B7280 (Gray-500)   - Secondary text

Gradients:
• dayo-gradient: linear-gradient(135deg, #8B5CF6 → #EC4899)
• dayo-gradient-light: linear-gradient(135deg, #A78BFA → #F472B6)

Shadows:
• dayo: 0 4px 20px rgba(139, 92, 246, 0.15)
• dayo-lg: 0 10px 40px rgba(139, 92, 246, 0.2)

Typography: System font stack (fast loading)
Icons: Lucide React (140+ SVG icons, tree-shakeable)
```

---

## 6. Deployment Strategy

### Current Setup (POC)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       DEPLOYMENT ARCHITECTURE                            │
│                                                                          │
│   Developer                  CI/CD                    Production         │
│   ─────────                  ─────                    ──────────         │
│                                                                          │
│   ┌─────────┐   git push   ┌─────────┐  deploy     ┌─────────────────┐ │
│   │  Local  │─────────────►│ GitHub  │────────────►│     Vercel      │ │
│   │   Dev   │              │  Repo   │             │   Edge Network  │ │
│   └─────────┘              └─────────┘             └─────────────────┘ │
│       │                                                    │            │
│       │                                                    ▼            │
│   npm run dev                                    ┌─────────────────┐   │
│   localhost:5173                                 │   Static Files   │   │
│                                                  │  • index.html    │   │
│                                                  │  • assets/*.js   │   │
│                                                  │  • assets/*.css  │   │
│                                                  └─────────────────┘   │
│                                                           │            │
│                                                           ▼            │
│                                                  ┌─────────────────┐   │
│                                                  │    Supabase     │   │
│                                                  │   (us-east-1)   │   │
│                                                  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Deployment Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (automatic on push to main)
vercel --prod
```

### Environment Configuration

```bash
# Production (.env.production)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Development (.env.local)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Future: OpenAI Integration
VITE_OPENAI_API_KEY=sk-...
```

### Recommended Production Stack

| Component | Service | Tier | Monthly Cost |
|-----------|---------|------|--------------|
| **Hosting** | Vercel | Hobby/Pro | $0-20 |
| **Database** | Supabase | Free/Pro | $0-25 |
| **Domain** | Any registrar | - | ~$12/year |
| **SSL** | Vercel (automatic) | - | $0 |
| **CDN** | Vercel Edge | Included | $0 |

---

## 7. Scaling Strategy

### Current Capacity (Free Tier)

| Resource | Supabase Free | Vercel Hobby |
|----------|---------------|--------------|
| **Database** | 500MB | N/A |
| **Storage** | 1GB | N/A |
| **Bandwidth** | 2GB/month | 100GB/month |
| **API Requests** | Unlimited* | N/A |
| **Auth Users** | 50,000 | N/A |
| **Concurrent Connections** | 50 | N/A |

*Subject to fair use

### Scaling Phases

#### Phase 1: 0-1,000 Users (Current)

```
Single Region Deployment
─────────────────────────────────────────────────
• Vercel Hobby ($0)
• Supabase Free ($0)
• Total: $0/month

Capacity:
• ~1,000 daily active users
• ~500MB database
• ~100k API calls/day
```

#### Phase 2: 1,000-10,000 Users

```
Upgraded Tiers
─────────────────────────────────────────────────
• Vercel Pro ($20/month)
• Supabase Pro ($25/month)
• Total: $45/month

Upgrades:
• 8GB database
• 100GB storage
• Unlimited bandwidth
• Team collaboration
• Analytics
```

#### Phase 3: 10,000-100,000 Users

```
Multi-Region + Custom Backend
─────────────────────────────────────────────────
• Vercel Enterprise
• Supabase Team ($599/month) OR
• Self-hosted PostgreSQL + Custom API

Architecture Changes:
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                │
│  │ Vercel  │                                                │
│  │  Edge   │◄──────────────────────────────────────────┐   │
│  └────┬────┘                                            │   │
│       │                                                 │   │
│       ▼                                                 │   │
│  ┌─────────────────────────────────────────────────┐   │   │
│  │              API Gateway (Custom)               │   │   │
│  │            (Rate limiting, caching)             │   │   │
│  └───────┬────────────────┬───────────────┬────────┘   │   │
│          │                │               │            │   │
│          ▼                ▼               ▼            │   │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐       │   │
│   │ Primary  │    │ Read     │    │  Redis   │       │   │
│   │   DB     │───►│ Replicas │    │  Cache   │◄──────┘   │
│   │ (Write)  │    │ (Read)   │    │          │           │
│   └──────────┘    └──────────┘    └──────────┘           │
└─────────────────────────────────────────────────────────────┘
```

#### Phase 4: 100,000+ Users

```
Full Custom Infrastructure
─────────────────────────────────────────────────
Estimated: $2,000-10,000/month

Components:
• Kubernetes cluster (GKE/EKS)
• PostgreSQL cluster with read replicas
• Redis for caching & sessions
• CDN (CloudFront/Fastly)
• APM (DataDog/New Relic)
• Custom auth service
```

### Scaling Optimizations

| Bottleneck | Solution | When to Apply |
|------------|----------|---------------|
| **Database reads** | Read replicas | >5k users |
| **Expensive queries** | Redis caching | >2k users |
| **API rate limiting** | Edge caching | >10k users |
| **Auth overhead** | JWT + Redis sessions | >20k users |
| **Image storage** | CDN + lazy loading | >1k users with photos |
| **Bundle size** | Code splitting | Now (566KB) |

---

## 8. Cost Analysis

### Monthly Cost Breakdown by Scale

```
┌────────────────────────────────────────────────────────────────────────┐
│                     MONTHLY COST BY USER SCALE                          │
│                                                                         │
│  Cost ($)                                                               │
│    │                                                                    │
│ 600├                                                          ┌────    │
│    │                                                          │        │
│ 500├                                                          │        │
│    │                                                          │        │
│ 400├                                                          │        │
│    │                                                          │        │
│ 300├                                                          │        │
│    │                                                          │        │
│ 200├                                                  ┌───────┘        │
│    │                                                  │                 │
│ 100├                                          ┌───────┘                 │
│    │                                  ┌───────┘                         │
│  45├──────────────────────────────────┘                                 │
│   0├──────────────┬───────────────────┴────────────────────────────    │
│    0           1,000            10,000           50,000      100,000   │
│                                 Users                                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Detailed Cost Matrix

| Users | Hosting | Database | Storage | CDN | Monitoring | Total |
|-------|---------|----------|---------|-----|------------|-------|
| 0-1K | $0 | $0 | $0 | $0 | $0 | **$0** |
| 1-5K | $20 | $25 | $0 | $0 | $0 | **$45** |
| 5-10K | $20 | $25 | $25 | $0 | $0 | **$70** |
| 10-20K | $20 | $100 | $50 | $0 | $20 | **$190** |
| 20-50K | $50 | $200 | $100 | $50 | $50 | **$450** |
| 50-100K | $100 | $400 | $200 | $100 | $100 | **$900** |

### Cost Per User

| Scale | Monthly Cost | Cost/User/Month |
|-------|--------------|-----------------|
| 1,000 | $0 | $0.000 |
| 5,000 | $45 | $0.009 |
| 10,000 | $70 | $0.007 |
| 50,000 | $450 | $0.009 |
| 100,000 | $900 | $0.009 |

**Key Insight:** Cost per user stabilizes at ~$0.01/user/month at scale.

### Revenue Breakeven Analysis

Assuming freemium model:
- Free tier: Basic features
- Premium: $4.99/month (AI features, advanced analytics)

| Monthly Users | Premium % | Premium Users | Revenue | Costs | Profit |
|---------------|-----------|---------------|---------|-------|--------|
| 1,000 | 5% | 50 | $250 | $45 | $205 |
| 10,000 | 5% | 500 | $2,495 | $190 | $2,305 |
| 50,000 | 5% | 2,500 | $12,475 | $450 | $12,025 |
| 100,000 | 5% | 5,000 | $24,950 | $900 | $24,050 |

---

## 9. Security Considerations

### Current Security Measures

| Layer | Protection | Implementation |
|-------|------------|----------------|
| **Transport** | HTTPS/TLS | Vercel automatic |
| **Authentication** | JWT tokens | Supabase Auth |
| **Authorization** | Row-Level Security | PostgreSQL RLS |
| **Data Isolation** | Per-user policies | All tables |
| **Password** | bcrypt hashing | Supabase managed |
| **API** | Anon key + RLS | Client-side safe |

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Layer 1: Transport Security                                      │    │
│  │ • TLS 1.3 encryption                                            │    │
│  │ • HSTS headers                                                   │    │
│  │ • Certificate auto-renewal                                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Layer 2: Authentication                                          │    │
│  │ • JWT token validation                                          │    │
│  │ • Session management                                            │    │
│  │ • OAuth 2.0 (Google)                                            │    │
│  │ • Secure password hashing (bcrypt)                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Layer 3: Authorization (RLS)                                     │    │
│  │ • Row-Level Security on all tables                              │    │
│  │ • User can only access own data                                 │    │
│  │ • Enforced at database level                                    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Layer 4: Data Protection                                         │    │
│  │ • Encrypted at rest (Supabase)                                  │    │
│  │ • Regular backups                                               │    │
│  │ • GDPR-ready data deletion                                      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Recommendations for Production

| Priority | Security Enhancement | Status |
|----------|---------------------|--------|
| **HIGH** | Enable 2FA option | Planned |
| **HIGH** | Add rate limiting | Planned |
| **MEDIUM** | Audit logging | Planned |
| **MEDIUM** | Content Security Policy | Not configured |
| **LOW** | Penetration testing | Future |

---

## 10. Future Roadmap

### Technical Enhancements

```
Q1 2026 (Current)
├── ✅ Core functionality
├── ✅ Task management
├── ✅ Diary with mood
├── ✅ Streak tracking
├── ✅ Calendar view
├── 🔄 AI integration (in progress)
└── 📋 Image uploads (planned)

Q2 2026
├── 📋 PWA support (offline mode)
├── 📋 Push notifications
├── 📋 Data export (JSON/PDF)
├── 📋 Habits backend (currently mock)
└── 📋 Goals backend (currently mock)

Q3 2026
├── 📋 React Native mobile app
├── 📋 Realtime sync
├── 📋 Sharing features
└── 📋 Analytics dashboard

Q4 2026
├── 📋 Premium features
├── 📋 Team/family accounts
├── 📋 API for integrations
└── 📋 Widget support
```

### Architecture Evolution

```
Current State (Monolith SPA)
────────────────────────────
React SPA → Supabase

Phase 2 (API Layer)
────────────────────────────
React SPA → Edge Functions → Supabase
                 │
                 └── OpenAI API
                 └── Push notifications

Phase 3 (Microservices)
────────────────────────────
                    ┌── User Service
React Apps ──► API ─┼── Content Service
(Web/Mobile)  GW    ├── AI Service
                    └── Notification Service
```

---

## Appendix A: Quick Reference

### Key Files

| Purpose | File Path |
|---------|-----------|
| Entry point | `src/main.tsx` |
| Routes | `src/App.tsx` |
| Supabase client | `src/lib/supabase.ts` |
| Auth store | `src/store/authStore.ts` |
| Task hooks | `src/hooks/useTasks.ts` |
| Diary hooks | `src/hooks/useDiary.ts` |
| Stats hooks | `src/hooks/useUserStats.ts` |
| Toast utils | `src/lib/toast.ts` |
| Tailwind config | `tailwind.config.js` |

### Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production

# Testing
npm test                 # Unit tests (watch)
npm run test:run         # Unit tests (once)
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Code Quality
npm run lint             # ESLint
npx tsc --noEmit         # Type check
```

### Environment Variables

```bash
VITE_SUPABASE_URL        # Supabase project URL
VITE_SUPABASE_ANON_KEY   # Supabase anon/public key
VITE_OPENAI_API_KEY      # OpenAI API key (optional)
```

---

**Document Maintainer:** Development Team
**Last Review:** January 18, 2026
**Next Review:** February 2026
