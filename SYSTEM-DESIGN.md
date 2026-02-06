# DAYO System Design Document

> Complete technical architecture, scalability analysis, and security review.

**Last Updated:** February 6, 2026
**Version:** 1.0

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Database Design](#2-database-design)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Services](#4-backend-services)
5. [State Management](#5-state-management)
6. [Scalability](#6-scalability)
7. [Reliability](#7-reliability)
8. [Security](#8-security)
9. [Performance](#9-performance)
10. [Monitoring & Observability](#10-monitoring--observability)
11. [Design Review & Recommendations](#11-design-review--recommendations)

---

## 1. System Overview

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │   Web App   │    │  iOS App    │    │ (Future)    │                  │
│  │   (React)   │    │ (Capacitor) │    │  Android    │                  │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘                  │
│         │                  │                                             │
│         └────────┬─────────┘                                             │
│                  ▼                                                       │
│         ┌───────────────┐                                                │
│         │    Vercel     │  ◄── Static hosting + CDN                      │
│         │   (Frontend)  │                                                │
│         └───────┬───────┘                                                │
└─────────────────┼───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │   Auth Service  │    │  PostgreSQL DB  │    │  Storage        │      │
│  │   (GoTrue)      │    │  (RLS enabled)  │    │  (S3-compat)    │      │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘      │
│           │                      │                      │                │
│           └──────────────────────┼──────────────────────┘                │
│                                  │                                       │
│  ┌─────────────────┐    ┌────────┴────────┐                              │
│  │ Edge Functions  │    │   Realtime      │                              │
│  │ (Deno runtime)  │    │   (WebSocket)   │                              │
│  └─────────────────┘    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │   OpenAI API    │    │   Apple APNs    │    │  GitHub Actions │      │
│  │   (GPT-4o-mini) │    │   (Push Notif)  │    │  (Cron jobs)    │      │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 + TypeScript | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Build | Vite 7 | Fast bundler |
| Routing | React Router 7 | Client-side routing |
| Server State | React Query 5 | Data fetching/caching |
| Client State | Zustand | Auth state |
| Backend | Supabase | BaaS (Auth, DB, Storage) |
| Database | PostgreSQL 15 | Relational database |
| Serverless | Deno Edge Functions | Backend logic |
| Hosting | Vercel | CDN + static hosting |
| iOS | Capacitor 8 | Native wrapper |
| AI | OpenAI GPT-4o-mini | Chat assistant |
| Push | Apple APNs | iOS notifications |
| CI/CD | GitHub Actions | Tests + cron |

---

## 2. Database Design

### 2.1 Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │  (Supabase managed)
│─────────────────│
│ id (UUID) PK    │
│ email           │
│ created_at      │
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐       ┌─────────────────┐
│  user_profiles  │       │   user_stats    │
│─────────────────│       │─────────────────│
│ user_id PK/FK   │       │ user_id PK/FK   │
│ display_name    │       │ current_streak  │
│ profile_type    │       │ longest_streak  │
│ dark_mode       │       │ last_active     │
│ theme_color     │       │ total_entries   │
│ notifications   │       │ total_words     │
│ reminder_time   │       │ milestones[]    │
└─────────────────┘       └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      days       │       │     tasks       │       │ device_tokens   │
│─────────────────│       │─────────────────│       │─────────────────│
│ id PK           │       │ id PK           │       │ id PK           │
│ user_id FK      │       │ user_id FK      │       │ user_id FK      │
│ date            │       │ date            │       │ token (unique)  │
│ mood            │       │ title           │       │ platform        │
│ diary_text      │       │ completed       │       │ device_name     │
│ photos[]        │       └─────────────────┘       └─────────────────┘
│ gratitude[]     │
│ highlights[]    │
│ tags[]          │
│ sketch_url      │
│ bookmarked      │
└─────────────────┘
         │
         │ user_id
         ▼
┌─────────────────┐       ┌─────────────────┐
│     goals       │──────▶│   milestones    │
│─────────────────│  1:N  │─────────────────│
│ id PK           │       │ id PK           │
│ user_id FK      │       │ goal_id FK      │
│ title           │       │ user_id FK      │
│ category        │       │ title           │
│ due_date        │       │ completed       │
└─────────────────┘       └─────────────────┘
         │
         │ user_id
         ▼
┌─────────────────┐       ┌─────────────────┐
│     habits      │──────▶│habit_completions│
│─────────────────│  1:N  │─────────────────│
│ id PK           │       │ id PK           │
│ user_id FK      │       │ habit_id FK     │
│ title           │       │ user_id FK      │
│ frequency       │       │ date            │
│ target/week     │       │ (unique: habit  │
│ archived        │       │  + date)        │
└─────────────────┘       └─────────────────┘
```

### 2.2 Table Definitions

#### Core Tables

| Table | Rows Est. | Growth Rate | Indexes |
|-------|-----------|-------------|---------|
| user_profiles | 1 per user | Slow | PK only |
| user_stats | 1 per user | Slow | PK only |
| days | 365/user/year | Linear | user_id, date, bookmarked |
| tasks | ~5/day/user | Linear | user_id, date |
| goals | ~10/user | Slow | user_id, category |
| milestones | ~50/user | Slow | goal_id, user_id |
| habits | ~10/user | Slow | user_id, archived |
| habit_completions | ~10/day/user | Linear | habit_id, date, (habit_id, date) |
| device_tokens | 1-3/user | Slow | user_id, token (unique) |

#### Column Details

**days** (most complex table):
```sql
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT,
  diary_text TEXT,                    -- HTML content, can be large
  photos TEXT[],                      -- Array of storage URLs
  gratitude TEXT[],                   -- Max 3 items
  highlights JSONB,                   -- [{emoji, text}], max 5
  tags TEXT[],                        -- Custom tags
  bookmarked BOOLEAN DEFAULT false,
  template_id TEXT,
  sketch_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)               -- One entry per day per user
);

-- Performance indexes
CREATE INDEX idx_days_user_date ON days(user_id, date);
CREATE INDEX idx_days_bookmarked ON days(user_id, bookmarked) WHERE bookmarked = true;
CREATE INDEX idx_days_tags ON days USING GIN(tags);
CREATE INDEX idx_days_photos ON days USING GIN(photos);
```

### 2.3 Row Level Security (RLS)

All tables have RLS enabled with user isolation:

```sql
-- Example: days table policies
ALTER TABLE days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own days"
  ON days FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own days"
  ON days FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own days"
  ON days FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own days"
  ON days FOR DELETE
  USING (auth.uid() = user_id);
```

### 2.4 Storage Buckets

| Bucket | Purpose | Size Limit | Access |
|--------|---------|------------|--------|
| diary-photos | Diary images | 5MB/file | Private (user-owned) |
| diary-sketches | Hand drawings | 2MB/file | Public read, private write |

Storage policies enforce user-folder isolation:
```sql
-- Upload only to own folder
CREATE POLICY "Users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diary-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
```

---

## 3. Frontend Architecture

### 3.1 Page Structure

```
src/
├── pages/                    # Route components
│   ├── LandingPage.tsx       # Public marketing
│   ├── LoginPage.tsx         # Auth
│   ├── SignupPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── OnboardingPage.tsx    # Profile setup
│   ├── TodayPage.tsx         # Main daily view
│   ├── DashboardPage.tsx     # Stats overview
│   ├── DiaryPage.tsx         # Calendar + entries
│   ├── GoalsPage.tsx         # Goal management
│   ├── HabitsPage.tsx        # Habit tracking
│   ├── CalendarPage.tsx      # Month view
│   ├── AIAssistantPage.tsx   # Chat interface
│   └── SettingsPage.tsx      # User preferences
├── components/
│   ├── ui/                   # Generic UI components
│   ├── diary/                # Diary-specific (15+ components)
│   ├── planner/              # Task management
│   ├── ai/                   # Chat components
│   ├── export/               # Export templates
│   ├── kids/                 # Kids mode UI
│   ├── landing/              # Marketing sections
│   └── onboarding/           # Setup flow
├── hooks/                    # 27 custom hooks
├── contexts/                 # React contexts
├── store/                    # Zustand stores
├── lib/                      # Utilities & services
├── data/                     # Static data (moods, prompts)
└── styles/                   # CSS files
```

### 3.2 Component Hierarchy

```
App
├── AuthProvider (Zustand)
├── ProfileModeProvider (Context)
├── QueryClientProvider (React Query)
└── Router
    ├── PublicRoutes
    │   ├── LandingPage
    │   ├── LoginPage
    │   └── SignupPage
    └── ProtectedRoutes (requires auth)
        ├── OnboardingPage (if not onboarded)
        └── MainLayout
            ├── BottomNavigation
            └── PageContent
                ├── TodayPage
                │   ├── DiaryPreviewCard
                │   │   └── DiaryEditor
                │   ├── TasksSection
                │   ├── HabitsSection
                │   └── MilestoneCelebration
                ├── DiaryPage
                │   ├── Calendar
                │   ├── DiaryEntryModal
                │   │   ├── DiaryEditor
                │   │   ├── SketchCanvas
                │   │   └── PhotoUploader
                │   └── DiarySearchPanel
                └── ...
```

### 3.3 Data Flow

```
User Action
    │
    ▼
Component (React)
    │
    ├──▶ Local State (useState)
    │         │
    │         ▼
    │    UI Update (immediate)
    │
    └──▶ Mutation (React Query)
              │
              ├──▶ Optimistic Update
              │         │
              │         ▼
              │    Cache Update (instant UI)
              │
              └──▶ API Call (Supabase)
                        │
                        ▼
                   Database (PostgreSQL)
                        │
                        ▼
                   Response
                        │
              ┌─────────┴─────────┐
              │                   │
           Success             Error
              │                   │
              ▼                   ▼
         Cache Invalidate    Rollback Optimistic
              │
              ▼
         UI Refresh
```

---

## 4. Backend Services

### 4.1 Supabase Services

| Service | Purpose | Scaling |
|---------|---------|---------|
| Auth (GoTrue) | User authentication | Managed, auto-scales |
| PostgreSQL | Data storage | Managed, vertical scaling |
| Storage | File storage (S3) | Managed, unlimited |
| Realtime | WebSocket subscriptions | Managed, auto-scales |
| Edge Functions | Serverless compute | Managed, auto-scales |

### 4.2 Edge Functions

**send-daily-reminders** (Primary backend function)

```typescript
// Trigger: External cron (GitHub Actions) - hourly
// Purpose: Send push notifications to users

Flow:
1. Verify CRON_SECRET header
2. Get current UTC hour
3. Query users with reminders at this hour
4. Generate APNs JWT (ES256 signing)
5. For each user:
   a. Get device tokens
   b. Generate mode-specific message
   c. Send via APNs HTTP/2
6. Return stats { sent, errors, usersChecked }
```

### 4.3 External Integrations

**OpenAI API**
- Model: gpt-4o-mini
- Use cases: Chat, summaries, writing prompts, celebrations
- Rate limits: Per-user throttling recommended
- Fallback: Mock mode for development/offline

**Apple Push Notification Service (APNs)**
- Auth: JWT (ES256) with Team ID + Key ID
- Environment: Sandbox (development) / Production (App Store)
- Payload: Standard alert with badge

**GitHub Actions**
- Workflow: `daily-reminders.yml`
- Schedule: Every hour (`0 * * * *`)
- Purpose: Trigger edge function for notifications

---

## 5. State Management

### 5.1 State Categories

| Category | Technology | Data |
|----------|------------|------|
| Server State | React Query | DB data (days, tasks, etc.) |
| Auth State | Zustand | User session, loading |
| UI State | React useState | Modals, forms, local UI |
| Profile Mode | React Context | adult/kid mode |

### 5.2 React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      cacheTime: 1000 * 60 * 30,     // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

### 5.3 Query Key Structure

```typescript
// Hierarchical keys for cache management
['dayEntry', date]
['tasks', date]
['goals', category?]
['habits', includeArchived?]
['userProfile']
['userStats', userId]
['diaryInsights', period]
```

---

## 6. Scalability

### 6.1 Current Capacity

| Component | Current Limit | Notes |
|-----------|---------------|-------|
| Database | 500MB (Free) / 8GB (Pro) | Supabase tier dependent |
| Storage | 1GB (Free) / 100GB (Pro) | Photo/sketch storage |
| Edge Functions | 500K/month (Free) | Invocations |
| API Requests | 50K/day (Free) | Database queries |

### 6.2 Scaling Strategy

**Horizontal Scaling (Handled by Supabase):**
- Database: Read replicas for heavy read loads
- Edge Functions: Auto-scaling containers
- Storage: CDN-backed, globally distributed

**Vertical Scaling:**
- Database: Upgrade Supabase tier for more resources
- Pro tier: Dedicated compute, more connections

### 6.3 Bottleneck Analysis

| Potential Bottleneck | Risk | Mitigation |
|---------------------|------|------------|
| Database connections | Medium | Connection pooling (PgBouncer) |
| Large diary entries | Low | Text compression, pagination |
| Photo storage | Medium | Image compression before upload |
| Push notifications | Low | Batch sending, queue system |
| AI API calls | Medium | Caching, rate limiting, mock mode |

### 6.4 Future Scaling Considerations

1. **Read Replicas**: For dashboard/analytics queries
2. **Caching Layer**: Redis for frequently accessed data
3. **CDN for Assets**: Already via Vercel + Supabase Storage
4. **Database Sharding**: Not needed until millions of users
5. **Queue System**: For push notifications at scale

---

## 7. Reliability

### 7.1 Current Reliability Measures

| Measure | Implementation | Status |
|---------|----------------|--------|
| Database backups | Supabase automatic | ✅ Daily |
| RLS enforcement | All tables | ✅ Enabled |
| Optimistic updates | React Query | ✅ Implemented |
| Error boundaries | React | ⚠️ Partial |
| Retry logic | React Query | ✅ 1 retry |
| Offline support | - | ❌ Not implemented |

### 7.2 Failure Scenarios

| Scenario | Current Behavior | Recommendation |
|----------|-----------------|----------------|
| Database down | App shows error | Show cached data |
| API timeout | Retry once | Implement offline queue |
| Auth token expired | Redirect to login | Silent refresh |
| Storage upload fails | Error toast | Retry with exponential backoff |
| Push notification fails | Silent failure | Log + retry |

### 7.3 Disaster Recovery

**Current:**
- Supabase provides automatic daily backups
- Point-in-time recovery available on Pro tier

**Recommended:**
- Weekly export of critical data
- Multi-region deployment for critical apps
- Runbook for incident response

---

## 8. Security

### 8.1 Authentication

| Feature | Implementation | Status |
|---------|----------------|--------|
| Email/Password | Supabase Auth | ✅ |
| Session management | JWT tokens | ✅ |
| Password reset | Email flow | ✅ |
| Session timeout | Configurable | ✅ |
| OAuth providers | - | ❌ Not implemented |
| MFA | - | ❌ Not implemented |
| Biometric lock | Planned | ⏳ Task #27 |

### 8.2 Authorization

| Control | Implementation |
|---------|----------------|
| Row Level Security | All tables protected |
| User isolation | RLS policies enforce user_id matching |
| Storage policies | Folder-based user isolation |
| API keys | Anon key (public) + Service role (server only) |

### 8.3 Data Protection

| Measure | Status |
|---------|--------|
| HTTPS | ✅ Enforced |
| Data at rest encryption | ✅ Supabase default |
| Data in transit encryption | ✅ TLS 1.3 |
| PII handling | ⚠️ Diary content is sensitive |
| GDPR compliance | ✅ Data export + delete available |

### 8.4 Security Risks & Mitigations

| Risk | Severity | Current Status | Mitigation |
|------|----------|----------------|------------|
| SQL Injection | High | ✅ Mitigated | Parameterized queries via Supabase client |
| XSS | Medium | ⚠️ Partial | Sanitize diary HTML input |
| CSRF | Low | ✅ Mitigated | SameSite cookies, token-based auth |
| Insecure storage | Medium | ✅ Mitigated | Supabase Storage with policies |
| API key exposure | High | ⚠️ Risk | Anon key in client (by design) |
| Session hijacking | Medium | ✅ Mitigated | Secure, HttpOnly cookies |

### 8.5 Security Recommendations

1. **Add rate limiting** to API endpoints
2. **Implement MFA** for sensitive accounts
3. **Audit logging** for security events
4. **Content Security Policy** headers
5. **Sanitize HTML** in diary entries (prevent XSS)
6. **Regular security audits**

---

## 9. Performance

### 9.1 Current Performance

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Time to Interactive | < 3s | ~2.5s |
| Bundle size | < 500KB | ~980KB ⚠️ |
| API response time | < 200ms | ~150ms |

### 9.2 Bundle Analysis

```
dist/
├── index.html                    0.72 KB
├── index-*.css                  70.98 KB
├── web-*.js                      0.90 KB  (Capacitor)
├── DiaryEditor-*.js            451.73 KB  ⚠️ Large
└── index-*.js                  980.76 KB  ⚠️ Large
```

### 9.3 Performance Optimizations

**Implemented:**
- Code splitting (DiaryEditor lazy loaded)
- React Query caching
- Debounced auto-save
- Optimistic updates

**Recommended:**
- Further code splitting (per-page bundles)
- Image lazy loading
- Virtual scrolling for long lists
- Service worker caching

---

## 10. Monitoring & Observability

### 10.1 Current Monitoring

| Area | Tool | Status |
|------|------|--------|
| Error tracking | - | ❌ Not implemented |
| Performance monitoring | - | ❌ Not implemented |
| Logs | Supabase dashboard | ✅ Basic |
| Uptime | - | ❌ Not implemented |
| Analytics | - | ❌ Not implemented |

### 10.2 Recommended Monitoring Stack

1. **Error Tracking**: Sentry
2. **Performance**: Vercel Analytics
3. **User Analytics**: Mixpanel or Amplitude
4. **Uptime**: Supabase built-in or UptimeRobot
5. **Logs**: Supabase + structured logging

---

## 11. Design Review & Recommendations

### 11.1 Architecture Strengths

| Strength | Description |
|----------|-------------|
| ✅ Simple stack | React + Supabase - easy to maintain |
| ✅ Type safety | Full TypeScript coverage |
| ✅ RLS security | Database-level access control |
| ✅ Modern patterns | React Query, Zustand, hooks |
| ✅ Scalable foundation | Supabase handles infrastructure |
| ✅ Mobile-ready | Capacitor for iOS |

### 11.2 Architecture Weaknesses

| Weakness | Risk | Recommendation |
|----------|------|----------------|
| No offline support | High | Implement service worker + local storage |
| Large bundle size | Medium | Code split, tree shake, lazy load |
| No error tracking | Medium | Add Sentry |
| Single region | Low | Multi-region for global users |
| No caching layer | Low | Add Redis if needed |
| No rate limiting | Medium | Implement on Edge Functions |

### 11.3 Technical Debt

| Item | Priority | Effort |
|------|----------|--------|
| Add comprehensive error handling | High | M |
| Reduce bundle size | Medium | M |
| Add offline support | High | L |
| Implement proper logging | Medium | S |
| Add E2E test coverage | Medium | L |
| Sanitize diary HTML content | High | S |

### 11.4 Recommended Next Steps

**Immediate (Before App Store):**
1. Add HTML sanitization for diary content
2. Implement error boundaries
3. Add basic analytics
4. Complete iOS native features

**Short-term (Post-launch):**
1. Add offline support
2. Implement error tracking (Sentry)
3. Reduce bundle size
4. Add rate limiting

**Medium-term:**
1. Add MFA option
2. Implement caching layer
3. Add comprehensive monitoring
4. Consider read replicas

---

## Appendix A: Environment Variables

```bash
# Required
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Optional
VITE_OPENAI_API_KEY=sk-...
VITE_AI_MOCK_MODE=true

# Edge Functions (Supabase Secrets)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
APNS_KEY_ID=XXXXXXXXXX
APNS_TEAM_ID=XXXXXXXXXX
APNS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
APNS_PRODUCTION=false
CRON_SECRET=xxx

# GitHub Actions Secrets
SUPABASE_EDGE_FUNCTION_URL=https://xxx.supabase.co/functions/v1
CRON_SECRET=xxx
```

## Appendix B: API Reference

See Supabase auto-generated API documentation at:
`https://srhxwubcfcuvgmrqyabf.supabase.co/rest/v1/`

---

*Document generated: February 6, 2026*
