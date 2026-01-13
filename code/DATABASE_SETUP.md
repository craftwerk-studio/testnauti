# Database Setup Guide for TestNauti

This guide will help you set up PostgreSQL database with Prisma for TestNauti's user progress tracking.

## Prerequisites

- Node.js and npm installed
- A PostgreSQL database (we recommend Vercel Postgres or Supabase)

## Option 1: Vercel Postgres (Recommended for Vercel deployments)

### Step 1: Create a Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create one)
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose a name and region
7. Click "Create"

### Step 2: Get Connection Strings

1. After creation, go to the database settings
2. Copy the connection strings:
   - `POSTGRES_PRISMA_URL` → use as `DATABASE_URL`
   - `POSTGRES_URL_NON_POOLING` → use as `DIRECT_URL`

### Step 3: Add to Environment Variables

Create a `.env` file in the project root:

```env
# Clerk (existing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL="your_POSTGRES_PRISMA_URL_here"
DIRECT_URL="your_POSTGRES_URL_NON_POOLING_here"
```

**Important**: Add `.env` to `.gitignore` (should already be there)

## Option 2: Supabase

### Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Wait for the database to be provisioned

### Step 2: Get Connection String

1. Go to Project Settings → Database
2. Find "Connection string" section
3. Copy the "Connection pooling" string (with `?pgbouncer=true`)
4. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Add to Environment Variables

Create a `.env` file:

```env
# Clerk (existing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

Note: For Supabase, `DIRECT_URL` uses port 5432 (direct connection), while `DATABASE_URL` uses port 6543 (pooled).

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma client for database queries
- `prisma` (dev dependency) - Prisma CLI

### Step 2: Generate Prisma Client

```bash
npm run db:generate
```

This reads `prisma/schema.prisma` and generates the TypeScript types and client.

### Step 3: Push Schema to Database

```bash
npm run db:push
```

This creates the tables in your database based on the Prisma schema. You should see:
- ✅ Created table `users`
- ✅ Created table `exam_attempts`

### Step 4: Verify Setup

Optional - open Prisma Studio to view your database:

```bash
npm run db:studio
```

This opens a browser interface at http://localhost:5555 where you can view and edit data.

## Database Schema

### Users Table
- `id` (String, Primary Key) - Clerk user ID
- `email` (String, Optional)
- `name` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Exam Attempts Table
- `id` (String, Primary Key, CUID)
- `userId` (String, Foreign Key → users.id)
- `examId` (String) - References exam JSON file ID
- `examTitle` (String)
- `score` (Int) - Number of correct answers
- `totalQuestions` (Int)
- `percentage` (Int) - Calculated score percentage
- `timeTakenSeconds` (Int, Nullable) - Null if untimed
- `wasTimed` (Boolean)
- `wasAutoSubmitted` (Boolean) - True if timer expired
- `completedAt` (DateTime)

## Development Workflow

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Run `npm run db:generate` to update TypeScript types

### Viewing Data

```bash
npm run db:studio
```

### Resetting Database (if needed)

⚠️ **Warning**: This deletes all data!

```bash
npx prisma db push --force-reset
```

## Deployment to Vercel

### Step 1: Add Environment Variables

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - (Clerk variables should already be there)

### Step 2: Deploy

```bash
git add .
git commit -m "Add database support"
git push
```

Vercel will automatically:
1. Install dependencies
2. Run `prisma generate` (via postinstall hook if configured)
3. Build the Next.js app
4. Deploy

### Step 3: Run Migrations on Production

After first deployment, you need to push the schema to production database:

```bash
# Using Vercel CLI
vercel env pull .env.production
DATABASE_URL="your_production_url" npx prisma db push
```

Or manually run `npx prisma db push` with production DATABASE_URL.

## Troubleshooting

### Error: "Can't reach database server"

- Check your connection strings are correct
- Ensure your IP is whitelisted (Supabase: disable "Use connection pooling" temporarily)
- Verify database is running

### Error: "Environment variable not found: DATABASE_URL"

- Ensure `.env` file exists in project root
- Restart your dev server after adding `.env`

### Error: "PrismaClient is unable to run in the browser"

- Make sure you're only importing Prisma in server components or server actions
- Never use `prisma` in client components (marked with `'use client'`)

### Error: "Prepared statement already exists"

- This can happen with connection pooling
- Use `DIRECT_URL` for migrations: `DATABASE_URL=$DIRECT_URL npx prisma db push`

## Testing the Setup

1. Start the dev server: `npm run dev`
2. Sign in to the app
3. Take a practice test and submit it
4. Check the dashboard - you should see your attempt
5. Verify in Prisma Studio: `npm run db:studio`

## Next Steps

Once database is set up:
- ✅ User attempts are automatically saved
- ✅ Dashboard shows progress and stats
- ✅ Results page confirms attempt was saved
- ✅ Users can track improvement over time

For production, consider:
- Setting up automated backups
- Monitoring database performance
- Adding indexes for frequently queried fields (already included in schema)

