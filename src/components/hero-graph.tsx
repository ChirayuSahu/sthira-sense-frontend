"use client"

import { useEffect, useState } from "react"
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

  const today = Math.floor(Date.now() / 1000)
  const yesterday = today - 24 * 60 * 60

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sample?period1=${yesterday}&period2=${today}&interval=30m`)
        const json: ChartDataType = await res.json()

        const formatted = json.timestamp
          .map((t, i) => {
            const v = json.close[i]
            if (v == null) return null
            return { time: t, value: v }
          })
          .filter(Boolean)

        setData(formatted as { time: number; value: number }[])
      } catch (error) {
        console.error("Failed to fetch graph data", error)
      }
    }

    fetchData()
  }, [today, yesterday])

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

            <YAxis domain={[0.9995, 1.0001]} hide />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  hideLabel
                  formatter={(value) => `USD $${Number(value).toFixed(10)}`}
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
