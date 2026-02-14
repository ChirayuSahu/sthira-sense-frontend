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
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function CustomGraph({
  symbol,
  period1,
  period2,
  interval,
  type = "linear",
}: {
  symbol: string
  period1: number
  period2: number
  interval: string
  type?: "linear" | "monotone"
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
            cache: "force-cache",
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

  return (
    <div className="relative h-full w-full">
      <Badge variant="outline" className="absolute top-2 left-2 z-10 rounded-md bg-white">
        {symbol}
      </Badge>
      {data.length === 0 && (
        <div className="text-muted-foreground flex h-full min-h-20 w-full animate-pulse items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
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
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()}
              hide
            />

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
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}
