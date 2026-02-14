"use client"

import React, { useState, useEffect } from "react"
import { FNGResponse } from "@/types/fng"
import DataCard from "./custom-card"
import RiskMeter from "./risk-meter"
import { Card } from "../ui/card"
import { Car } from "lucide-react"

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
    <Card className="flex w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
      <RiskMeter value={value} />
      <p className="text-lg font-medium text-gray-800">
        {fngData?.value_classification || "No data available"}
      </p>
    </Card>
  )
}

export default FNGCard
