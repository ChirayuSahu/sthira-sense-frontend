"use client"

import { useEffect, useState, useMemo } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type ChartDataType = {
  timestamp: number[]
  close: (number | null)[]
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function HeroGraph() {
  const [data, setData] = useState<{ time: number; value: number }[]>([])
  const { period1, period2 } = useMemo(() => {
    const end = Math.floor(Date.now() / 1000)
    const start = end - 24 * 60 * 60
    return { period1: start, period2: end }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sample?period1=${period1}&period2=${period2}&interval=30m`, {
          signal: controller.signal,
          cache: "force-cache",
        })
        const json: ChartDataType = await res.json()

        const formatted = json.timestamp
          .map((t, i) => {
            const v = json.close[i]
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
  }, [period1, period2])

  return (
    <div className="h-full w-full">
      {data.length === 0 && (
        <div className="text-muted-foreground flex h-full w-full animate-pulse items-center justify-center">
          Loading graph...
        </div>
      )}
      {data.length > 0 && (
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              top: 50,
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

            <YAxis domain={["dataMin", "dataMax"]} hide />

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
              type="linear"
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
