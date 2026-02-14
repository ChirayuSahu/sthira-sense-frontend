import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const BACKEND_URL = process.env.BACKEND_URL
  const response = NextResponse.redirect(new URL(`${BACKEND_URL}/v1/auth/google`, request.url))

  return response
}
