"use client"

import React, { useState, useEffect } from "react"
import { FNGResponse } from "@/types/fng"
import DataCard from "./custom-card"

const FNGCard = () => {
  const [loading, setLoading] = useState(true)
  const [fngData, setFngData] = useState<FNGResponse["data"] | null>(null)

  useEffect(() => {
    const fetchFNGData = async () => {
      try {
        const res = await fetch("/api/fng", {
          cache: "default",
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
    <DataCard
      loading={loading}
      value={value}
      description={fngData?.value_classification || ""}
      timestamp={new Date(timestamp)}
    />
  )
}

export default FNGCard
