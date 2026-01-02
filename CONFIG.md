# Configuration Guide

## Environment Setup

### 1. Supabase Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

### 2. Better Auth Setup

```env
BETTER_AUTH_SECRET=[generate-with-openssl-rand-base64-32]
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Database Setup

Run migrations on your Supabase instance:

```sql
-- Create tables for blood inventory, donors, queue, etc.
-- See database schema documentation
```

## Development Workflow

1. **Feature Branch**: Create a new branch for each feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Code Quality**: Run linting before commits
   ```bash
   npm run lint
   npm run type-check
   ```

3. **Commit Messages**: Follow conventional commits
   ```
   feat: add new feature
   fix: resolve bug
   refactor: improve code structure
   ```

4. **Testing**: Test locally before pushing
   ```bash
   npm run dev
   ```

## Deployment

### To Vercel

```bash
vercel deploy
```

### Environment Variables

Set all `.env.local` variables in Vercel project settings.

## Troubleshooting

### npm install issues

Use legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

### Build errors

Clear cache and rebuild:
```bash
rm -rf .next
npm run build
```

### Port conflicts

Use custom port:
```bash
npm run dev -- -p 3001
```
