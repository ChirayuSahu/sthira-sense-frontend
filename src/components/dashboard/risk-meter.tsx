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
          { limit: 20, color: "#5BE12C", showTick: true },
          { limit: 40, color: "#F5CD19", showTick: true },
          { limit: 60, color: "#F58B19", showTick: true },
          { limit: 100, color: "#EA4228", showTick: true },
        ],
      }}
      pointer={{
        type: "needle",
        color: "#34495e",
        width: 20,
        length: 0.75,
        animationDuration: 1500,
        baseColor: "#34495e",
      }}
      labels={{
        valueLabel: {
          formatTextValue: (value) => value + " / 100",
          style: { fontSize: "35px", fill: "#464A4F", textShadow: "none" },
        },
        tickLabels: {
          type: "outer",
          ticks: [{ value: 20 }, { value: 40 }, { value: 60 }, { value: 80 }, { value: 100 }],
        },
      }}
    />
  )
}

export default RiskMeter
