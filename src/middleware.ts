import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get('auth_session')
  if (!authSession && /(\/access|\/trpc)/.test(request.url)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  //
  // const siteUrl = process.env.NEXT_PUBLIC_APP_URL
  //
  // if (user?.value && request.url === `${siteUrl}/login`) {
  //   return NextResponse.redirect(new URL('/admin', request.url))
  // }

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
