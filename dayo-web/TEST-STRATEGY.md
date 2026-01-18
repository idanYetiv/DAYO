# DAYO Test Strategy

## Overview

This document outlines the testing strategy for the DAYO web application, following the testing pyramid best practices.

```
        /\
       /  \     E2E Tests (Critical Flows)
      /----\
     /      \   Integration Tests (Pages, API)
    /--------\
   /          \  Unit Tests (Utils, Hooks, Components)
  --------------
```

## Test Layers

### 1. Unit Tests (`src/__tests__/unit/`)
**Purpose:** Test individual functions and components in isolation
**Tools:** Vitest + React Testing Library
**Coverage Target:** 80%

| Category | What to Test |
|----------|--------------|
| Utilities | `lib/utils.ts`, `lib/toast.ts`, date formatting |
| Hooks | `useTasks`, `useDiary`, `useUserStats` (mocked Supabase) |
| Components | UI components render correctly, handle props |
| Stores | Zustand stores state changes |

### 2. Integration Tests (`src/__tests__/integration/`)
**Purpose:** Test component interactions and page behavior
**Tools:** Vitest + React Testing Library + MSW (Mock Service Worker)
**Coverage Target:** 60%

| Category | What to Test |
|----------|--------------|
| Pages | Full page rendering with mocked data |
| Forms | Form submission, validation |
| Navigation | Route changes, protected routes |
| Data Flow | Component to hook to API flow |

### 3. E2E Tests (`e2e/`)
**Purpose:** Test critical user journeys end-to-end
**Tools:** Playwright
**Coverage Target:** Critical paths only

| Flow | Priority |
|------|----------|
| Auth (signup/login/logout) | Critical |
| Create task → Complete → Delete | Critical |
| Add diary entry with mood | Critical |
| Navigate calendar, view day | High |
| Dashboard stats display | Medium |

## Test File Structure

```
dayo-web/
├── src/
│   └── __tests__/
│       ├── unit/
│       │   ├── lib/
│       │   │   ├── utils.test.ts
│       │   │   └── toast.test.ts
│       │   ├── hooks/
│       │   │   ├── useTasks.test.ts
│       │   │   ├── useDiary.test.ts
│       │   │   └── useUserStats.test.ts
│       │   └── components/
│       │       ├── Calendar.test.tsx
│       │       ├── TasksSection.test.tsx
│       │       └── BottomNavigation.test.tsx
│       ├── integration/
│       │   ├── pages/
│       │   │   ├── TodayPage.test.tsx
│       │   │   ├── CalendarPage.test.tsx
│       │   │   └── DashboardPage.test.tsx
│       │   └── flows/
│       │       └── taskFlow.test.tsx
│       └── mocks/
│           ├── supabase.ts
│           ├── handlers.ts
│           └── testUtils.tsx
├── e2e/
│   ├── auth.spec.ts
│   ├── tasks.spec.ts
│   ├── diary.spec.ts
│   └── calendar.spec.ts
└── playwright.config.ts
```

## Running Tests

```bash
# Unit & Integration tests
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage report

# E2E tests
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # Playwright UI mode
npm run test:e2e:headed   # See browser

# All tests
npm run test:all          # Run everything
```

## Mocking Strategy

### Supabase Mock
- Mock `@supabase/supabase-js` for unit tests
- Use MSW for integration tests to intercept HTTP calls

### Test Data
- Use factories for generating test data
- Keep test data in `src/__tests__/mocks/testData.ts`

## CI/CD Integration

```yaml
# .github/workflows/test.yml
- Run unit tests on every PR
- Run integration tests on every PR
- Run E2E tests on main branch merges
```

## Coverage Requirements

| Suite | Min Coverage |
|-------|--------------|
| Unit | 80% |
| Integration | 60% |
| E2E | Critical paths |

## Reporting

Test reports are generated in:
- `coverage/` - Coverage reports (HTML, JSON)
- `playwright-report/` - E2E test reports
- `QA-REPORT.md` - Manual QA status

---

*Last updated: January 17, 2026*
