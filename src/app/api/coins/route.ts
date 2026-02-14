import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether,usd-coin,dai,binance-usd,true-usd,frax,pax-dollar,gemini-dollar,neutrino-usd,musd"
  )
  const data = await res.json()

  const finalRes = {
    data,
    success: res.ok,
    message: "Coin data fetched successfully",
  }

  return NextResponse.json(finalRes)
}
