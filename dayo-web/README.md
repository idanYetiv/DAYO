# DAYO Web App

**Your Day. Your Story. Your Growth.**

A modern life companion app built with React, TypeScript, Vite, and Supabase.

## Features (POC Phase)

- ✅ Authentication (Email/Password + Google OAuth)
- ✅ Today's view with task management
- ✅ Daily diary/reflection
- ✅ Mood tracking
- ✅ Dashboard with stats
- 🚧 Calendar view (coming soon)
- 🚧 AI Assistant (coming soon)
- 🚧 Goals & Habits (coming soon)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Routing**: React Router v6
- **Date Utils**: date-fns

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works fine)
- (Optional) OpenAI API key for AI features

## Setup Instructions

### 1. Clone and Install

```bash
cd dayo-web
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (~2 minutes)
3. Go to **Project Settings > API** and copy:
   - Project URL
   - Anon/Public Key

### 3. Create Database Tables

Run this SQL in the Supabase SQL Editor (**SQL Editor** in sidebar):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Days table
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood TEXT,
  diary_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User stats table
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Days policies
CREATE POLICY "Users can view their own days" ON days
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own days" ON days
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own days" ON days
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own days" ON days
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_days_updated_at BEFORE UPDATE ON days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Configure Google OAuth (Optional)

1. In Supabase, go to **Authentication > Providers**
2. Enable **Google** provider
3. Follow the instructions to set up OAuth with Google Console
4. Add your redirect URL: `https://<your-project>.supabase.co/auth/v1/callback`

### 5. Create Environment File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional - for AI features
VITE_OPENAI_API_KEY=your-openai-key
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
dayo-web/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── diary/         # Diary-related components
│   │   ├── planner/       # Task/planner components
│   │   └── ui/            # Base UI components (Shadcn)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── TodayPage.tsx
│   │   └── DashboardPage.tsx
│   ├── store/             # Zustand state stores
│   │   └── authStore.ts   # Authentication state
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (git-ignored)
├── .env.example           # Example environment file
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Next Steps (Post-POC)

1. **Calendar View**: Full month/week calendar with past entries
2. **AI Assistant**: GPT-powered chat for planning & reflection
3. **Goals & Habits**: Track long-term goals with milestones
4. **Media Upload**: Photos, videos, voice recordings
5. **Gamification**: Streaks, badges, achievements
6. **Social Sharing**: Export daily summaries as cards
7. **Subscription**: Stripe integration for premium features
8. **Mobile Apps**: React Native for iOS/Android

## Development Notes

- **Authentication**: Uses Supabase Auth with email and Google OAuth
- **Database**: PostgreSQL with Row Level Security (RLS) enabled
- **Styling**: Tailwind CSS with dark mode support
- **Type Safety**: Full TypeScript support with strict mode
- **State**: Zustand for global state, React Query for server state

## Troubleshooting

### "Missing Supabase environment variables"
Make sure you created `.env` file with correct Supabase credentials.

### Google OAuth not working
1. Check OAuth is enabled in Supabase
2. Verify Google Console credentials are correct
3. Make sure redirect URLs match

### Database errors
1. Verify tables are created (check SQL Editor)
2. Ensure RLS policies are in place
3. Check user is authenticated

## Contributing

This is a personal project, but suggestions are welcome!

## License

MIT

---

Built with ❤️ for better days ahead.
