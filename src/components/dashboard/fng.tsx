"use client"

import React, { useState, useEffect } from "react"
import { FNGResponse } from "@/types/fng"
import RiskMeter from "./risk-meter"
import { Card } from "../ui/card"

const FNGCard = () => {
  const [loading, setLoading] = useState(true)
  const [fngData, setFngData] = useState<FNGResponse["data"] | null>(null)

  useEffect(() => {
    const fetchFNGData = async () => {
      try {
        const res = await fetch("/api/fng", {
          cache: "force-cache",
        })

        const data: FNGResponse = await res.json()
        setFngData(data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFNGData()
  }, [])

  const value = fngData ? Number(fngData.value) : 0
  const timestamp = fngData ? new Date(Number(fngData.timestamp) * 1000).toLocaleString() : ""

  return (
    <Card className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
      <RiskMeter value={value} />
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium text-gray-800 dark:text-neutral-200">
          {fngData?.value_classification || "No data available"}
        </p>
        <p className="mt-4 text-xs text-gray-400">
          Last updated: {new Date(timestamp).toLocaleString("en-GB")}
        </p>
      </div>
    </Card>
  )
}

export default FNGCard
