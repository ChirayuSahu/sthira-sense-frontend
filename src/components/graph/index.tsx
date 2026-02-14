"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "../ui/badge"
import { Loader2 } from "lucide-react"

import type { OHCLResponse } from "@/types/ohcl"

const chartConfig = {
  desktop: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function CustomGraph({
  symbol,
  period1,
  period2,
  interval,
  type = "linear",
  showStat = true,
}: {
  symbol: string
  period1: number
  period2: number
  interval: string
  type?: "linear" | "monotone"
  showStat?: boolean
}) {
  const [data, setData] = useState<{ time: number; value: number }[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/ohcl?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=${interval}`,
          {
            signal: controller.signal,
          }
        )

        const json: OHCLResponse = await res.json()

        const formatted = json.data.timestamp
          .map((t, i) => {
            const v = json.data.close[i]
            if (v == null) return null
            return { time: t, value: v }
          })
          .filter((item): item is { time: number; value: number } => Boolean(item))

        setData(formatted)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to fetch graph data", error)
        }
      }
    }

    fetchData()
    return () => controller.abort()
  }, [symbol, period1, period2, interval])

  // ✅ Calculate Change
  const lastValue = data[data.length - 1]?.value
  const prevValue = data[data.length - 2]?.value

  let change = 0
  let percent = 0

  if (lastValue != null && prevValue != null) {
    change = lastValue - prevValue
    percent = (change / prevValue) * 100
  }

  const isUp = change > 0
  const isDown = change < 0

  return (
    <div className="relative h-full w-full">
      {/* Top Badge Section */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <Badge variant="outline" className="rounded-md bg-white">
          {symbol}
        </Badge>

        {showStat && data.length > 1 && (
          <Badge
            className={`rounded-md font-medium text-white ${
              isUp ? "bg-green-500" : isDown ? "bg-red-500" : "bg-gray-400"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "–"} {percent.toFixed(2)}%
          </Badge>
        )}
      </div>

      {/* Loader */}
      {data.length === 0 && (
        <div className="text-muted-foreground flex h-full min-h-20 w-full animate-pulse items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}

      {/* Chart */}
      {data.length > 0 && (
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              top: 30,
              left: 0,
              right: 0,
            }}
          >
            <XAxis dataKey="time" tickLine={false} axisLine={false} hide />

            <YAxis domain={[(dataMin: number) => dataMin, (dataMax: number) => dataMax]} hide />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  hideLabel
                  formatter={(value) => `USD $${Number(value).toFixed(6)}`}
                />
              }
            />

            <Area
              dataKey="value"
              fill="var(--chart-1)"
              fillOpacity={0.4}
              type={type}
              stroke="var(--chart-1)"
              animationDuration={1200}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}
