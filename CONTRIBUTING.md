# DAYO Development Workflow

**Effective:** January 18, 2026

---

## Git Workflow

We use a **Pull Request (PR) based workflow** with feature branches.

### Rules

1. **Never push directly to `main`**
2. Create a feature branch for each task
3. Open a PR for code review
4. Merge only after approval

---

## Branch Naming Convention

```
<type>/<short-description>

Examples:
  feat/ai-chat-integration
  fix/streak-calculation-bug
  docs/update-readme
  refactor/export-modal
  test/add-calendar-tests
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

---

## Workflow Steps

### 1. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

### 2. Make Changes & Commit

```bash
git add .
git commit -m "feat: description of changes"
```

### 3. Push Branch

```bash
git push -u origin feat/your-feature-name
```

### 4. Create Pull Request

```bash
gh pr create --title "feat: Your feature" --body "Description of changes"
```

Or create via GitHub UI.

### 5. After PR Approval

```bash
# Merge via GitHub UI or:
gh pr merge --squash
```

### 6. Clean Up

```bash
git checkout main
git pull origin main
git branch -d feat/your-feature-name
```

---

## Commit Message Format

```
<type>: <short description>

[optional body]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Examples

```
feat: add Instagram export with 3 templates

- Full Day Card template
- Diary Spotlight template
- Achievement Grid template
- Support for Story (9:16) and Post (1:1) formats

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

```
fix: correct streak calculation for timezone edge case

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## Quick Reference

```bash
# Start new feature
git checkout main && git pull && git checkout -b feat/my-feature

# Push and create PR
git push -u origin feat/my-feature
gh pr create

# After merge, clean up
git checkout main && git pull && git branch -d feat/my-feature
```

---

*Direct pushes to `main` are no longer allowed.*
