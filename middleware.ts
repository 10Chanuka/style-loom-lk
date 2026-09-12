import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Support manual navigation to styleloomlk.live/Admin or styleloomlk.live/Admin/login
  if (url.pathname === "/Admin" || url.pathname.startsWith("/Admin/")) {
    url.pathname = url.pathname.replace(/^\/Admin/, "/admin");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Admin", "/Admin/:path*"],
};
