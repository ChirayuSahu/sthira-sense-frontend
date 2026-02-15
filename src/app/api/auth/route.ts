import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const BACKEND_URL = process.env.BACKEND_URL
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (token) {
    const response = NextResponse.redirect(new URL(`/dashboard`, request.url))
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    })
    return response
  }

  return NextResponse.redirect(new URL(`/login`, request.url))
}
