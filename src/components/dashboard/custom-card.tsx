"use client"

import React from "react"
import { Card } from "../ui/card"
import AnimatedCounter from "../ui/animate-number"

const DataCard = ({
  loading,
  value,
  description,
  timestamp,
}: {
  loading: boolean
  value: number
  description: string
  timestamp: Date
}) => {
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
            <AnimatedCounter
              value={value}
              className="text-5xl font-semibold text-black"
              decimals={2}
            />
            <span className="text-sm text-gray-400">/ 100</span>
          </div>

          <p className="text-lg font-medium text-gray-800">{description}</p>

          <p className="mt-4 text-xs text-gray-400">Last updated: {timestamp.toLocaleString()}</p>
        </div>
      )}
    </Card>
  )
}

export default DataCard
