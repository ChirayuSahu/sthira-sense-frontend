import React from "react"
import FNGCard from "@/components/dashboard/fng"
import GraphCard from "@/components/dashboard/graph-card"

const Dashboard = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex gap-4">
        <FNGCard />
        <GraphCard />
        <FNGCard />
        <FNGCard />
      </div>
    </div>
  )
}

export default Dashboard
