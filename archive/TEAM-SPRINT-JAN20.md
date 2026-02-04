# DAYO Team Sprint - January 20, 2026

## Sprint Goals
Two parallel workstreams:
1. **Diary Actions** - Photo upload, Gratitude, Highlights features
2. **E2E Auth Fixtures** - Enable authenticated tests

---

## Workstream 1: Diary Actions Feature

### Current State
The `DiaryEntryModal.tsx` has placeholder buttons for:
- "Add photo" - UI exists, no functionality
- "Gratitude" - UI exists, no functionality
- "Highlights" - UI exists, no functionality

### Feature Specifications

#### 1.1 Photo Upload
**Assigned to:** Backend Developer + Frontend Developer

**Database Changes:**
```sql
-- Add photos column to days table
ALTER TABLE days ADD COLUMN photos TEXT[] DEFAULT '{}';
```

**Supabase Storage:**
- Create bucket: `diary-photos`
- RLS: Users can only access their own photos
- Max file size: 5MB
- Allowed types: jpg, jpeg, png, webp, heic

**Files to Create:**
- `src/hooks/usePhotoUpload.ts`
- `src/components/diary/PhotoGallery.tsx`
- `src/components/diary/PhotoPicker.tsx`

**Acceptance Criteria:**
- [ ] User can add up to 5 photos per diary entry
- [ ] Photos are compressed before upload
- [ ] Thumbnail preview in diary modal
- [ ] Delete photo functionality
- [ ] Photos appear in Instagram export

---

#### 1.2 Gratitude Section
**Assigned to:** Frontend Developer + UX Designer

**Database Changes:**
```sql
-- Add gratitude column to days table
ALTER TABLE days ADD COLUMN gratitude TEXT[] DEFAULT '{}';
```

**UI Design:**
- Button opens inline gratitude section (not separate modal)
- 3 gratitude input fields with placeholder "I'm grateful for..."
- Soft animation when adding items
- Display as styled list in diary view

**Files to Modify:**
- `src/components/diary/DiaryEntryModal.tsx`
- `src/hooks/useDiary.ts`
- `src/lib/supabase.ts` (types)

**Acceptance Criteria:**
- [ ] User can add 1-3 gratitude items
- [ ] Gratitude items persist to database
- [ ] Displayed in diary history
- [ ] Optional: Include in Instagram export

---

#### 1.3 Highlights Section
**Assigned to:** Frontend Developer + UX Designer

**Database Changes:**
```sql
-- Add highlights column to days table
ALTER TABLE days ADD COLUMN highlights TEXT[] DEFAULT '{}';
```

**UI Design:**
- Button opens inline highlights section
- Up to 5 highlight items with emoji picker
- Quick-add common highlights (workout, meal, meeting, etc.)
- Display as timeline/chips in diary view

**Files to Modify:**
- `src/components/diary/DiaryEntryModal.tsx`
- `src/hooks/useDiary.ts`
- `src/lib/supabase.ts` (types)

**Acceptance Criteria:**
- [ ] User can add highlights with optional emoji
- [ ] Highlights persist to database
- [ ] Displayed in diary history
- [ ] Optional: Include in Instagram export

---

## Workstream 2: E2E Auth Fixtures

### Current State
- 30 E2E tests are skipped because they need authenticated sessions
- Tests check for `/login` redirect and skip if not authenticated

### Implementation Plan
**Assigned to:** QA Engineer + Backend Developer

**Files to Create:**
- `e2e/auth.setup.ts` - Global auth setup
- `e2e/fixtures.ts` - Authenticated test fixtures

**Files to Modify:**
- `playwright.config.ts` - Add auth project
- `.env.test` - Test user credentials

**Implementation:**

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('Email').fill(process.env.TEST_USER_EMAIL!)
  await page.getByPlaceholder('Password').fill(process.env.TEST_USER_PASSWORD!)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL('/today')
  await page.context().storageState({ path: authFile })
})
```

```typescript
// playwright.config.ts additions
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
    },
    dependencies: ['setup'],
  },
]
```

**Test User Setup:**
1. Create dedicated test user in Supabase: `test@dayo.app`
2. Store credentials in `.env.test` (gitignored)
3. Add to Vercel/CI environment variables

**Acceptance Criteria:**
- [ ] Auth setup runs before all tests
- [ ] Authenticated state is reused across tests
- [ ] All 30 skipped tests are unskipped and passing
- [ ] CI/CD pipeline works with test credentials

---

## Database Migration Plan

Single migration file for all diary enhancements:

```sql
-- supabase/migrations/20260120_diary_enhancements.sql

-- Add photos array
ALTER TABLE days ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- Add gratitude array (max 3 items)
ALTER TABLE days ADD COLUMN IF NOT EXISTS gratitude TEXT[] DEFAULT '{}';

-- Add highlights array (max 5 items)
ALTER TABLE days ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('diary-photos', 'diary-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'diary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'diary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'diary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Task Assignments Summary

| Task | Primary | Support | Priority |
|------|---------|---------|----------|
| Photo Upload Backend | Backend Dev | DevOps | High |
| Photo Upload Frontend | Frontend Dev | UX Designer | High |
| Gratitude Feature | Frontend Dev | UX Designer | Medium |
| Highlights Feature | Frontend Dev | UX Designer | Medium |
| E2E Auth Fixtures | QA Engineer | Backend Dev | High |
| Database Migration | Backend Dev | Tech Lead | High |

---

## Definition of Done

- [ ] All code reviewed and merged
- [ ] Unit tests for new hooks
- [ ] E2E tests for new features
- [ ] TypeScript types updated
- [ ] No build errors
- [ ] Deployed to production
- [ ] OPEN-TASKS.md updated

---

## Timeline

| Phase | Tasks | Target |
|-------|-------|--------|
| 1 | Database migration + E2E fixtures | Today |
| 2 | Photo upload (backend + frontend) | Today |
| 3 | Gratitude + Highlights features | Today |
| 4 | Testing + Polish | Today |

---

*Sprint created: January 20, 2026*
