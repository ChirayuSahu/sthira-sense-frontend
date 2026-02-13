import React from "react"
import CustomGraph from "@/components/graph"
import { Card } from "../ui/card"

const GraphCard = () => {
  return (
    <Card className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white py-0! shadow-sm">
      <CustomGraph
        symbol="USDT-USD"
        period1={Math.floor(Date.now() / 1000) - 1 * 60 * 60}
        period2={Math.floor(Date.now() / 1000)}
        interval="5m"
      />
    </Card>
  )
}

export default GraphCard
