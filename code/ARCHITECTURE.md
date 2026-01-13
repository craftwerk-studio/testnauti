# Architecture Documentation

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Visits Site                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Middleware Check                            │
│              (src/middleware.ts)                             │
│                                                              │
│  • Checks if route is public or protected                   │
│  • Validates authentication status                           │
└────────────┬────────────────────────┬───────────────────────┘
             │                        │
    Public Route                Protected Route
             │                        │
             ▼                        ▼
┌─────────────────────┐    ┌──────────────────────┐
│  Marketing Pages    │    │  Is Authenticated?   │
│                     │    └──────┬───────┬───────┘
│  • / (Landing)      │           │       │
│  • /features        │          Yes     No
│  • /pricing         │           │       │
│  • /sign-in         │           │       ▼
│  • /sign-up         │           │  Redirect to
└─────────────────────┘           │   /sign-in
                                  │
                                  ▼
                        ┌──────────────────┐
                        │  Protected App   │
                        │                  │
                        │  • /app/dashboard│
                        │  • /app/settings │
                        └──────────────────┘
```

## Component Hierarchy

```
Root Layout (ClerkProvider)
│
├── Marketing Pages
│   ├── MarketingNav
│   │   ├── Logo
│   │   ├── Navigation Links
│   │   └── Auth Buttons (SignedIn/SignedOut)
│   │
│   └── Page Content
│       ├── / (Landing)
│       ├── /features
│       └── /pricing
│
├── Auth Pages
│   ├── /sign-in (Clerk Component)
│   └── /sign-up (Clerk Component)
│
└── Protected App Area
    ├── App Layout
    │   └── AppNav
    │       ├── Logo
    │       ├── Navigation Links
    │       └── UserButton
    │
    └── Page Content
        ├── /app/dashboard
        └── /app/settings
```

## Authentication Flow

```
┌──────────────┐
│ User clicks  │
│ "Get Started"│
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  /sign-up page   │
│  (Clerk handles  │
│   the form)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User completes   │
│  registration    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Clerk creates    │
│ session & token  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Redirect to      │
│ /app/dashboard   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Middleware       │
│ validates token  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Dashboard loads  │
│ with user data   │
└──────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   React      │    │   Clerk      │    │   UI         │  │
│  │  Components  │◄──►│   Hooks      │◄──►│  Components  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │         │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server                            │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Middleware  │    │  API Routes  │    │  Server      │  │
│  │  (Auth)      │    │  (Future)    │    │  Components  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │         │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Clerk      │    │   Database   │    │   APIs       │  │
│  │   API        │    │   (Future)   │    │   (Future)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Route Protection Strategy

### Middleware Configuration

The middleware uses a matcher pattern to protect routes:

```typescript
// Public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

// All other routes require authentication
if (!isPublicRoute(request)) {
  await auth.protect();
}
```

### Route Types

1. **Public Routes**: Accessible to everyone
   - Marketing pages
   - Authentication pages
   - Public API endpoints

2. **Protected Routes**: Require authentication
   - All `/app/*` routes
   - User-specific pages
   - Protected API endpoints

3. **Hybrid Routes**: Behavior changes based on auth status
   - Navigation shows different options
   - Content adapts to user state

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Clerk Authentication
├── JWT token validation
├── Session management
├── Multi-factor authentication (optional)
└── Social login providers

Layer 2: Next.js Middleware
├── Route protection
├── Token verification
├── Redirect handling
└── Request filtering

Layer 3: Server Components
├── Server-side auth checks
├── Data access control
└── API route protection

Layer 4: Environment Variables
├── Secret key management
├── API key security
└── Configuration isolation
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CDN/Edge                             │
│                    (Vercel Edge Network)                     │
│                                                              │
│  • Static assets cached                                      │
│  • Middleware runs at edge                                   │
│  • Fast global delivery                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Serverless Functions                      │
│                    (Vercel Functions)                        │
│                                                              │
│  • Server Components                                         │
│  • API Routes                                                │
│  • Dynamic rendering                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│                                                              │
│  ┌──────────────┐        ┌──────────────┐                   │
│  │    Clerk     │        │   Database   │                   │
│  │    (Auth)    │        │   (Future)   │                   │
│  └──────────────┘        └──────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## State Management

Currently, the application uses:

1. **Clerk State**: User authentication state
   - Managed by Clerk hooks and components
   - Automatically synced across components
   - Persisted in secure cookies

2. **React State**: Component-level state
   - Local UI state
   - Form inputs
   - Temporary data

3. **Server State**: Server-side data (Future)
   - Database queries
   - API responses
   - Cached data

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                   Performance Features                       │
└─────────────────────────────────────────────────────────────┘

1. Next.js App Router
   ├── Automatic code splitting
   ├── Server Components (reduce JS bundle)
   ├── Streaming SSR
   └── Route prefetching

2. Static Generation
   ├── Marketing pages pre-rendered
   ├── Fast initial load
   └── SEO optimized

3. Edge Middleware
   ├── Fast auth checks
   ├── Reduced latency
   └── Global distribution

4. Tailwind CSS
   ├── Purged unused styles
   ├── Minimal CSS bundle
   └── JIT compilation
```

## Scalability Considerations

### Current Setup (MVP)
- Serverless functions (auto-scaling)
- Edge middleware (global)
- Clerk (handles auth load)
- Static assets on CDN

### Future Enhancements
1. **Database**: Add Postgres/MongoDB
2. **Caching**: Redis for session/data
3. **Queue**: Background job processing
4. **CDN**: Image optimization
5. **Monitoring**: Error tracking & analytics

## Development Workflow

```
Local Development
       │
       ▼
┌──────────────┐
│   npm run    │
│     dev      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Hot reload  │
│  enabled     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Test in     │
│  browser     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Commit to   │
│  Git         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Push to     │
│  GitHub      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Vercel      │
│  auto-deploy │
└──────────────┘
```

## Technology Decisions

### Why Next.js?
- ✅ Full-stack React framework
- ✅ Excellent developer experience
- ✅ Built-in optimization
- ✅ Vercel deployment integration
- ✅ Large ecosystem

### Why Clerk?
- ✅ Drop-in authentication
- ✅ Beautiful pre-built UI
- ✅ Social login support
- ✅ MFA out of the box
- ✅ Great documentation

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ Rapid development
- ✅ Consistent design system
- ✅ Small production bundle
- ✅ Easy customization

### Why TypeScript?
- ✅ Type safety
- ✅ Better IDE support
- ✅ Fewer runtime errors
- ✅ Self-documenting code
- ✅ Easier refactoring

---

This architecture is designed to be:
- **Scalable**: Can grow with your needs
- **Secure**: Multiple layers of protection
- **Fast**: Optimized for performance
- **Maintainable**: Clean, organized code
- **Developer-friendly**: Great DX with modern tools

