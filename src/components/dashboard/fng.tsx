"use client"

import React, { useState, useEffect } from "react"
import { Card } from "../ui/card"
import { FNGResponse } from "@/types/fng"

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
    <Card className="flex w-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8">
      <div>
        <p className="text-sm font-medium tracking-wide text-gray-500">Fear & Greed Index</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-20 rounded-md bg-gray-200" />
          <div className="h-4 w-40 rounded-md bg-gray-200" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-semibold text-black">{value}</span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>

          <p className="text-lg font-medium text-gray-800">{fngData?.value_classification}</p>

          <p className="mt-4 text-xs text-gray-400">Last updated: {timestamp}</p>
        </div>
      )}
    </Card>
  )
}

export default FNGCard
