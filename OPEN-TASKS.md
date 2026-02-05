# DAYO Open Tasks

**Last Updated:** February 5, 2026
**Status:** Core app complete, Kids/Adults mode shipped, Diary Export shipped, Sketch feature shipped, 409 tests, CI on PRs, deployed to production

---

## Completed Tasks

| Task | Description | Date |
|------|-------------|------|
| Task 0 | Initial setup (Vite, React, TS, Tailwind, routing) | Jan 3 |
| Task 1 | Supabase setup & database migration | Jan 3 |
| Task 2-4 | Database hooks (Tasks, Diary, UserStats) | Jan 3 |
| Task 5-8 | TodayPage, Dashboard, Calendar with real data | Jan 17 |
| Task 11-12 | Streak system, Toast notifications | Jan 17 |
| Task 19 | Instagram Export (3 templates, 3 styles, 2 formats) | Jan 18 |
| Task 9-10 | AI Integration + Chat UI | Jan 19 |
| iOS | Capacitor setup for App Store | Jan 29 |
| Kids Mode | All 8 phases - profile, theme, content, components, onboarding, landing | Jan 29 |
| Tests | 262 tests - unit, component, integration | Jan 29 |
| Fixes | Dark mode, custom backgrounds, habits nav | Jan 29 |
| Task 26 | Haptic Feedback - native iOS haptics via @capacitor/haptics | Feb 3 |
| Task 24 | Camera Integration - native camera, photo upload, gallery UI, iOS permissions | Feb 3 |
| Task 22a | DiaryPreviewCard inline writing - textarea, auto-save on blur, arrow to modal | Feb 4 |
| Task 22b | Diary Entry Export - 3 templates (Journal, Gratitude, Highlights), share from modal & preview card | Feb 4 |
| Task 22j | Sketch/Drawing in Diary - inline canvas in editor toolbar, pen/eraser, colors, brush sizes, auto-save | Feb 5 |

---

## Open Tasks - Full Backlog

### HIGH Priority - Product Growth

| # | Task | Description | Size |
|---|------|-------------|------|
| 21 | **Improve Landing Page** | Better visuals, animated demos, social proof, trust elements | L |
| 22 | **Diary Capabilities** | Rich text, templates, mood insights, search, summaries (inline writing ✅) | XL |

### HIGH Priority - App Store Preparation (Native Features)

| # | Task | Description | Size | Blocks |
|---|------|-------------|------|--------|
| 23 | **Push Notifications** | Daily reminders via Capacitor Push + Supabase Edge Functions | L | App Store |
| ~~24~~ | ~~**Camera Integration**~~ | ~~Photo capture for diary entries via Capacitor Camera plugin~~ | ~~M~~ | ✅ Done |
| 25 | **Offline Support** | Service worker + local storage cache for offline diary/tasks | L | App Store |
| ~~26~~ | ~~**Haptic Feedback**~~ | ~~Native haptics on task complete, mood select, streak milestone~~ | ~~S~~ | ✅ Done |
| 27 | **Biometric Lock** | Face ID / Touch ID to protect private diary entries | M | App Store |

### HIGH Priority - App Store Submission

| # | Task | Description | Size | Depends On |
|---|------|-------------|------|------------|
| 28 | **App Icons & Branding** | Generate all required icon sizes, branded splash screen | M | - |
| 29 | **Privacy & Permissions** | Privacy manifest, Info.plist permissions, privacy policy page | M | 23, 24 |
| 30 | **Code Signing & Profiles** | Apple Developer account, certificates, provisioning profiles | M | - |
| 31 | **App Store Metadata** | Screenshots, description, keywords, categories, pricing | M | 28 |
| 32 | **TestFlight Beta** | Archive, upload, beta test with real devices | M | 29, 30 |
| 33 | **App Store Submission** | Final review, submit for Apple review | S | 31, 32 |

### HIGH Priority - Diary Capabilities (Task 22)

| # | Task | Description | Size |
|---|------|-------------|------|
| 22a | ~~Inline Writing~~ | ~~DiaryPreviewCard textarea, auto-save on blur~~ | ✅ Done |
| 22b | ~~Diary Entry Export~~ | ~~Share diary as styled card (3 templates, 3 styles, 2 formats)~~ | ✅ Done |
| 22j | ~~Sketch/Drawing~~ | ~~Inline canvas in editor toolbar, pen/eraser, 8 colors, 4 brush sizes, kids mode~~ | ✅ Done |
| 22c | Voice-to-Text Entry | Record voice memo, transcribe to diary text | L |
| 22d | Custom Templates | Users create/save their own structured templates | M |
| 22e | Daily Writing Goals | Word count goals, progress bar, streak milestones | S |
| 22f | Weekly Digest | Auto-generated weekly summary of entries, moods, highlights | M |
| 22g | Mood Correlations | Show mood vs tags/writing length/gratitude patterns | M |
| 22h | Diary Timeline View | Scrollable timeline of past entries with previews | M |
| 22i | Guided Journaling Flows | Step-by-step reflection prompts | M |

### MEDIUM Priority - Enhanced Features

| # | Task | Description | Size |
|---|------|-------------|------|
| 14 | Image Upload | Supabase storage for diary photos (web) | M |
| 17 | Demo Data Seeder | Script to populate test data | S |
| 20 | Direct Instagram API | Post directly to Instagram | L |

### LOW Priority - Polish

| # | Task | Description | Size |
|---|------|-------------|------|
| 13 | Loading Skeletons | Shimmer loading states | S |
| 15 | Keyboard Shortcuts | Cmd+K, Cmd+D shortcuts | S |
| 16 | Animations | Framer Motion transitions | M |
| 18 | Update README | Screenshots, docs, deployment guide | S |

---

## Detailed Task Breakdown - New Tasks

### Task 23: Push Notifications
**Priority:** HIGH (required for App Store)
**Size:** L

**What to do:**
1. Install `@capacitor/push-notifications`
2. Configure APNs (Apple Push Notification service)
3. Create Supabase Edge Function for sending notifications
4. Add notification preferences in Settings (already has toggle UI)
5. Implement daily reminder at user's preferred time
6. Notification types: daily reminder, streak at risk, weekly summary

**Acceptance Criteria:**
- [ ] Push permission prompt on first open
- [ ] Daily reminder notification at set time
- [ ] Streak at risk notification (if no activity by evening)
- [ ] Notification settings toggle works
- [ ] Works on physical iOS device

---

### Task 24: Camera Integration
**Priority:** HIGH (required for App Store)
**Size:** M

**What to do:**
1. Install `@capacitor/camera`
2. Add camera capture button in diary entry
3. Add photo library picker
4. Compress images before upload
5. Store photos in Supabase Storage
6. Display photos in diary entries
7. Add NSCameraUsageDescription to Info.plist

**Acceptance Criteria:**
- [ ] Camera opens from diary
- [ ] Photo library picker works
- [ ] Photos display in diary entry
- [ ] Photos persist across sessions
- [ ] Works on physical iOS device

---

### Task 25: Offline Support
**Priority:** HIGH (required for App Store)
**Size:** L

**What to do:**
1. Install `@capacitor/preferences` for local storage
2. Cache today's tasks and diary locally
3. Queue mutations when offline
4. Sync when connection returns
5. Show offline indicator in UI
6. Service worker for web (Vite PWA plugin)

**Acceptance Criteria:**
- [ ] Can view today's tasks offline
- [ ] Can add tasks offline (syncs later)
- [ ] Can write diary offline (syncs later)
- [ ] Offline indicator visible
- [ ] No data loss on reconnection

---

### Task 26: Haptic Feedback
**Priority:** HIGH (required for App Store)
**Size:** S

**What to do:**
1. Install `@capacitor/haptics`
2. Add haptic feedback to:
   - Task completion (success haptic)
   - Mood selection (light impact)
   - Streak milestone (heavy impact)
   - Delete actions (warning haptic)
3. Create `useHaptics()` hook
4. No-op on web (graceful degradation)

**Acceptance Criteria:**
- [ ] Haptic on task complete
- [ ] Haptic on mood select
- [ ] Haptic on streak celebration
- [ ] No errors on web

---

### Task 27: Biometric Lock
**Priority:** HIGH (nice for App Store)
**Size:** M

**What to do:**
1. Use `@capacitor-community/biometric-auth` or native plugin
2. Add "Lock with Face ID" toggle in Settings
3. Require biometric auth on app open (when enabled)
4. Fallback to device passcode
5. Add NSFaceIDUsageDescription to Info.plist

**Acceptance Criteria:**
- [ ] Face ID / Touch ID prompt on app open
- [ ] Toggle in settings to enable/disable
- [ ] Passcode fallback works
- [ ] Graceful degradation on web

---

### Task 28: App Icons & Branding
**Priority:** HIGH
**Size:** M

**What to do:**
1. Design DAYO app icon (or use existing "D" logo)
2. Generate all required sizes:
   - 1024x1024 (App Store)
   - 180x180 (iPhone @3x)
   - 120x120 (iPhone @2x)
   - 167x167 (iPad Pro)
   - 152x152 (iPad)
   - 76x76 (iPad mini)
   - 40x40 (Spotlight)
   - 29x29 (Settings)
3. Replace Capacitor default splash screen with branded version
4. Test on multiple device sizes

---

### Task 29: Privacy & Permissions
**Priority:** HIGH
**Size:** M

**What to do:**
1. Create PrivacyInfo.xcprivacy manifest
2. Update Info.plist with:
   - NSCameraUsageDescription
   - NSPhotoLibraryUsageDescription
   - NSFaceIDUsageDescription
   - NSUserTrackingUsageDescription (if needed)
3. Create privacy policy page (web URL)
4. Add privacy policy URL to Info.plist
5. Declare data collection practices for App Store

---

### Task 30: Code Signing & Profiles
**Priority:** HIGH
**Size:** M
**Prerequisites:** Apple Developer account ($99/year)

**What to do:**
1. Create App ID in Apple Developer portal (app.dayo.web)
2. Generate iOS Distribution Certificate
3. Create App Store provisioning profile
4. Configure Xcode with Team ID and manual signing
5. Test archive build locally

---

### Task 31: App Store Metadata
**Priority:** HIGH
**Size:** M

**What to do:**
1. Create App Store Connect listing
2. Write app description (short + long)
3. Define keywords and categories (Lifestyle / Productivity)
4. Capture screenshots on multiple device sizes:
   - iPhone 6.7" (iPhone 15 Pro Max)
   - iPhone 6.1" (iPhone 15)
   - iPad Pro 12.9"
5. Set pricing (Free)
6. Set age rating
7. Define territories

---

### Task 32: TestFlight Beta
**Priority:** HIGH
**Size:** M

**What to do:**
1. Archive build in Xcode
2. Upload to App Store Connect
3. Add beta testers
4. Test full flow on real device
5. Fix any issues found
6. Verify push notifications work
7. Verify camera works
8. Test offline mode

---

### Task 33: App Store Submission
**Priority:** HIGH
**Size:** S

**What to do:**
1. Final build with all features
2. Complete App Store Connect review information
3. Submit for App Review
4. Monitor review status
5. Respond to any rejection feedback
6. Release to App Store

---

## Recommended Order

### Completed
1. ~~Core app (Tasks, Diary, Calendar, Dashboard)~~ ✅
2. ~~AI, Export, Streaks, Toasts~~ ✅
3. ~~Kids/Adults Mode + Landing Page~~ ✅
4. ~~Tests (262), Dark Mode, Backgrounds~~ ✅

### Phase A: Product Value (Web)
5. **Task 21** - Improve Landing Page
6. **Task 22** - Diary Capabilities

### Phase B: Native Features (iOS)
7. ~~**Task 26** - Haptic Feedback~~ ✅
8. ~~**Task 24** - Camera Integration~~ ✅
9. **Task 23** - Push Notifications
10. **Task 25** - Offline Support
11. **Task 27** - Biometric Lock

### Phase C: App Store Submission
12. **Task 28** - App Icons & Branding
13. **Task 30** - Code Signing & Profiles
14. **Task 29** - Privacy & Permissions
15. **Task 31** - App Store Metadata
16. **Task 32** - TestFlight Beta
17. **Task 33** - App Store Submission

### Phase D: Polish & Extras
18. Task 14 - Image Upload (web)
19. Tasks 13, 15, 16 - Loading, Shortcuts, Animations
20. Task 17, 18 - Seeder, README
21. Task 20 - Direct Instagram API

---

*Total: 18 open tasks | Phases: A (Product) → B (Native) → C (App Store) → D (Polish)*
