"use client"

import React, { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"

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

const currencyList = [
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

const timeline = ["1d"]

const Analytics = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCoin = searchParams.get("coin")
  const currentCurrency = searchParams.get("currency")

  const isReady = currentCoin && currentCurrency

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (key: "coin" | "currency", value: string) => {
    router.push(pathname + "?" + createQueryString(key, value))
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex gap-2">
        <Select
          value={currentCoin || ""}
          onValueChange={(value) => handleFilterChange("coin", value)}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a coin" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Coins</SelectLabel>
              {coins.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={currentCurrency || ""}
          onValueChange={(value) => handleFilterChange("currency", value)}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Currency</SelectLabel>
              {currencyList.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-h-0 flex-1">
        {isReady ? (
          <Card className="h-125 w-full flex-1 overflow-hidden py-0">
            <CustomCandleChart
              key={`${currentCoin}-${currentCurrency}`}
              symbol={`${currentCoin}-${currentCurrency}`}
              period1={Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60}
              period2={Math.floor(Date.now() / 1000)}
              interval="30m"
              precision={4}
            />
          </Card>
        ) : (
          <div className="border-muted-foreground/30 bg-muted/20 flex min-h-125 flex-1 items-center justify-center rounded-xl border border-dashed">
            <div className="text-center">
              <h2 className="text-foreground text-lg font-semibold">
                Select a coin to view analytics
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Choose a cryptocurrency and currency pair to display price data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  )
}
