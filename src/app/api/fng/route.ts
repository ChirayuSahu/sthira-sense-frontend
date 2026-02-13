import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const res = await fetch("https://api.alternative.me/fng/")
  const data = await res.json()

  const finalRes = {
    success: res.ok,
    message: "Fear and Greed Index data fetched successfully",
    data: data.data[0],
  }

  return NextResponse.json(finalRes)
}
