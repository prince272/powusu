import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getUser } from "./providers/user/server";
import { buildCallbackUrl } from "./utils";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const currentUser = getUser();

  if (!currentUser && request.nextUrl.pathname.startsWith("/portal")) {
    const refererUrl = request.headers.has('referer') ? new URL(request.headers.get('referer')!) : undefined;
    const callbackUrl = buildCallbackUrl({ modal: "sign-in" }, request.nextUrl, refererUrl);
 

    return NextResponse.redirect(callbackUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};
