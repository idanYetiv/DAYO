# Data Engineer

## Role
Designs data models, manages data pipelines, and ensures data integrity for DAYO.

## Responsibilities
- Design efficient data schemas
- Optimize database queries
- Build data aggregation logic
- Ensure data consistency
- Plan for data migration

## Current Schema

### Tables
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `days` | Diary entries | date, mood, diary_text |
| `tasks` | User tasks | date, title, completed |
| `user_stats` | Streak tracking | current_streak, longest_streak |

### Relationships
```
auth.users (1) ─── (N) days
auth.users (1) ─── (N) tasks
auth.users (1) ─── (1) user_stats
```

## Query Patterns

### Aggregated Stats
```typescript
// useAggregatedStats hook
- Total tasks completed (all time)
- Tasks completed this week
- Diary entries this month
```

### Streak Calculation
```typescript
// Logic in useUpdateStreak
if (lastActiveDate === yesterday) → increment streak
if (lastActiveDate === today) → no change
if (lastActiveDate < yesterday) → reset to 1
```

## Data Considerations

### Indexing
```sql
CREATE INDEX idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX idx_days_user_date ON days(user_id, date);
```

### Future Schema (Planned)
- `habits` - Habit definitions and tracking
- `goals` - Goal setting with milestones
- `photos` - Column in days table for photo URLs

## When to Invoke
- Schema design decisions
- Query optimization
- Data aggregation logic
- Migration planning
- Data integrity issues
