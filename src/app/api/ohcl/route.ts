import { NextRequest, NextResponse } from "next/server"

const BASE_URL = `https://query2.finance.yahoo.com/v8/finance`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "USDT-USD"

  try {
    const res = await fetch(`${BASE_URL}/chart/${symbol}?${searchParams.toString()}`)
    const data = await res.json()

    const formatted = {
      success: res.ok,
      message: `OHLC data fetched successfully for symbol ${symbol}`,
      data: {
        timestamp: data.chart.result[0].timestamp,
        close: data.chart.result[0].indicators.quote[0].close,
        high: data.chart.result[0].indicators.quote[0].high,
        low: data.chart.result[0].indicators.quote[0].low,
        open: data.chart.result[0].indicators.quote[0].open,
        volume: data.chart.result[0].indicators.quote[0].volume,
      },
    }

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Failed to fetch OHLC data", error)
    return NextResponse.json(
      { success: false, message: `Failed to fetch data for symbol ${symbol}` },
      { status: 500 }
    )
  }
}
