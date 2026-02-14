import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = (await cookies()).get("token")?.value

  const protectedRoutes = ["/dashboard"]
  const authRoutes = ["/login"]

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
