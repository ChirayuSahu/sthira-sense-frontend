"use client"

import { useEffect, useRef, useState } from "react"
import {
  createChart,
  ColorType,
  CandlestickSeries,
  AreaSeries,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts"
import { Badge } from "../ui/badge"
import { Loader2 } from "lucide-react"
import type { OHCLResponse } from "@/types/ohcl"
import { toast } from "sonner"

import type { Time } from "lightweight-charts"

export default function CustomCandleChart({
  symbol,
  period1,
  period2,
  interval,
  precision,
  highlightStartTime,
  highlightEndTime,
}: {
  symbol: string
  period1: number
  period2: number
  interval: string
  precision: number
  highlightStartTime?: number
  highlightEndTime?: number
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const highlightSeriesRef = useRef<ISeriesApi<"Area"> | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#0582ca",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        rightOffset: 0,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: { mode: 1 },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 400,
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderUpColor: "#15803d",
      borderDownColor: "#b91c1c",
      wickUpColor: "#14532d",
      wickDownColor: "#7f1d1d",
      borderVisible: false,
      priceFormat: {
        type: "price",
        precision: precision,
        minMove: 1 / Math.pow(10, precision),
      },
    })

    const highlightSeries = chart.addSeries(AreaSeries, {
      lineColor: "rgba(0,0,0,0)",
      topColor: "rgba(59, 130, 246, 0.25)",
      bottomColor: "rgba(59, 130, 246, 0.08)",
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    })

    chartRef.current = chart
    seriesRef.current = series
    highlightSeriesRef.current = highlightSeries

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length || !chartRef.current) return
      const { width, height } = entries[0].contentRect

      if (width > 0 && height > 0) {
        chartRef.current.applyOptions({ width, height })
        requestAnimationFrame(() => {
          chartRef.current?.timeScale().fitContent()
        })
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [precision])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/ohcl?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=${interval}`,
          {
            signal: controller.signal,
            cache: "force-cache",
          }
        )

        const json: OHCLResponse = await res.json()

        if (!res.ok) {
          toast.error(`Failed to fetch data for ${symbol}`)
          return
        }

        const formatted = json.data.timestamp
          .map((t, i) => {
            const open = json.data.open[i]
            const high = json.data.high[i]
            const low = json.data.low[i]
            const close = json.data.close[i]

            if (open == null || high == null || low == null || close == null) return null

            return { time: t, open, high, low, close }
          })
          .filter((item): item is any => item !== null)

        if (!seriesRef.current || !chartRef.current) return

        seriesRef.current.setData(formatted)

        if (highlightStartTime && highlightEndTime && highlightSeriesRef.current) {
          const clampedStart = Math.max(highlightStartTime, period1)
          const clampedEnd = Math.min(highlightEndTime, period2)

          if (clampedStart < clampedEnd) {
            chartRef.current.timeScale().setVisibleRange({
              from: clampedStart as Time,
              to: clampedEnd as Time,
            })

            const maxPrice = Math.max(...formatted.map((d) => d.high))

            const highlightData = formatted
              .filter((d) => d.time >= clampedStart && d.time <= clampedEnd)
              .map((d) => ({
                time: d.time,
                value: maxPrice,
              }))

            highlightSeriesRef.current.setData(highlightData)
          } else {
            chartRef.current.timeScale().fitContent()
          }
        } else {
          chartRef.current.timeScale().fitContent()
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch OHLC data", err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [symbol, period1, period2, interval, highlightStartTime, highlightEndTime])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Badge
        variant="outline"
        className="absolute top-2 left-2 z-10 rounded-md bg-white/80 backdrop-blur-sm"
      >
        {symbol}
      </Badge>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-xs">
          <Loader2 className="text-primary h-4 w-4 animate-spin" />
        </div>
      )}

      <div className="h-full min-h-max w-full" ref={containerRef} />
    </div>
  )
}
