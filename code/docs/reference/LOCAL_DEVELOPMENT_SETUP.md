# Local Development Setup Guide

## Running TestNauti Completely Locally

This guide shows you how to run TestNauti entirely on your local machine with a local PostgreSQL database.

---

## Prerequisites

- Node.js installed
- PostgreSQL installed locally (or Docker)

---

## Step 1: Install PostgreSQL Locally

### Option A: Using Homebrew (macOS)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create a database for TestNauti
createdb testnauti
```

### Option B: Using Docker

```bash
# Pull and run PostgreSQL container
docker run --name testnauti-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=testnauti \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

### Option C: Using Postgres.app (macOS)

1. Download from https://postgresapp.com/
2. Open Postgres.app and start the server
3. Click "+" to create a new database named `testnauti`

---

## Step 2: Create .env File

Create a file named `.env` in your project root (same folder as `package.json`):

```env
# Clerk Authentication (you should already have these)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_here

# Local PostgreSQL Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/testnauti"
DIRECT_URL="postgresql://postgres:password@localhost:5432/testnauti"
```

**Important Notes:**
- Replace `password` with your actual PostgreSQL password (if you set one)
- If using default PostgreSQL user, username is `postgres`
- Port `5432` is the default PostgreSQL port
- `testnauti` is your database name
- For local development, `DATABASE_URL` and `DIRECT_URL` can be the same

### Common Connection String Formats

**Default Homebrew install:**
```env
DATABASE_URL="postgresql://postgres@localhost:5432/testnauti"
```

**With password:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/testnauti"
```

**Docker (as configured above):**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/testnauti"
```

**Postgres.app (usually no password):**
```env
DATABASE_URL="postgresql://postgres@localhost:5432/testnauti"
```

---

## Step 3: Install Dependencies & Setup Database

```bash
# Install all dependencies (including Prisma)
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

---

## Step 4: Verify Database Setup

### Option 1: Using Prisma Studio (Visual Interface)

```bash
npm run db:studio
```

This opens a browser window at `http://localhost:5555` where you can:
- See your `users` and `exam_attempts` tables
- View data visually
- Edit records manually (for testing)

### Option 2: Using psql (Command Line)

```bash
# Connect to your database
psql testnauti

# List tables
\dt

# View schema
\d users
\d exam_attempts

# Exit
\q
```

---

## Step 5: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 and you're ready to go! 🎉

---

## Testing Your Local Setup

1. **Sign In**: Go to http://localhost:3000 and sign in with Clerk
2. **Browse Exams**: Navigate to exam catalog
3. **Take a Test**: Complete a practice test
4. **Check Results**: Verify "Attempt saved!" message appears
5. **View Dashboard**: Go to dashboard and see your stats
6. **View Database**: Run `npm run db:studio` and verify data was saved

---

## Common Issues & Solutions

### Issue: "Can't reach database server"

**Check if PostgreSQL is running:**

```bash
# For Homebrew
brew services list

# For Docker
docker ps

# For Postgres.app
# Just check if the app is running
```

**Start PostgreSQL if not running:**

```bash
# Homebrew
brew services start postgresql@15

# Docker
docker start testnauti-postgres
```

### Issue: "database 'testnauti' does not exist"

**Create the database:**

```bash
# Homebrew/Postgres.app
createdb testnauti

# Or via psql
psql postgres
CREATE DATABASE testnauti;
\q

# Docker (database should already exist from docker run command)
```

### Issue: "password authentication failed"

**Your PostgreSQL might not have a password set. Try:**

```env
# Without password
DATABASE_URL="postgresql://postgres@localhost:5432/testnauti"

# Or reset the password
```

**Reset password (Homebrew):**

```bash
psql postgres
ALTER USER postgres PASSWORD 'newpassword';
\q
```

### Issue: "Port 5432 is already in use"

**Check what's using the port:**

```bash
lsof -i :5432
```

**Either:**
- Stop the existing PostgreSQL instance
- Use a different port (change 5432 in connection string)

---

## Development Workflow

### Daily Workflow

```bash
# 1. Start PostgreSQL (if not auto-starting)
brew services start postgresql@15
# OR
docker start testnauti-postgres

# 2. Start dev server
npm run dev

# 3. Code and test!
```

### When You Change the Database Schema

If you modify `prisma/schema.prisma`:

```bash
# Push changes to database
npm run db:push

# Regenerate Prisma client
npm run db:generate

# Restart dev server
npm run dev
```

### Viewing Your Data

Anytime you want to see what's in the database:

```bash
npm run db:studio
```

### Resetting the Database

If you want to start fresh:

```bash
# WARNING: This deletes all data!
npx prisma db push --force-reset
```

---

## Advantages of Local Development

✅ **Fast**: No network latency
✅ **Free**: No cloud database costs
✅ **Offline**: Work without internet
✅ **Safe**: Test destructive operations without risk
✅ **Privacy**: Data stays on your machine

---

## Migrating to Production Later

When you're ready to deploy to Vercel:

1. **Create production database** (Vercel Postgres or Supabase)
2. **Add production env vars** to Vercel dashboard:
   ```
   DATABASE_URL="production_connection_string"
   DIRECT_URL="production_direct_connection_string"
   ```
3. **Push code to GitHub**
4. **Push schema to production**:
   ```bash
   DATABASE_URL="production_url" npx prisma db push
   ```
5. **Deploy!**

Your local database will remain separate from production.

---

## Backing Up Your Local Data

### Export Database

```bash
# Create a backup
pg_dump testnauti > backup.sql

# Restore from backup
psql testnauti < backup.sql
```

### Export Specific Tables

```bash
# Export just exam_attempts
pg_dump testnauti -t exam_attempts > attempts_backup.sql
```

---

## Tips for Local Development

### 1. Keep PostgreSQL Running

Add to startup apps so it's always available:

```bash
# Make it start automatically on boot (Homebrew)
brew services start postgresql@15
```

### 2. Use Prisma Studio Regularly

Open `npm run db:studio` in a separate terminal tab - it's great for:
- Debugging data issues
- Verifying saves work
- Manually creating test data
- Understanding your schema

### 3. Create Test Data

Use Prisma Studio or psql to create test attempts:
- Take a few tests with different scores
- Mix timed and untimed attempts
- Test edge cases (0%, 100%, etc.)

### 4. Separate Local and Production

Your `.env` file is gitignored, so:
- Local: Keep local PostgreSQL connection
- Production: Different connection in Vercel env vars
- No risk of mixing them up!

---

## Quick Reference

### Essential Commands

```bash
# Start database (Homebrew)
brew services start postgresql@15

# Stop database (Homebrew)
brew services stop postgresql@15

# Start database (Docker)
docker start testnauti-postgres

# Stop database (Docker)
docker stop testnauti-postgres

# Generate Prisma client
npm run db:generate

# Sync schema to database
npm run db:push

# Open database GUI
npm run db:studio

# Start dev server
npm run dev
```

### Connection String Template

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Local example:**
```
postgresql://postgres:password@localhost:5432/testnauti
```

---

## Environment Variables Template

Copy this to your `.env` file:

```env
# ===========================================
# Clerk Authentication
# ===========================================
# Get these from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# ===========================================
# Local PostgreSQL Database
# ===========================================
# Format: postgresql://[user]:[password]@[host]:[port]/[database]
# For local development, both can be the same

# Option 1: Default Homebrew install (no password)
DATABASE_URL="postgresql://postgres@localhost:5432/testnauti"
DIRECT_URL="postgresql://postgres@localhost:5432/testnauti"

# Option 2: With password
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/testnauti"
# DIRECT_URL="postgresql://postgres:your_password@localhost:5432/testnauti"

# Option 3: Docker (as configured in this guide)
# DATABASE_URL="postgresql://postgres:password@localhost:5432/testnauti"
# DIRECT_URL="postgresql://postgres:password@localhost:5432/testnauti"
```

---

## Troubleshooting Checklist

If something isn't working, go through this:

- [ ] PostgreSQL is installed
- [ ] PostgreSQL is running (`brew services list` or `docker ps`)
- [ ] Database `testnauti` exists (`psql -l` to list databases)
- [ ] `.env` file exists in project root
- [ ] `.env` has correct connection string
- [ ] Connection string has correct password (if any)
- [ ] Ran `npm install`
- [ ] Ran `npm run db:generate`
- [ ] Ran `npm run db:push`
- [ ] Dev server restarted after changing `.env`
- [ ] No errors in terminal or browser console

---

## Next Steps

Once local development is working:

1. ✅ Follow `VERIFICATION_CHECKLIST.md` to test all features
2. ✅ Build your exams (add JSON files to `src/data/exams/`)
3. ✅ Test with real users locally
4. ✅ When ready, deploy to Vercel with cloud database

---

## Need Help?

- **PostgreSQL docs**: https://www.postgresql.org/docs/
- **Prisma docs**: https://www.prisma.io/docs
- **Homebrew**: https://brew.sh/
- **Docker**: https://docs.docker.com/

---

**Happy local development!** 🚀

Your data is safe on your machine, you can iterate quickly, and when you're ready, deploying to production is just a few commands away.

