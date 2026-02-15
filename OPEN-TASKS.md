# DAYO Open Tasks

**Last Updated:** February 15, 2026
**Status:** Core app complete, Push notifications deployed, 504 tests, CI on PRs, iOS readiness in progress

---

## iOS App Store Launch Checklist

### Phase 1: Complete Native Features

| # | Task | Status | Blocking |
|---|------|--------|----------|
| 23 | Push Notifications | ✅ Done | Needs device test |
| 25 | Offline Support | ❌ Open | Critical for UX |
| 27 | Biometric Lock | ❌ Open | Nice to have |

### Phase 2: App Store Requirements

| # | Task | Status | Notes |
|---|------|--------|-------|
| 28 | App Icons & Branding | ✅ Done | Icon updated |
| 29 | Privacy & Permissions | ✅ Done | Privacy manifest + policy page |
| 30 | Code Signing & Profiles | ⚠️ Partial | Device registered, Xcode issue |
| 31 | App Store Metadata | ✅ Done | See APP-STORE-METADATA.md |

### Phase 3: Testing & Submission

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 32 | TestFlight Beta | ❌ Open | 28, 29, 30 |
| 33 | App Store Submission | ❌ Open | 32 |

### Critical Path to App Store

```
Current ──▶ App Icon ──▶ Privacy Manifest ──▶ TestFlight ──▶ Submit
              ✅              ✅                  ❌            ❌
```

**Estimated remaining:** 3-4 major tasks (code signing, TestFlight, metadata, submit)

---

## Completed Tasks

| Task | Description | Date |
|------|-------------|------|
| Core App | Tasks, Diary, Calendar, Dashboard, Auth | Jan 3-17 |
| AI + Export | AI Assistant, Instagram Export, Streaks | Jan 18-19 |
| iOS Setup | Capacitor, Xcode project | Jan 29 |
| Kids Mode | Profile types, themes, content, onboarding | Jan 29 |
| Tests | 504 tests - unit, component, integration, E2E | Jan 29 |
| Haptic Feedback | @capacitor/haptics integration | Feb 3 |
| Camera Integration | Native camera, photo upload, gallery | Feb 3 |
| Diary Enhancements | Inline writing, sketching, export templates | Feb 4-5 |
| CI/CD | GitHub Actions, branch protection | Feb 5 |
| Swipe Navigation | Day-to-day swipe gestures | Feb 6 |
| AI Milestones | Word count milestones, celebrations | Feb 6 |
| AI Daily Insights | Mood-based insights after save | Feb 6 |
| Push Notifications | APNs, Edge Function, cron job | Feb 6 |
| App Icon Update | Design icon copied to Xcode assets | Feb 15 |
| Privacy Manifest | PrivacyInfo.xcprivacy for App Store | Feb 15 |
| Privacy Policy Page | /privacy route, settings link, landing footer | Feb 15 |
| RevenueCat Setup | SDK, hooks, subscription page, auth integration | Feb 15 |
| iOS UI Polish | Header overflow, goal icon, diary action buttons | Feb 15 |
| App Store Metadata | Description, keywords, screenshots plan, review notes | Feb 15 |

---

## Open Tasks - Prioritized

### HIGH Priority - iOS Launch Blockers

| # | Task | Description | Size | Status |
|---|------|-------------|------|--------|
| 28 | **App Icons & Branding** | 1024x1024 icon, splash screen, all sizes | M | ✅ Done |
| 29 | **Privacy & Permissions** | PrivacyInfo.xcprivacy, Info.plist, privacy policy | M | ✅ Done |
| 30 | **Code Signing** | Certificates, provisioning profiles (Xcode update needed) | M | ⚠️ Blocked |
| 31 | **App Store Metadata** | Screenshots, description, keywords | M | ✅ Done |
| 32 | **TestFlight Beta** | Archive, upload, beta test | M | ❌ |
| 33 | **App Store Submit** | Final review, submit | S | ❌ |

### HIGH Priority - Revenue

| # | Task | Description | Size | Status |
|---|------|-------------|------|--------|
| 38 | **Subscriptions & Payments** | RevenueCat integration, paywall, premium entitlements | L | ⏳ Infrastructure done |

**Note:** RevenueCat SDK installed and wired. Needs: RevenueCat project setup, App Store Connect products, real API key, premium feature gating.

### HIGH Priority - User Experience

| # | Task | Description | Size |
|---|------|-------------|------|
| 25 | **Offline Support** | Service worker, local cache, sync queue | L |
| 27 | **Biometric Lock** | Face ID / Touch ID for privacy | M |

### MEDIUM Priority - Product Growth

| # | Task | Description | Size |
|---|------|-------------|------|
| 21 | **Landing Page Improvements** | Better visuals, demos, social proof | L |
| 22c | **Voice-to-Text** | Record and transcribe diary entries | L |
| 22d | **Custom Templates** | User-created diary templates | M |
| 22e | **Daily Writing Goals** | Word count targets, progress bar | S |
| 22f | **Weekly Digest** | Auto-generated weekly summary | M |
| 22g | **Mood Correlations** | Mood vs activity patterns | M |
| 22h | **Diary Timeline** | Scrollable timeline view | M |
| 22i | **Guided Journaling** | Step-by-step prompts | M |

### MEDIUM Priority - Technical

| # | Task | Description | Size |
|---|------|-------------|------|
| 34 | **Error Tracking** | Sentry integration | S |
| 35 | **Analytics** | User behavior tracking | M |
| 36 | **Bundle Optimization** | Reduce JS bundle size | M |
| 37 | **HTML Sanitization** | Sanitize diary content (security) | S | ✅ Done |

### LOW Priority - Polish

| # | Task | Description | Size |
|---|------|-------------|------|
| 13 | Loading Skeletons | Shimmer loading states | S |
| 15 | Keyboard Shortcuts | Cmd+K, Cmd+D | S |
| 16 | Animations | Framer Motion transitions | M |
| 17 | Demo Data Seeder | Populate test data | S |
| 18 | Update README | Screenshots, docs | S |
| 20 | Direct Instagram API | Post directly to Instagram | L |

---

## Detailed Task Descriptions

### Task 25: Offline Support
**Priority:** HIGH
**Size:** L
**Why:** Users expect mobile apps to work offline

**Implementation:**
1. Install `@capacitor/preferences` for local storage
2. Cache today's tasks and diary in local storage
3. Queue mutations when offline
4. Sync when connection returns
5. Show offline indicator in UI
6. Add Vite PWA plugin for web

**Acceptance Criteria:**
- [ ] Can view today's tasks offline
- [ ] Can add/edit tasks offline
- [ ] Can write diary offline
- [ ] Changes sync when online
- [ ] Offline indicator visible

---

### Task 27: Biometric Lock
**Priority:** HIGH (nice for privacy)
**Size:** M

**Implementation:**
1. Use `@capacitor-community/biometric-auth`
2. Add "Lock with Face ID" toggle in Settings
3. Require biometric on app open when enabled
4. Fallback to device passcode
5. Add NSFaceIDUsageDescription to Info.plist

**Acceptance Criteria:**
- [ ] Face ID prompt on app open
- [ ] Settings toggle works
- [ ] Passcode fallback
- [ ] Graceful degradation on web

---

### Task 29: Privacy & Permissions
**Priority:** HIGH (required for App Store)
**Size:** M

**Implementation:**
1. Create `PrivacyInfo.xcprivacy` manifest
2. Update Info.plist:
   - NSCameraUsageDescription ✅ (already added)
   - NSPhotoLibraryUsageDescription ✅ (already added)
   - NSFaceIDUsageDescription (for Task 27)
   - NSUserTrackingUsageDescription (if analytics added)
3. Create privacy policy page (web URL)
4. Declare data collection in App Store Connect

**Files to create:**
- `ios/App/App/PrivacyInfo.xcprivacy`
- `src/pages/PrivacyPolicyPage.tsx` (or external URL)

---

### Task 31: App Store Metadata
**Priority:** HIGH
**Size:** M

**Required:**
- App name: DAYO
- Subtitle: Your Day. Your Story. Your Growth.
- Description (short + long)
- Keywords: diary, journal, mood, habits, goals, planner
- Category: Lifestyle / Productivity
- Age rating: 4+
- Price: Free

**Screenshots needed:**
- iPhone 6.7" (iPhone 15 Pro Max)
- iPhone 6.1" (iPhone 15)
- iPad Pro 12.9" (optional)

**Screens to capture:**
1. Today page with tasks
2. Diary entry with mood
3. Dashboard with streaks
4. Goals page
5. AI Assistant

---

### Task 34: Error Tracking (NEW)
**Priority:** MEDIUM
**Size:** S

**Implementation:**
1. Install Sentry SDK
2. Configure in main.tsx
3. Add error boundaries
4. Track unhandled exceptions
5. Source map upload in CI

---

### Task 37: HTML Sanitization (NEW)
**Priority:** MEDIUM (security)
**Size:** S

**Implementation:**
1. Install DOMPurify
2. Sanitize diary_text before save
3. Sanitize on render
4. Strip dangerous tags/attributes

---

## Recommended Order

### Before App Store Submit
1. ✅ Push Notifications (done)
2. ✅ App Icon (done)
3. ✅ Privacy Manifest (done)
4. ✅ Privacy Policy Page (done)
5. ✅ RevenueCat Infrastructure (done)
6. ❌ Xcode update + device test
7. ❌ Code Signing (Task 30)
8. ❌ TestFlight (Task 32)
9. ❌ App Store Metadata (Task 31)
10. ❌ Submit (Task 33)

### Post-Launch Phase 1
1. Offline Support (Task 25)
2. Biometric Lock (Task 27)
3. Error Tracking (Task 34)
4. HTML Sanitization (Task 37)

### Post-Launch Phase 2
1. Landing Page (Task 21)
2. Voice-to-Text (Task 22c)
3. Weekly Digest (Task 22f)
4. Analytics (Task 35)

---

## Blockers & Dependencies

| Blocker | Affects | Resolution |
|---------|---------|------------|
| Xcode 26.2 vs iOS 26.2.1 | Device testing, TestFlight | Update Xcode |
| App Icon design | Task 28, 31 | ✅ Resolved |
| Push notification test | Full validation | Needs device access |

---

## Quick Reference

**Total Open Tasks:** 18
**iOS Launch Critical:** 6 tasks
**Estimated to App Store:** 4-5 tasks remaining

**Priority Legend:**
- 🔴 HIGH - Blocking App Store
- 🟡 MEDIUM - Important for UX/growth
- 🟢 LOW - Nice to have

---

*Last updated: February 15, 2026*
