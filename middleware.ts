import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userRole = req.cookies.get("userRole")?.value || "Student"; // Assuming default is "Student" if not set

  if (req.nextUrl.pathname.startsWith("/qrscanner") && userRole !== "SBO") {
    // If not SBO, redirect to the user dashboard
    return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
}

// Tell Next.js to apply this middleware on certain routes
export const config = {
  matcher: ["/qrscanner", "/user"],
};
