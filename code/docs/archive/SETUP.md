# Quick Setup Guide

Follow these steps to get your application running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Clerk Authentication

### Create a Clerk Account
1. Go to https://dashboard.clerk.com/
2. Click "Add application" or create a new one
3. Choose your authentication methods (Email, Google, GitHub, etc.)

### Get Your API Keys
1. In the Clerk Dashboard, go to "API Keys"
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

### Configure Environment Variables
1. Create a file named `.env.local` in the project root
2. Add the following content (replace with your actual keys):

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs (keep these as is)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app/dashboard
```

## Step 3: Run the Development Server

```bash
npm run dev
```

The application will start at http://localhost:3000

## Step 4: Test the Application

### Test Public Pages
1. Visit http://localhost:3000 - You should see the landing page
2. Navigate to /features and /pricing - No authentication required

### Test Authentication
1. Click "Get Started" or "Sign Up"
2. Create a test account using email or social login
3. You should be redirected to /app/dashboard

### Test Protected Routes
1. Try accessing /app/dashboard while signed in - Should work
2. Sign out using the user button
3. Try accessing /app/dashboard while signed out - Should redirect to sign-in

## Troubleshooting

### "Invalid API Key" Error
- Double-check your Clerk API keys in `.env.local`
- Make sure you're using the correct keys (test vs production)
- Restart the dev server after changing `.env.local`

### Authentication Not Working
- Verify your Clerk application is active in the dashboard
- Check that environment variables are loaded (restart dev server)
- Clear your browser cookies and try again

### Pages Not Loading
- Check the terminal for any error messages
- Make sure all dependencies are installed (`npm install`)
- Verify you're using Node.js version 18 or higher

## Next Steps

### Customize Your App
1. Update branding: Change "Nauti.co" to your app name
2. Modify colors: Update Tailwind classes (currently blue-600)
3. Add features: Create new pages under `src/app/app/`
4. Customize dashboard: Edit `src/app/app/dashboard/page.tsx`

### Add More Features
- Database integration (Prisma, Drizzle, etc.)
- Email notifications
- Subscription billing (Stripe)
- API routes
- Background jobs

## Resources

- [Clerk Quick Start Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Need Help?

- Check the main README.md for more details
- Visit Clerk documentation: https://clerk.com/docs
- Visit Next.js documentation: https://nextjs.org/docs

