import { NextResponse, NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const secret = process.env.JWT_SECRET

  if (!token || !secret) {
    return NextResponse.json(
      { success: false, message: "Missing token or secret" },
      { status: 400 }
    )
  }

  const decoded = jwt.verify(token, secret) as { id: string }

  if (!decoded || !decoded.id) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 })
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url))
  response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 }) // 7 days

  return response
}
