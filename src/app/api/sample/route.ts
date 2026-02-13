import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(request.url)

  const response = await fetch(
    `https://query2.finance.yahoo.com/v8/finance/chart/USDC-USD?${searchParams.toString()}`
  )

  const data: any = await response.json()

  const formatted = {
    timestamp: data.chart.result[0].timestamp,
    close: data.chart.result[0].indicators.quote[0].close,
    high: data.chart.result[0].indicators.quote[0].high,
    low: data.chart.result[0].indicators.quote[0].low,
    open: data.chart.result[0].indicators.quote[0].open,
    volume: data.chart.result[0].indicators.quote[0].volume,
  }

  return NextResponse.json(formatted)
}
