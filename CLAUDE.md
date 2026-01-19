# DAYO Project - Claude Session Setup

## Git Configuration (IMPORTANT - Run at session start)

This project uses the personal GitHub account. Set local git config:

```bash
cd ~/DAYO
git config user.name "idanYetiv"
git config user.email "idanyativ@gmail.com"
```

## Project Info

- **GitHub:** https://github.com/idanYetiv/DAYO
- **Production:** https://dayo-web.vercel.app
- **Vercel Project:** dayo-web

## Quick Commands

```bash
# Development
cd ~/DAYO/dayo-web
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build

# Deploy to production
cd ~/DAYO/dayo-web
vercel --prod --yes
```

## Key Files

- `OPEN-TASKS.md` - Current task backlog
- `Claude-discussions/` - Session summaries
- `.claude/agents/` - Team of 15 specialized agents
- `dayo-web/` - React web application

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- Supabase (database + auth)
- React Query + Zustand
- Vercel (hosting)
