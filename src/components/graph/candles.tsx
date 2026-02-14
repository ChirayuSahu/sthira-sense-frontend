"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
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

type RiskPrediction = {
  max_peg_deviation: number
  max_peg_deviation_pct: number
  risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  risk_score: number
  alert_required: boolean
  timestamp: string
  inference_time_ms: number
}

export default function CustomCandleChart({
  symbol,
  period1,
  period2,
  interval,
  precision,
  highlightStartTime,
  highlightEndTime,
  alerts = false,
}: {
  symbol: string
  period1: number
  period2: number
  interval: string
  precision: number
  highlightStartTime?: number
  highlightEndTime?: number
  alerts?: boolean
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const highlightSeriesRef = useRef<ISeriesApi<"Area"> | null>(null)
  const dataRef = useRef<any[]>([])

  const [loading, setLoading] = useState(true)
  const [risk, setRisk] = useState<RiskPrediction | null>({
    max_peg_deviation: 0.012345,
    max_peg_deviation_pct: 1.2345,
    risk_level: "CRITICAL",
    risk_score: 3,
    alert_required: true,
    timestamp: "2026-02-15T02:41:18.123456",
    inference_time_ms: 9.87,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: isDark ? "#171717" : "#ffffff" },
        textColor: isDark ? "#A3A3A3" : "#0582ca",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { borderVisible: false },
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

    if (dataRef.current.length > 0) {
      series.setData(dataRef.current)
      chart.timeScale().fitContent()
    }

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
          const now = Math.floor(Date.now() / 1000)
          const twoDaysAgo = now - 2 * 24 * 60 * 60

          chartRef.current?.timeScale().setVisibleRange({
            from: twoDaysAgo as Time,
            to: now as Time,
          })
        })
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [precision, isDark])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)

        const res = await fetch(
          `/api/ohcl?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=${interval}`,
          { signal: controller.signal }
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

        dataRef.current = formatted

        if (!seriesRef.current || !chartRef.current) return

        seriesRef.current.setData(formatted)
        chartRef.current.timeScale().fitContent()

        const riskRes = await fetch(`/api/risk?symbol=${symbol}`)
        const riskJson: RiskPrediction = await riskRes.json()
        setRisk(riskJson)

        if (riskJson.alert_required) {
          toast.warning(`⚠ 24h Depeg Risk Detected for ${symbol}`)
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Fetch error:", err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [symbol, period1, period2, interval])

  useEffect(() => {
    if (!chartRef.current || !risk) return

    const colors: Record<string, string> = {
      LOW: isDark ? "#064e3b" : "#ecfdf5",
      MODERATE: isDark ? "#422006" : "#fef9c3",
      HIGH: isDark ? "#7f1d1d" : "#fee2e2",
      CRITICAL: isDark ? "#450a0a" : "#fecaca",
    }

    const baseBg = isDark ? "#171717" : "#ffffff"

    chartRef.current.applyOptions({
      layout: {
        background: {
          type: ColorType.Solid,
          color: alerts ? colors[risk.risk_level] || baseBg : baseBg,
        },
      },
    })
  }, [risk, isDark, alerts])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Badge
        variant="outline"
        className="absolute top-2 left-2 z-10 rounded-md bg-white/80 backdrop-blur-sm dark:bg-neutral-800/80 dark:text-neutral-200"
      >
        {symbol}
      </Badge>

      {risk && alerts && (
        <div className="absolute top-2 right-2 z-20 w-56 space-y-2 rounded-xl border bg-white/90 p-4 text-xs text-neutral-900 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-200">
          <div className="flex justify-between">
            <span className="text-muted-foreground">24h Risk</span>
            <span className="font-semibold">{risk.risk_level}</span>
          </div>

          <div className="flex justify-between">
            <span>Risk Score</span>
            <span>{risk.risk_score}/5</span>
          </div>

          <div className="flex justify-between">
            <span>Max Deviation</span>
            <span>{risk.max_peg_deviation_pct.toFixed(2)}%</span>
          </div>

          <div className="text-muted-foreground text-[10px]">Forecast for next 24h</div>

          {risk.alert_required && toast.error(`⚠ 24h Depeg Risk Detected for ${symbol}`)}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-xs dark:bg-neutral-900/50">
          <Loader2 className="text-primary h-4 w-4 animate-spin" />
        </div>
      )}

      <div className="h-full min-h-max w-full" ref={containerRef} />
    </div>
  )
}
