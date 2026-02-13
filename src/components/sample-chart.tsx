"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, ColorType, AreaSeries, UTCTimestamp } from "lightweight-charts"

type CandleData = {
  timestamp: number[]
  close: (number | null)[]
}

export default function AreaChart() {
  const [data, setData] = useState<CandleData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/sample?period1=1768156200&period2=1770921000&interval=1h")
      const json = await res.json()

      setData({
        timestamp: json.timestamp,
        close: json.close,
      })
    }

    fetchData()
  }, [])

  // Render chart
  useEffect(() => {
    if (!containerRef.current || !data) return

    if (chartRef.current) chartRef.current.remove()

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: "#0f172a" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
    })

    chartRef.current = chart

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#3b82f6",
      topColor: "rgba(59,130,246,0.4)",
      bottomColor: "rgba(59,130,246,0.05)",
      lineWidth: 2,
    })

    const formatted = data.timestamp
      .map((t, i) => {
        const c = data.close[i]
        if (c == null) return null

        return {
          time: t as UTCTimestamp,
          value: c,
        }
      })
      .filter(Boolean)

    areaSeries.setData(formatted as any)

    chart.timeScale().fitContent()

    const handleResize = () => {
      chart.applyOptions({
        width: containerRef.current!.clientWidth,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [data])

  return (
    <div className="h-full w-full">
      {!data && <div className="p-6 text-center text-white">Loading chart...</div>}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}
