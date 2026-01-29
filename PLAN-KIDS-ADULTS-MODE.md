# Plan: Kids vs Adults Mode + Landing Page

> **Status**: IMPLEMENTED (Phases 1-7 Complete) - Tests Pending
> **Created**: January 29, 2026
> **Last Updated**: January 29, 2026

## Overview
Add profile type selection (Kids/Adults) with different UI themes, prompts, and a public landing page. Each phase is independently deployable without breaking production.

---

## Phase 1: Database Foundation
**Goal**: Add `profile_type` field, existing users default to 'adult'

**Database Migration**:
```sql
ALTER TABLE user_profiles
ADD COLUMN profile_type TEXT DEFAULT 'adult'
CHECK (profile_type IN ('adult', 'kid'));
```

**Files to Modify**:
- `src/lib/supabase.ts` - Add `profile_type: 'adult' | 'kid'` to types

**Safety**: Additive migration, all existing users continue working as 'adult'

---

## Phase 2: Profile Mode Context
**Goal**: React context to provide profile type app-wide

**New Files**:
- `src/contexts/ProfileModeContext.tsx` - Context provider
- `src/hooks/useProfileMode.ts` - Convenience hook

**Files to Modify**:
- `src/App.tsx` - Wrap app with `ProfileModeProvider`
- `src/pages/SettingsPage.tsx` - Add mode selector toggle

**Safety**: All additive, default remains 'adult'

---

## Phase 3: Theme System
**Goal**: Different visual styles for each mode

**Design Tokens**:
| Aspect | Adults | Kids |
|--------|--------|------|
| Colors | Calm purple/pink | Bright yellow/blue/green/pink |
| Radius | 0.5-1rem | 1.5-2rem (very rounded) |
| Animations | Subtle (150-300ms) | Bouncy, playful |
| Typography | System fonts | Rounded, playful |

**New Files**:
- `src/styles/kids-theme.css` - Kids-specific CSS

**Files to Modify**:
- `src/index.css` - Add `.kids-mode` CSS variables
- `tailwind.config.js` - Add `dayo-kids` color palette
- `src/App.tsx` - Apply `kids-mode` class based on profile

---

## Phase 4: Mode-Aware Content
**Goal**: Age-appropriate prompts, moods, and encouragements

**New Files**:
- `src/data/prompts.ts` - Diary prompts per mode
- `src/data/moods.ts` - Mood options (emojis vs animals)
- `src/data/encouragements.ts` - Toast messages per mode
- `src/hooks/useContentForMode.ts` - Hook to get mode content

**Content Examples**:
```typescript
// Adults
moods: ['✨ Amazing', '🥰 Happy', '😐 Okay', '😢 Sad', '😫 Stressed']
placeholder: "Dear diary, today..."

// Kids
moods: ['🦁 ROAR Amazing!', '🐶 Puppy Happy!', '🐢 Turtle Fine', '🐰 Bunny Sad', '🐻 Bear Tired']
placeholder: "Today was so cool because..."
```

**Files to Modify**:
- `src/components/diary/DiaryEntryModal.tsx` - Use mode-aware content

---

## Phase 5: Kids UI Components
**Goal**: Playful kid-friendly component variants

**New Files**:
- `src/components/kids/AnimalMoodPicker.tsx` - Large animal buttons
- `src/components/kids/StreakDisplay.tsx` - Animated celebrations
- `src/components/kids/TaskItem.tsx` - Larger touch targets, stickers

**Files to Modify**:
- `src/components/diary/DiaryEntryModal.tsx` - Conditional render kids/adult components
- `src/pages/TodayPage.tsx` - Mode-aware greetings

---

## Phase 6: Onboarding Flow
**Goal**: New users choose profile type during signup

**Database Migration**:
```sql
ALTER TABLE user_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
UPDATE user_profiles SET onboarding_completed = true; -- existing users
```

**New Files**:
- `src/pages/OnboardingPage.tsx` - Profile type selection screen
- `src/components/onboarding/ProfileTypeSelector.tsx` - Selection cards

**Files to Modify**:
- `src/App.tsx` - Add `/onboarding` route
- `src/pages/SignupPage.tsx` - Redirect to onboarding after signup

---

## Phase 7: Landing Page
**Goal**: Public page at "/" for marketing

**New Files**:
- `src/pages/LandingPage.tsx` - Hero, features, testimonials, CTAs
- `src/components/landing/ModePreview.tsx` - Interactive mode toggle
- `src/components/landing/FeatureCard.tsx` - Feature display
- `src/components/landing/TestimonialCarousel.tsx` - Social proof

**Files to Modify**:
- `src/App.tsx` - Route "/" to LandingPage for unauthenticated users

**Landing Page Structure**:
```
- Hero: "Your Day. Your Story. Your Growth."
- Mode comparison: Adults vs Kids cards
- Features: 2 min/day, Private, Smart prompts
- Testimonials: Parents + Adults
- CTAs: Download iOS, Use on Web
- Footer
```

---

## Phase 8: Polish
- Parental controls foundation (parent_email field)
- Documentation updates
- E2E testing both flows

---

## File Change Summary

| Phase | New Files | Modified Files |
|-------|-----------|----------------|
| 1 | - | supabase.ts |
| 2 | ProfileModeContext.tsx, useProfileMode.ts | App.tsx, SettingsPage.tsx |
| 3 | kids-theme.css | index.css, tailwind.config.js, App.tsx |
| 4 | prompts.ts, moods.ts, encouragements.ts, useContentForMode.ts | DiaryEntryModal.tsx |
| 5 | AnimalMoodPicker.tsx, StreakDisplay.tsx, TaskItem.tsx | DiaryEntryModal.tsx, TodayPage.tsx |
| 6 | OnboardingPage.tsx, ProfileTypeSelector.tsx | App.tsx, SignupPage.tsx |
| 7 | LandingPage.tsx, ModePreview.tsx, FeatureCard.tsx | App.tsx |

---

## Verification

After each phase:
1. `npm run build` - No TypeScript errors
2. `npm run test:run` - Existing tests pass
3. Deploy to Vercel preview
4. Manual test: existing users still work as adult mode
5. Manual test: new feature works as expected

---

## Rollback Strategy
Each phase is independently reversible:
- Database columns can remain unused
- Context removal falls back to 'adult'
- CSS classes unused without context
- Components fallback to adult variants

---

## Progress Tracking

- [x] Phase 1: Database Foundation ✅
- [x] Phase 2: Profile Mode Context ✅
- [x] Phase 3: Theme System ✅
- [x] Phase 4: Mode-Aware Content ✅
- [x] Phase 5: Kids UI Components ✅
- [x] Phase 6: Onboarding Flow ✅
- [x] Phase 7: Landing Page ✅
- [ ] Phase 8: Polish (Tests, Docs, Parental controls)

---

## Implementation Notes (January 29, 2026)

### Files Created (17 new files)
```
src/contexts/ProfileModeContext.tsx
src/hooks/useProfileMode.ts
src/hooks/useContentForMode.ts
src/styles/kids-theme.css
src/data/moods.ts
src/data/prompts.ts
src/data/encouragements.ts
src/components/kids/AnimalMoodPicker.tsx
src/components/kids/StreakDisplay.tsx
src/components/kids/TaskItem.tsx
src/components/onboarding/ProfileTypeSelector.tsx
src/pages/OnboardingPage.tsx
src/pages/LandingPage.tsx
src/components/landing/FeatureCard.tsx
src/components/landing/ModePreview.tsx
```

### Files Modified (8 files)
```
src/lib/supabase.ts - Added profile_type, onboarding_completed
src/App.tsx - ProfileModeProvider, OnboardingGuard, routes
src/index.css - Kids theme import
tailwind.config.js - Kids colors, gradients, animations
src/pages/SettingsPage.tsx - Profile mode selector
src/pages/SignupPage.tsx - Redirect to onboarding
src/pages/TodayPage.tsx - Mode-aware greetings/styling
src/components/diary/DiaryEntryModal.tsx - Mode-aware content
```

### Pending: Test Coverage
New features need dedicated tests:
- Unit tests for data files and hooks
- Component tests for kids UI components
- Integration tests for OnboardingPage and LandingPage
