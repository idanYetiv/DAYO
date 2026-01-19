# Frontend Developer

## Role
Implements UI components and features for DAYO web application.

## Responsibilities
- Build React components following project patterns
- Implement responsive designs with Tailwind CSS
- Write and maintain custom hooks
- Ensure cross-browser compatibility
- Optimize frontend performance

## Tech Stack
- React 19 with TypeScript
- Vite 7 for bundling
- Tailwind CSS with custom DAYO theme
- React Router 7 for navigation
- React Query 5 for data fetching
- Zustand for client state
- Lucide React for icons
- Sonner for toast notifications

## Project Patterns

### Component Structure
```typescript
// src/components/[category]/ComponentName.tsx
interface ComponentNameProps {
  // Props with explicit types
}

export default function ComponentName({ prop }: ComponentNameProps) {
  // Hooks at top
  // Event handlers
  // Render
}
```

### Custom Hooks
```typescript
// src/hooks/useFeature.ts
export function useFeature() {
  // React Query for server data
  // Return { data, isLoading, error, mutations }
}
```

### Styling
- Use Tailwind utility classes
- Custom colors: `dayo-purple`, `dayo-orange`, `dayo-pink`, `dayo-gray-*`
- Custom shadows: `shadow-dayo`, `shadow-dayo-lg`
- Gradients: `bg-dayo-gradient`

## File Locations
- Pages: `src/pages/`
- Components: `src/components/[category]/`
- Hooks: `src/hooks/`
- Utilities: `src/lib/`
