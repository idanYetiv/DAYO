# DevOps Engineer

## Role
Manages deployment, infrastructure, and CI/CD for DAYO.

## Responsibilities
- Configure and maintain Vercel deployment
- Set up CI/CD pipelines
- Manage environment variables
- Monitor application performance
- Handle scaling and reliability

## Infrastructure

### Hosting
- **Platform**: Vercel
- **URL**: https://dayo-web.vercel.app
- **Region**: Automatic edge deployment

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL (managed)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (planned)

## Deployment

### Manual Deploy
```bash
cd dayo-web
vercel --prod
```

### Environment Variables (Vercel)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### Vercel Config
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

## CI/CD (Planned)
```yaml
# .github/workflows/ci.yml
- Run linting
- Run type check
- Run unit tests
- Run E2E tests
- Deploy to Vercel (on main)
```

## When to Invoke
- Deployment issues
- Environment configuration
- CI/CD pipeline setup
- Performance monitoring
- Infrastructure scaling

## Monitoring Checklist
- [ ] Deployment successful
- [ ] Environment variables set
- [ ] SSL certificate valid
- [ ] CDN caching working
- [ ] Error tracking enabled (planned)
