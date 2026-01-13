import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/features',
  '/test',
  '/about',
  '/contact',
  '/escuelas(.*)', // All school pages (directory, individual schools, and update forms)
  '/para-escuelas', // For nautical schools page
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
];

// Only allow debug routes in development
if (process.env.NODE_ENV === 'development') {
  publicRoutes.push('/debug(.*)');
}

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except the ones defined as public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

