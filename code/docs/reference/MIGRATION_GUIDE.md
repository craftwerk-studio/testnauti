# Migration Guide: Adding Database to Existing TestNauti Deployment

If you already have TestNauti deployed and want to add the database functionality from Phase 6, follow this guide.

## What's Changing?

**Before Phase 6**:
- Test results stored only in sessionStorage (lost on browser close)
- Dashboard was a placeholder
- No progress tracking

**After Phase 6**:
- All attempts saved to PostgreSQL database
- Rich dashboard with stats and history
- Persistent progress tracking across sessions

## Pre-Migration Checklist

- [ ] Backup your current deployment (if any)
- [ ] Ensure you have access to Vercel dashboard (or hosting platform)
- [ ] Have Clerk credentials ready
- [ ] Choose database provider (Vercel Postgres or Supabase)

## Migration Steps

### 1. Update Your Local Codebase

```bash
# Pull latest changes (if using git)
git pull origin main

# Or download the updated code

# Install new dependencies
npm install
```

This installs:
- `@prisma/client` (runtime)
- `prisma` (dev dependency)

### 2. Set Up Database

Follow **QUICK_DATABASE_SETUP.md** or **DATABASE_SETUP.md** to:
1. Create a PostgreSQL database
2. Get connection strings
3. Add to `.env` file
4. Run `npm run db:generate`
5. Run `npm run db:push`

### 3. Test Locally

```bash
npm run dev
```

1. Sign in to the app
2. Take a practice test
3. Check results page for "Attempt saved!" message
4. Visit dashboard to see your stats
5. Verify data in Prisma Studio: `npm run db:studio`

### 4. Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add two new variables:
   - `DATABASE_URL`: Your database connection string (pooled)
   - `DIRECT_URL`: Your direct connection string
3. Apply to: Production, Preview, and Development

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Add database support for progress tracking"
git push origin main
```

Vercel will automatically:
- Install dependencies
- Generate Prisma client
- Build Next.js app
- Deploy

### 6. Initialize Production Database

After first deployment, push schema to production database:

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Pull production env vars
vercel env pull .env.production

# Push schema to production
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma db push
```

**Option B: Manual**
```bash
# Use your production DATABASE_URL
DATABASE_URL="your_production_url_here" npx prisma db push
```

### 7. Verify Production

1. Visit your production URL
2. Sign in
3. Take a test
4. Check dashboard
5. Verify attempt was saved

## Rollback Plan (If Something Goes Wrong)

### Quick Rollback
1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

### Remove Database (Keep Old Version)
1. Remove `DATABASE_URL` and `DIRECT_URL` from Vercel env vars
2. Revert code changes:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Data Migration (If You Had Custom Storage)

If you implemented custom storage before Phase 6:

### From LocalStorage/SessionStorage
No migration needed - old data will remain in browser but new attempts will save to database.

### From Custom Database
If you already had a database with different schema:

1. Export existing data
2. Transform to match new schema (see `prisma/schema.prisma`)
3. Import using Prisma:

```typescript
// migration-script.ts
import { prisma } from './src/lib/db';

async function migrate() {
  const oldData = /* load your old data */;
  
  for (const attempt of oldData) {
    await prisma.examAttempt.create({
      data: {
        userId: attempt.userId,
        examId: attempt.examId,
        examTitle: attempt.examTitle,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
        timeTakenSeconds: attempt.timeTaken,
        wasTimed: attempt.wasTimed ?? false,
        wasAutoSubmitted: attempt.wasAutoSubmitted ?? false,
        completedAt: new Date(attempt.completedAt),
      },
    });
  }
}

migrate();
```

## Troubleshooting Production Issues

### Issue: "Can't reach database server"

**Cause**: Database connection string incorrect or database not accessible

**Fix**:
1. Verify `DATABASE_URL` in Vercel env vars
2. Check database is running (Vercel Postgres dashboard or Supabase)
3. Ensure connection string includes SSL mode: `?sslmode=require`

### Issue: "Table does not exist"

**Cause**: Schema not pushed to production database

**Fix**:
```bash
# Push schema to production
DATABASE_URL="your_production_url" npx prisma db push
```

### Issue: "PrismaClient initialization error"

**Cause**: Prisma client not generated during build

**Fix**: Add postinstall script to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Then redeploy.

### Issue: "Too many database connections"

**Cause**: Not using connection pooling

**Fix**: Ensure you're using the pooled connection string:
- Vercel Postgres: Use `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
- Supabase: Use port 6543 with `?pgbouncer=true`

### Issue: Dashboard shows no data but attempts are saving

**Cause**: Cache not revalidated

**Fix**: 
1. Check server action includes `revalidatePath('/app/dashboard')`
2. Hard refresh dashboard (Cmd+Shift+R / Ctrl+Shift+R)
3. Check Prisma Studio to verify data exists

## Performance Monitoring

After migration, monitor:

### Database Performance
- Query response times (should be <100ms)
- Connection pool usage
- Database size growth

**Tools**:
- Vercel Postgres: Built-in analytics
- Supabase: Database → Performance tab

### Application Performance
- Page load times (should be unchanged)
- Server action response times
- Error rates

**Tools**:
- Vercel Analytics
- Browser DevTools → Network tab

## Cost Considerations

### Vercel Postgres
- Free tier: 256 MB storage, 60 hours compute/month
- Hobby: $20/month for more resources
- Estimate: ~1KB per attempt → 256,000 attempts on free tier

### Supabase
- Free tier: 500 MB storage, unlimited API requests
- Pro: $25/month for more resources
- Estimate: ~1KB per attempt → 500,000 attempts on free tier

### When to Upgrade
- Free tier is sufficient for:
  - 100-500 active users
  - 10,000-50,000 attempts/month
  - Development and testing

## Security Checklist

After migration, verify:

- [ ] `.env` file is in `.gitignore` (should already be)
- [ ] Database credentials not committed to git
- [ ] Environment variables set in Vercel (not in code)
- [ ] Database requires authentication (default)
- [ ] Server actions validate user ID from Clerk
- [ ] No Prisma imports in client components

## Post-Migration Testing

Test these scenarios:

1. **New User Journey**
   - [ ] Sign up
   - [ ] Take first test
   - [ ] See stats on dashboard
   - [ ] Take second test
   - [ ] See updated stats

2. **Existing User Journey**
   - [ ] Sign in with existing account
   - [ ] Previous sessions don't show (expected)
   - [ ] New attempts save correctly
   - [ ] Dashboard shows new attempts

3. **Edge Cases**
   - [ ] Untimed test saves correctly
   - [ ] Timed test saves with duration
   - [ ] Auto-submit (timer expiry) saves correctly
   - [ ] Multiple attempts on same exam
   - [ ] Retake functionality works

4. **Mobile Experience**
   - [ ] Dashboard responsive on mobile
   - [ ] Stats cards stack properly
   - [ ] Recent attempts list readable
   - [ ] Navigation works

## Getting Help

If you encounter issues:

1. Check `DATABASE_SETUP.md` for detailed troubleshooting
2. Verify environment variables are set correctly
3. Check Vercel deployment logs
4. Check database logs (Vercel Postgres or Supabase dashboard)
5. Test locally first to isolate production-specific issues

## Success Criteria

Migration is successful when:

✅ Local development works with database
✅ Production deployment succeeds
✅ Users can complete tests and see results
✅ Dashboard shows accurate stats
✅ No errors in Vercel logs
✅ Database queries are fast (<100ms)
✅ Mobile experience is smooth

## Next Steps After Migration

Once database is working:

1. Monitor usage and performance
2. Gather user feedback
3. Consider Phase 7 features:
   - Admin panel for exam management
   - Advanced analytics
   - Export functionality
   - Social features

---

**Need help?** See `DATABASE_SETUP.md` for detailed setup instructions or `PHASE_6_SUMMARY.md` for technical details.

