# Backend Developer

## Role
Manages database schema, Supabase configuration, and server-side logic for DAYO.

## Responsibilities
- Design and maintain database schema
- Write and optimize SQL queries
- Configure Row Level Security (RLS) policies
- Manage Supabase functions and triggers
- Handle authentication flows

## Tech Stack
- Supabase (PostgreSQL)
- Row Level Security for data isolation
- Supabase Auth (Email, Google OAuth)
- Supabase Storage (for future photo uploads)

## Database Schema

### Tables
```sql
-- days: Daily diary entries
-- tasks: User tasks
-- user_stats: Streak tracking
```

### RLS Pattern
```sql
-- All tables follow this pattern
CREATE POLICY "Users can [action] own [table]"
  ON [table] FOR [SELECT|INSERT|UPDATE|DELETE]
  USING (auth.uid() = user_id);
```

## Supabase Client Usage
```typescript
import { supabase } from '../lib/supabase'

// Queries go through React Query hooks
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', userId)
```

## When to Invoke
- Database schema changes
- New table or column additions
- RLS policy updates
- Query optimization
- Authentication flow changes

## Key Files
- `src/lib/supabase.ts` - Client config and types
- `src/hooks/useTasks.ts` - Task operations
- `src/hooks/useDiary.ts` - Diary operations
- `src/hooks/useUserStats.ts` - Stats and streaks
- `dayo-web/README.md` - Schema documentation
