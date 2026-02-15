"use client"

import { useEffect, useMemo, useState } from "react"
import { Area, AreaChart, XAxis, YAxis, Line, ReferenceLine } from "recharts"

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
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
  prediction: {
    label: "Predicted Deviation",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function CustomGraph({
  symbol,
  period1,
  period2,
  interval,
  type = "linear",
  showStat = true,
  showPrediction = false,
  predictedDeviation, // optional value from API
}: {
  symbol: string
  period1: number
  period2: number
  interval: string
  type?: "linear" | "monotone"
  showStat?: boolean
  showPrediction?: boolean
  predictedDeviation?: number
}) {
  const [data, setData] = useState<{ time: number; value: number }[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/ohcl?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=${interval}`,
          { signal: controller.signal }
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

  // ===============================
  // PRICE STATS
  // ===============================

  const lastValue =
    showPrediction && predictedDeviation ? 1 + predictedDeviation : data[data.length - 1]?.value
  const prevValue =
    showPrediction && predictedDeviation
      ? data[data.length - 1]?.value
      : data[data.length - 2]?.value

  let change = 0
  let percent = 0

  if (lastValue != null && prevValue != null) {
    change = lastValue - prevValue
    percent = (change / prevValue) * 100
  }

  const isUp = change > 0
  const isDown = change < 0
  const chartColor = !showPrediction
    ? isUp
      ? "#22c55e"
      : isDown
        ? "#ef4444"
        : "#9ca3af"
    : "#9ca3af"

  // ===============================
  // FUTURE PREDICTION DATA
  // ===============================

  const extendedData = useMemo(() => {
    if (!showPrediction || !predictedDeviation || data.length === 0) {
      return data
    }

    const lastTime = data[data.length - 1].time
    const futureTime = lastTime + 60 * 60 * 1000 // +1 hour (adjustable)

    return [
      ...data,
      {
        time: futureTime,
        value: lastValue! * (1 + predictedDeviation),
      },
    ]
  }, [data, showPrediction, predictedDeviation, lastValue])

  return (
    <div className="relative h-full w-full">
      {/* Top Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <Badge
          variant="outline"
          className="rounded-md bg-white dark:bg-neutral-800 dark:text-neutral-200"
        >
          {symbol}
        </Badge>

        {showStat && data.length > 1 && (
          <Badge
            className={`rounded-md bg-white font-medium dark:bg-neutral-800 ${
              isUp
                ? "border border-green-500 text-green-500"
                : isDown
                  ? "border border-red-500 text-red-500"
                  : "border border-gray-400 text-gray-400"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "–"} {percent.toFixed(2)}%
          </Badge>
        )}

        {showPrediction && predictedDeviation != null && (
          <Badge className="rounded-md border border-gray-200 bg-white text-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            Predicted: {(predictedDeviation * 100).toFixed(4)}%
          </Badge>
        )}
      </div>

      {/* Loading */}
      {data.length === 0 && (
        <div className="text-muted-foreground flex h-full min-h-20 w-full animate-pulse items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}

      {/* Chart */}
      {data.length > 0 && (
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <AreaChart
            className={showPrediction ? "animate-pulse" : ""}
            accessibilityLayer
            data={extendedData}
            margin={{ top: 30, left: 0, right: 0 }}
          >
            <XAxis dataKey="time" hide />
            <YAxis
              domain={[(dataMin: number) => dataMin * 0.999, (dataMax: number) => dataMax * 1.001]}
              hide
            />

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

            {/* Historical Price */}
            <Area
              dataKey="value"
              fill={chartColor}
              fillOpacity={0.4}
              type={type}
              stroke={chartColor}
              animationDuration={1200}
              animationEasing="ease-in-out"
            />

            {/* Future Prediction Line */}
            {showPrediction && predictedDeviation != null && (
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeDasharray="6 4"
                dot={false}
              />
            )}

            {/* Split Marker */}
            {showPrediction && (
              <ReferenceLine x={data[data.length - 1].time} stroke="#999" strokeDasharray="3 3" />
            )}
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}
