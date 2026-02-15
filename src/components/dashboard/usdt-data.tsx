"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import GraphCard from "./graph-card"

interface USDTData {
  id: string
  max_peg_deviation: number
  max_peg_deviation_pct: number
  risk_level: string
  risk_score: number
  depeg_predicted: boolean
  depeg_probability: number
  confidence_level: string
  threshold_used: number
  inference_time_ms_1: number
  inference_time_ms_2: number
  risk_classification: string
  timestamp_1: string
}

export default function USDTRiskCard() {
  const [data, setData] = useState<USDTData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data/usdt")
        const json = await res.json()

        if (!json.success) {
          throw new Error("Failed to fetch USDT data")
        }

        // your response structure is data.data.data
        setData(json.data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
        <CardContent>Loading USDT data...</CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="rounded-2xl border border-gray-200 bg-white p-6 text-red-500 dark:border-neutral-800 dark:bg-neutral-900">
        <CardContent>Error: {error}</CardContent>
      </Card>
    )
  }

  const isSafe = data.risk_classification === "NORMAL"

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              USDT Risk Monitor
            </h2>
            <Badge className={isSafe ? "bg-green-600" : "bg-red-600"}>
              {data.risk_classification}
            </Badge>
          </div>

          {/* Risk Score */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Risk Level</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                {data.risk_level}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {data.risk_score}/10
              </span>
            </div>
          </div>

          {/* Peg Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-neutral-400">Max Deviation</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {data.max_peg_deviation}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-neutral-400">Deviation %</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {data.max_peg_deviation_pct}%
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-neutral-400">Depeg Probability</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {data.depeg_probability}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-neutral-400">Threshold</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.threshold_used}</p>
            </div>
          </div>

          {/* Prediction */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-neutral-700">
            <span className="text-sm text-gray-500 dark:text-neutral-400">Depeg Predicted</span>
            <span className={data.depeg_predicted ? "text-red-500" : "text-green-500"}>
              {data.depeg_predicted ? "YES" : "NO"}
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 text-xs text-gray-400 dark:text-neutral-500">
            Updated: {new Date(data.timestamp_1).toUTCString()}
          </div>
        </CardContent>
      </Card>
      <GraphCard
        type="monotone"
        symbol="USDT-USD"
        showStat={false}
        showPrediction={true}
        predictionDeviation={data.max_peg_deviation}
      />
    </div>
  )
}
