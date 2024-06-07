import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (typeof window === 'undefined') {
    const authSession = request.cookies.get('auth_session')
    const isAuthorised = request.cookies.get('isAuthorisedTo')

    if (!authSession && /(\/access|\/trpc|\/tree)/.test(request.url) && !isAuthorised) {
      console.log('Redirecting to /access')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)",
    "/access:path*",
  ]
};
