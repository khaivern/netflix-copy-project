import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { verifyTokenCookie } from "../lib/cookies";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  let pathname = req.nextUrl.pathname;
  const token = req ? req.cookies.token : null;
  // const userId = verifyTokenCookie(token);
  if (token || pathname.includes("/api/login") || pathname.includes("/static/"))
    return NextResponse.next();
  else if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
