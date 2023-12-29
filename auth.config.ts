import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log("pathname --",nextUrl.pathname);
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnCompiler = nextUrl.pathname.startsWith('/compiler');
      console.log("isLoggedIn", isLoggedIn, isOnDashboard)
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      } else if(isOnCompiler) {
        return Response.redirect(new URL('/compiler', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;