import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { verifyTokenCookie } from "../lib/cookies";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  let url = req.nextUrl.clone();
  const pathname = url.pathname;

  const token = req ? req.cookies.token : null;
  const userId = token && verifyTokenCookie(token);
  if (userId || pathname.includes("/api/login") || pathname.includes("/static/"))
    return NextResponse.next();
  if (!token && pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
