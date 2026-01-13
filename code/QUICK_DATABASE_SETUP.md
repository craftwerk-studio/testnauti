# Quick Database Setup - TL;DR

**Goal**: Get TestNauti's database running in 5 minutes.

## Step 1: Choose Your Database

### Option A: Local PostgreSQL (Recommended for Development) ⭐
**Best for**: Learning, testing, offline work

See **LOCAL_DEVELOPMENT_SETUP.md** for detailed instructions, or quick start:

```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15
createdb testnauti

# Your .env connection string:
DATABASE_URL="postgresql://postgres@localhost:5432/testnauti"
DIRECT_URL="postgresql://postgres@localhost:5432/testnauti"
```

### Option B: Vercel Postgres (For Production)
**Best for**: When deploying to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project → Storage tab → Create Database → Postgres
3. Copy `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`

### Option C: Supabase (Free Cloud Alternative)
**Best for**: Free cloud database without Vercel

1. Go to https://supabase.com → New Project
2. Settings → Database → Copy connection string
3. You'll need both pooled (port 6543) and direct (port 5432) URLs

## Step 2: Add Environment Variables

**Quick Way**: Copy `ENV_TEMPLATE.txt` to `.env` and update the values.

Or create a new file named `.env` (no .txt, just `.env`) in the project root folder:

```env
# Your existing Clerk keys (should already be here)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Add these NEW lines (from Step 1)
# For local PostgreSQL:
DATABASE_URL="postgresql://postgres@localhost:5432/testnauti"
DIRECT_URL="postgresql://postgres@localhost:5432/testnauti"

# For cloud databases, use your connection strings from Step 1
```

**Important Notes:**
- File must be named exactly `.env` (with the dot, not `.env.txt`)
- For local development, see `ENV_TEMPLATE.txt` for all options
- For cloud databases, paste your actual connection strings from Step 1
- Keep the quotes around the connection strings
- No spaces around the `=` sign
- Save the file in the same folder as `package.json`

## Step 3: Install and Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push
```

You should see:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

## Step 4: Test It

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# Sign in, take a test, check dashboard
```

## Verify It Worked

1. Complete a practice test
2. See "Attempt saved!" on results page
3. Go to Dashboard → see your stats and recent attempts

## Optional: View Database

```bash
npm run db:studio
```

Opens GUI at http://localhost:5555 to browse your data.

## Deploy to Vercel

1. Add `DATABASE_URL` and `DIRECT_URL` to Vercel environment variables
2. Push your code: `git push`
3. Vercel deploys automatically

## Troubleshooting

**"Can't reach database server"**
- Double-check your connection strings are correct (no typos)
- Ensure your database is running (check Vercel/Supabase dashboard)
- For Supabase: Make sure you replaced `[YOUR-PASSWORD]` with actual password

**"Environment variable not found: DATABASE_URL"**
- Ensure `.env` file is in the project root (same folder as `package.json`)
- File must be named exactly `.env` (not `.env.txt` or `env`)
- Restart your dev server: Stop (`Ctrl+C`) and run `npm run dev` again

**"Error: P1001: Can't reach database"**
- Check if database is accepting connections (Vercel/Supabase dashboard)
- Verify connection string includes `?sslmode=require`
- For Supabase: Try switching between pooled and direct URLs

**"PrismaClient is unable to run in browser"**
- This is a code issue, not setup
- Make sure you're not importing Prisma in client components
- Check that server actions are marked with `'use server'`

**Build fails with "Prisma Client could not be generated"**
- Run `npm run db:generate` manually
- Check that `postinstall` script exists in `package.json`
- Ensure `DATABASE_URL` is set during build (Vercel: add to env vars)

## Need More Help?

See `DATABASE_SETUP.md` for detailed guide with screenshots and troubleshooting.

---

**That's it!** Your database is ready and TestNauti will now track user progress. 🎉

