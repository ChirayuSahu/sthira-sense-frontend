"use client"

import React, { useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import CustomCandleChart from "@/components/graph/candles"

const coins = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "Tether", value: "USDT" },
  { label: "USD Coin", value: "USDC" },
  { label: "Binance Coin", value: "BNB" },
  { label: "Cardano", value: "ADA" },
  { label: "Solana", value: "SOL" },
  { label: "XRP", value: "XRP" },
  { label: "Polkadot", value: "DOT" },
  { label: "Dogecoin", value: "DOGE" },
]

const currency = [
  { label: "USD", value: "USD", precision: 2 },
  { label: "INR", value: "INR", precision: 2 },
  { label: "EUR", value: "EUR", precision: 2 },
  { label: "JPY", value: "JPY", precision: 0 },
  { label: "GBP", value: "GBP", precision: 2 },
  { label: "AUD", value: "AUD", precision: 2 },
  { label: "CAD", value: "CAD", precision: 2 },
  { label: "CHF", value: "CHF", precision: 2 },
  { label: "CNY", value: "CNY", precision: 2 },
]

const AnalyticsPage = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Select value={selectedCoin || undefined} onValueChange={setSelectedCoin}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a coin" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Coins</SelectLabel>
              {coins.map((coin) => (
                <SelectItem key={coin.value} value={coin.value}>
                  {coin.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={selectedCurrency || undefined} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Currency</SelectLabel>
              {currency.map((coin) => (
                <SelectItem key={coin.value} value={coin.value}>
                  {coin.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {selectedCoin && selectedCurrency && (
        <Card className="max-h-150 w-full flex-1 overflow-hidden py-0">
          <CustomCandleChart
            symbol={selectedCoin ? `${selectedCoin}-${selectedCurrency || "USD"}` : "BTC-USD"}
            period1={Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60}
            period2={Math.floor(Date.now() / 1000)}
            interval="1h"
            precision={
              selectedCurrency
                ? currency.find((c) => c.value === selectedCurrency)?.precision || 2
                : 2
            }
          />
        </Card>
      )}
    </div>
  )
}

export default AnalyticsPage
