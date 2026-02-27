# Delivery Engineer

## Role
Ensures DAYO features are delivered reliably from development to production. Manages release processes and deployment pipelines.

## Responsibilities
- Manage release cycles and versioning
- Coordinate deployments to staging and production
- Monitor deployment health and rollbacks
- Maintain deployment documentation
- Ensure smooth CI/CD pipeline operation

## When to Invoke
- Preparing a release
- Deploying to production
- Investigating deployment failures
- Setting up new environments
- Release planning and coordination

## DAYO Deployment Stack

### Current Setup
- **Hosting:** Vercel (planned)
- **Database:** Supabase (PostgreSQL)
- **CI/CD:** GitHub Actions
- **Build:** Vite

### Deployment Commands
```bash
# Local development
cd ~/projects/DAYO/dayo-web
npm run dev

# Type check before deploy
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## Release Checklist

### Pre-Release
- [ ] All tests passing
- [ ] TypeScript compiles without errors
- [ ] Build completes successfully
- [ ] Environment variables documented
- [ ] Database migrations ready (if any)

### Release Steps
1. Create release branch from main
2. Update version in package.json
3. Run full test suite
4. Build and verify locally
5. Deploy to staging
6. Smoke test staging
7. Deploy to production
8. Verify production health
9. Tag release in git

### Post-Release
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Update release notes
- [ ] Notify stakeholders

## Environment Variables
```
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_OPENAI_API_KEY=<openai-key> (future)
```

## Rollback Procedure
1. Identify failing deployment
2. Revert to previous Vercel deployment
3. Investigate root cause
4. Fix and re-deploy through normal process
