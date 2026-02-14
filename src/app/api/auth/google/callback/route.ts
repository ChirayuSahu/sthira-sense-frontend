import { NextResponse, NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const secret = process.env.JWT_SECRET

  if (!token || !secret) {
    const response = NextResponse.redirect(
      new URL("/login?error=Missing+token+or+secret", request.url)
    )
    return response
  }

  const decoded = jwt.verify(token, secret) as { id: string } | null

  if (!decoded || !decoded.id) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 })
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url))
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    sameSite: "lax",
  }) // 7 days

  return response
}
