# 🚀 Quick Start Guide

## Get Running in 5 Minutes

### Step 1: Install (30 seconds)
```bash
npm install
```

### Step 2: Get Clerk Keys (2 minutes)
1. Visit: https://dashboard.clerk.com/
2. Click "Add application"
3. Copy your keys from the API Keys page

### Step 3: Configure Environment (1 minute)
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app/dashboard
```

### Step 4: Run (30 seconds)
```bash
npm run dev
```

### Step 5: Test (1 minute)
1. Open http://localhost:3000
2. Click "Get Started"
3. Create an account
4. See your dashboard!

---

## 📁 What You Got

### Public Pages (No Login Required)
- **/** - Beautiful landing page
- **/features** - Feature showcase
- **/pricing** - Pricing tiers
- **/sign-in** - User login
- **/sign-up** - User registration

### Protected Pages (Login Required)
- **/app/dashboard** - Main dashboard
- **/app/settings** - User settings

---

## 🎨 Customize Your App

### Change the Name
Replace "Nauti.co" in these files:
- `src/components/MarketingNav.tsx`
- `src/components/AppNav.tsx`
- `src/app/layout.tsx` (metadata)

### Change Colors
Find and replace `blue-600` with your color:
- `blue-500`, `blue-700` for shades
- Or use: `purple-600`, `green-600`, `red-600`, etc.

### Add a New Page

**Public Page:**
```bash
# Create file
src/app/about/page.tsx

# Add to middleware.ts public routes
'/about'
```

**Protected Page:**
```bash
# Create file (automatically protected)
src/app/app/profile/page.tsx
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Git
git add .
git commit -m "Your message"
git push
```

---

## 📚 Documentation

- **Full Setup**: See `SETUP.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Overview**: See `PROJECT_OVERVIEW.md`
- **Complete Docs**: See `README.md`

---

## 🆘 Troubleshooting

### "Invalid API Key"
- Check your `.env.local` file
- Make sure keys start with `pk_test_` and `sk_test_`
- Restart dev server: `Ctrl+C` then `npm run dev`

### Can't Access Dashboard
- Make sure you're signed in
- Check browser console for errors
- Clear cookies and try again

### Page Not Found
- Check file is in correct directory
- Restart dev server
- Check for typos in URL

---

## ✅ Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Created Clerk account
- [ ] Added API keys to `.env.local`
- [ ] Started dev server (`npm run dev`)
- [ ] Tested sign up flow
- [ ] Accessed dashboard
- [ ] Customized branding
- [ ] Ready to build features!

---

## 🎯 Next Steps

1. **Customize the UI**
   - Update colors and fonts
   - Add your logo
   - Modify page content

2. **Add Features**
   - Connect a database
   - Create API routes
   - Build your app logic

3. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Add production Clerk keys

---

## 💡 Pro Tips

- Use `Ctrl+C` to stop the dev server
- Changes auto-reload in the browser
- Check terminal for error messages
- Use browser DevTools for debugging
- Clerk dashboard shows all users

---

## 🔗 Quick Links

- **Local App**: http://localhost:3000
- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Need help?** Check the other documentation files or visit the official docs!

