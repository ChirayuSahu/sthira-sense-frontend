import React from "react"
import CustomGraph from "@/components/graph"
import { Card } from "../ui/card"

const GraphCard = ({ symbol, showStat = true }: { symbol: string; showStat?: boolean }) => {
  return (
    <Card className="flex min-h-100 w-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white py-0 md:min-h-0">
      <CustomGraph
        symbol={symbol}
        period1={Math.floor(Date.now() / 1000) - 1 * 60 * 60}
        period2={Math.floor(Date.now() / 1000)}
        interval="5m"
        showStat={showStat}
      />
    </Card>
  )
}

export default GraphCard
