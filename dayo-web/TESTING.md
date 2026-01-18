# Testing Guide for DAYO

This document outlines the testing strategy and guidelines for the DAYO web application.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Coverage Goals](#coverage-goals)

## Overview

DAYO uses a comprehensive testing strategy that includes:
- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components in isolation
- **Integration Tests**: Test database hooks and services
- **E2E Tests**: Test complete user flows (via Playwright)

## Tech Stack

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast, Vite-native test runner
- **Component Testing**: [@testing-library/react](https://testing-library.com/react) - User-centric component testing
- **Assertions**: [Vitest](https://vitest.dev/api/) + [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) - Extended DOM matchers
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) - Simulate user events
- **E2E Testing**: [Playwright](https://playwright.dev/) - Browser automation for end-to-end tests

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode
npm test

# Run tests with UI (recommended for development)
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests once (CI mode)
npm test -- --run
```

### Test-Specific Commands

```bash
# Run tests in a specific file
npm test -- src/lib/__tests__/utils.test.ts

# Run tests matching a pattern
npm test -- --grep "cn utility"

# Run tests in a specific directory
npm test -- src/hooks/__tests__
```

## Test Structure

```
dayo-web/
├── src/
│   ├── lib/
│   │   ├── __tests__/
│   │   │   └── utils.test.ts         # Unit tests for utilities
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── __tests__/
│   │   │   ├── useTasks.test.ts      # Hook integration tests
│   │   │   ├── useDiary.test.ts
│   │   │   └── useUserStats.test.ts
│   │   └── useTasks.ts
│   ├── pages/
│   │   ├── __tests__/
│   │   │   ├── LoginPage.test.tsx    # Component tests
│   │   │   ├── TodayPage.test.tsx
│   │   │   └── DashboardPage.test.tsx
│   │   └── TodayPage.tsx
│   └── test/
│       ├── setup.ts                  # Test setup & global config
│       ├── mocks/
│       │   └── supabase.ts          # Mock helpers
│       └── dbHelpers.ts             # Database test utilities
├── e2e/
│   ├── auth.spec.ts                 # E2E auth flow tests
│   ├── tasks.spec.ts                # E2E task CRUD tests
│   ├── diary.spec.ts                # E2E diary tests
│   └── helpers/
│       └── auth.ts                  # E2E test helpers
├── vitest.config.ts                 # Vitest configuration
├── playwright.config.ts             # Playwright configuration
└── TESTING.md                       # This file
```

## Writing Tests

### Unit Tests

Unit tests focus on individual functions and utilities.

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../myModule'

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction(input)
    expect(result).toBe(expected)
  })

  it('should handle edge cases', () => {
    expect(myFunction(null)).toBe(undefined)
  })
})
```

### Component Tests

Component tests verify that React components render and behave correctly.

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Integration Tests (Database Hooks)

Integration tests verify that hooks interact correctly with Supabase.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTasks } from '../useTasks'
import { createWrapper } from '@/test/dbHelpers'

describe('useTasks', () => {
  beforeEach(() => {
    // Clear mocks or reset database state
  })

  it('should fetch tasks', async () => {
    const { result } = renderHook(() => useTasks('user-id'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(0)
  })
})
```

## Best Practices

### 1. Test Behavior, Not Implementation

Focus on testing what the user sees and does, not internal implementation details.

```typescript
// Good: Test user-visible behavior
expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()

// Avoid: Test implementation details
expect(component.state.tasks).toHaveLength(0)
```

### 2. Use Descriptive Test Names

Test names should clearly describe what is being tested and expected.

```typescript
// Good
it('should display error message when login fails', () => {})

// Avoid
it('test login', () => {})
```

### 3. Keep Tests Isolated

Each test should be independent and not rely on other tests.

```typescript
describe('TaskList', () => {
  beforeEach(() => {
    // Reset state before each test
    cleanup()
  })
})
```

### 4. Mock External Dependencies

Mock Supabase calls, API requests, and other external dependencies.

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}))
```

### 5. Test Error States

Always test how components handle errors.

```typescript
it('should display error message when fetch fails', async () => {
  // Mock error response
  mockSupabase.from().select.mockRejectedValue(new Error('Fetch failed'))

  render(<MyComponent />)

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

### 6. Use Testing Library Queries Properly

Prefer queries in this order:
1. `getByRole` (most accessible)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

```typescript
// Good: Accessible query
screen.getByRole('button', { name: /submit/i })

// Less ideal: Test ID
screen.getByTestId('submit-button')
```

## Coverage Goals

### Target Coverage Thresholds

- **Statements**: 80%
- **Branches**: 70%
- **Functions**: 80%
- **Lines**: 80%

### What to Test

**High Priority:**
- Critical user flows (auth, task CRUD, diary)
- Data mutations and state changes
- Error handling
- Form validation

**Medium Priority:**
- UI components
- Utility functions
- Edge cases

**Lower Priority:**
- Static content components
- Simple presentational components

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/index.html
```

## Common Testing Patterns

### Testing Forms

```typescript
it('should submit form with valid data', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(<LoginForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /login/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

### Testing Async Operations

```typescript
it('should load and display tasks', async () => {
  render(<TaskList />)

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  expect(screen.getByText('My Task')).toBeInTheDocument()
})
```

### Testing User Interactions

```typescript
it('should toggle task completion', async () => {
  const user = userEvent.setup()
  render(<TaskItem task={mockTask} />)

  const checkbox = screen.getByRole('checkbox')
  expect(checkbox).not.toBeChecked()

  await user.click(checkbox)
  expect(checkbox).toBeChecked()
})
```

## Continuous Integration

Tests are automatically run in CI on every push and pull request. All tests must pass before merging.

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --run

- name: Check coverage
  run: npm run test:coverage
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Questions?

If you have questions about testing or need help writing tests, check the existing test files for examples or ask the team.

---

**Last Updated**: January 3, 2026
