"use client"

import React from "react"
import GaugeComponent from "react-gauge-component"

const RiskMeter = ({ value }: { value: number }) => {
  return (
    <GaugeComponent
      value={value}
      type="semicircle"
      arc={{
        width: 0.2,
        padding: 0.02,
        cornerRadius: 1,
        subArcs: [
          { limit: 20, color: "#EA4228", showTick: false }, // Extreme Fear (Red)
          { limit: 40, color: "#F58B19", showTick: false }, // Fear (Orange)
          { limit: 60, color: "#5BE12C", showTick: false }, // Neutral (Green)
          { limit: 80, color: "#F58B19", showTick: false }, // Greed (Orange)
          { limit: 100, color: "#EA4228", showTick: false }, // Extreme Greed (Red)
        ],
      }}
      pointer={{
        type: "needle",
        color: "#34495e",
        width: 15,
        length: 0.8,
        animationDuration: 1500,
        baseColor: "#34495e",
      }}
      labels={{
        valueLabel: {
          style: { fontSize: "35px", fill: "#000000", textShadow: "none" },
          formatTextValue: (val) => `${val.toString()}`,
        },
        tickLabels: {
          type: "outer",
          defaultTickValueConfig: {
            formatTextValue: (val) => val.toString(),
          },
          ticks: [{ value: 20 }, { value: 40 }, { value: 60 }, { value: 80 }, { value: 100 }],
        },
      }}
    />
  )
}

export default RiskMeter
