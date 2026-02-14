export const runtime = "nodejs"

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

  console.log("Decoded JWT:", decoded, token)

  const response = NextResponse.redirect(new URL("/dashboard", request.url))
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  // 7 days

  return response
}
