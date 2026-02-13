"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  CategoryScale,
} from "chart.js"
import "chartjs-adapter-date-fns"
import { Line } from "react-chartjs-2"
import { Loader2 } from "lucide-react"

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend
)

type ChartDataType = {
  timestamp: number[]
  close: (number | null)[]
}

export default function USDCMountainChart() {
  const [chartData, setChartData] = useState<any>(null)
  const [ready, setReady] = useState(false)

  const today = Math.floor(Date.now() / 1000)
  const yesterday = today - 24 * 60 * 60

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/sample?period1=${yesterday}&period2=${today}&interval=30m`)
      const json: ChartDataType = await res.json()

      const formatted = json.timestamp
        .map((t, i) => {
          const value = json.close[i]
          if (value == null) return null

          return {
            x: new Date(t * 1000),
            y: value,
          }
        })
        .filter(Boolean)

      setChartData({
        datasets: [
          {
            label: "USDC",
            data: formatted,
            borderColor: "#2563EB",
            borderWidth: 3,
            tension: 0,
            fill: true,
            pointRadius: 0,
            borderJoinStyle: "round",
            backgroundColor: (context: any) => {
              const chart = context.chart
              const { ctx, chartArea } = chart
              if (!chartArea) return

              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)

              gradient.addColorStop(0, "rgba(37,99,235,0.35)")
              gradient.addColorStop(1, "rgba(37,99,235,0.02)")

              return gradient
            },
          },
        ],
      })

      // wait one frame before rendering chart
      requestAnimationFrame(() => {
        setReady(true)
      })
    }

    fetchData()
  }, [])

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "time",
        grid: {
          display: false,
          drawOnChartArea: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawOnChartArea: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },

    interaction: {
      mode: "nearest",
      intersect: false,
    },
  }

  if (!chartData) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <Line data={chartData} options={options} />
    </div>
  )
}
