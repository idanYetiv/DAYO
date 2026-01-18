# DAYO - Your Daily Life Companion

<p align="center">
  <strong>Plan. Reflect. Grow.</strong>
</p>

<p align="center">
  <a href="https://dayo-web.vercel.app">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a>
</p>

---

## What is DAYO?

DAYO is a **life companion app** that helps you organize your day, track your habits, and reflect on your journey. It combines daily planning with personal journaling to help you build better habits and achieve your goals.

### Why DAYO?

- **All-in-One**: Tasks, diary, habits, and goals in one place
- **Streak Motivation**: Stay consistent with visual streak tracking
- **Mood Insights**: Track how you feel and spot patterns
- **Shareable Summaries**: Export beautiful day summaries to Instagram
- **Privacy First**: Your data stays yours with secure authentication

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Daily Tasks** | Add, complete, and track tasks for any day |
| **Mood Tracking** | Log how you're feeling with emoji-based moods |
| **Personal Diary** | Write daily reflections and journal entries |
| **Streak System** | Build consistency with automatic streak tracking |
| **Calendar View** | Navigate through your history day by day |
| **Dashboard** | See your stats at a glance |

### Instagram Export

Share your daily achievements with beautiful, customizable exports:

- **3 Templates**: Full Day Card, Diary Spotlight, Achievement Grid
- **3 Styles**: Playful, Minimal, Dark
- **2 Formats**: Story (9:16), Post (1:1)

### Coming Soon

- [ ] AI-powered daily insights
- [ ] Habit tracking with custom habits
- [ ] Goal setting with milestones
- [ ] Photo attachments in diary
- [ ] Push notifications

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite 7** | Build Tool |
| **Tailwind CSS** | Styling |
| **React Router 7** | Navigation |

### State Management

| Technology | Purpose |
|------------|---------|
| **React Query 5** | Server State & Caching |
| **Zustand** | Client State |

### Backend (BaaS)

| Technology | Purpose |
|------------|---------|
| **Supabase** | Authentication, Database, Storage |
| **PostgreSQL** | Data Persistence |
| **Row Level Security** | Data Isolation |

### Testing

| Technology | Purpose |
|------------|---------|
| **Vitest** | Unit Testing |
| **Playwright** | E2E Testing |
| **React Testing Library** | Component Testing |

### Deployment

| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting & CDN |
| **GitHub Actions** | CI/CD (planned) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  React + TypeScript + Tailwind                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │ Components  │  │   Hooks     │         │
│  │  • Today    │  │  • Tasks    │  │  • useTasks │         │
│  │  • Calendar │  │  • Calendar │  │  • useDiary │         │
│  │  • Dashboard│  │  • Export   │  │  • useStats │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │  Database   │  │   Storage   │         │
│  │  • Email    │  │  • days     │  │  • Photos   │         │
│  │  • Google   │  │  • tasks    │  │             │         │
│  │  • JWT      │  │  • stats    │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```sql
-- Daily entries with mood and diary
CREATE TABLE days (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  mood TEXT,           -- amazing, happy, okay, sad, stressed
  diary_text TEXT,
  UNIQUE(user_id, date)
);

-- Tasks for each day
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false
);

-- User statistics and streaks
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE
);
```

All tables use **Row Level Security (RLS)** to ensure users can only access their own data.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/idanYetiv/DAYO.git
cd DAYO/dayo-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
```

---

## Project Structure

```
DAYO/
├── dayo-web/                 # Main web application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── diary/        # Diary-related components
│   │   │   ├── export/       # Instagram export feature
│   │   │   ├── planner/      # Tasks, habits, calendar
│   │   │   └── ui/           # Generic UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configs
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   └── App.tsx           # Root component
│   ├── e2e/                  # Playwright E2E tests
│   └── package.json
├── Claude-discussions/       # Development session notes
├── CONTRIBUTING.md           # Development workflow
├── SYSTEM-ARCHITECTURE.md    # Technical documentation
├── OPEN-TASKS.md            # Task backlog
└── README.md                # This file
```

---

## Live Demo

**Try it now:** [https://dayo-web.vercel.app](https://dayo-web.vercel.app)

Create an account and start tracking your day!

---

## Contributing

We use a PR-based workflow. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

```bash
# Create feature branch
git checkout -b feat/your-feature

# Make changes and commit
git commit -m "feat: your feature description"

# Push and create PR
git push -u origin feat/your-feature
gh pr create
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md) | Full technical architecture |
| [OPEN-TASKS.md](./OPEN-TASKS.md) | Current task backlog |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development workflow |
| [FEATURE-INSTAGRAM-EXPORT.md](./FEATURE-INSTAGRAM-EXPORT.md) | Export feature spec |

---

## License

MIT

---

<p align="center">
  Built with React + Supabase + Vercel
</p>
