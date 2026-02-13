"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts"
import { Badge } from "../ui/badge"
import { Loader2 } from "lucide-react"
import type { OHCLResponse } from "@/types/ohcl"
import { toast } from "sonner"

export default function CustomCandleChart({
  symbol,
  period1,
  period2,
  interval,
  precision,
}: {
  symbol: string
  period1: number
  period2: number
  interval: string
  precision: number
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)

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
      crosshair: {
        mode: 1,
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    })

    chartRef.current = chart

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
        minMove: 0.00000001,
      },
    })

    seriesRef.current = series

    const handleResize = () => {
      if (!containerRef.current) return
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return

      const { width, height } = entries[0].contentRect

      chart.applyOptions({ width, height })
      chart.timeScale().fitContent()
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [])

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
          toast.error(`Failed to fetch OHLC data for ${symbol}`)
          console.log("Error fetching OHLC data:", json)
          return
        }

        const formatted = json.data.timestamp
          .map((t, i) => {
            const open = json.data.open[i]
            const high = json.data.high[i]
            const low = json.data.low[i]
            const close = json.data.close[i]

            if (open == null || high == null || low == null || close == null) return null

            return {
              time: t,
              open,
              high,
              low,
              close,
            }
          })
          .filter(Boolean)

        if (seriesRef.current) {
          seriesRef.current.setData(formatted)
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
  }, [symbol, period1, period2, interval])

  return (
    <div className="relative h-full min-h-125 w-full overflow-hidden">
      <Badge variant="outline" className="absolute top-2 left-2 z-10 rounded-md bg-white">
        {symbol}
      </Badge>

      {loading && (
        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}
