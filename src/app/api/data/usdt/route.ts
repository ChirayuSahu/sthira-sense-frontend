import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const res = await fetch("https://sthirasense.onrender.com/v1/data/usdt")
  const data = await res.json()

  return NextResponse.json(data)
}
