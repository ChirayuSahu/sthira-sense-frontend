import React from "react"
import FNGCard from "@/components/dashboard/fng"
import GraphCard from "@/components/dashboard/graph-card"
import CustomCandleChart from "@/components/graph/candles"
import { Card } from "@/components/ui/card"

const Dashboard = () => {
  return (
    <div className="flex min-h-full w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FNGCard />
        <GraphCard symbol="USDT-USD" />
        <GraphCard symbol="USDC-USD" />
        <GraphCard symbol="BTC-USD" />
      </div>
      <Card style={{ minHeight: "100%" }} className="min-h-full w-full flex-1 overflow-hidden py-0">
        <CustomCandleChart
          symbol="USDT-USD"
          period1={Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60}
          period2={Math.floor(Date.now() / 1000)}
          interval="1h"
          precision={8}
        />
      </Card>
      {/* <Card className="h-full max-h-full w-full flex-1 overflow-hidden py-0">
        <CustomCandleChart
          symbol="BTC-INR"
          period1={Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60}
          period2={Math.floor(Date.now() / 1000)}
          interval="1h"
          precision={2}
        />
      </Card> */}
    </div>
  )
}

export default Dashboard
