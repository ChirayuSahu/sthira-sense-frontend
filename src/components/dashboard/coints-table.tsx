"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

import Image from "next/image"

type StableCoin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  circulating_supply: number
  last_updated: string
}

export default function StableCoinsTable() {
  const [data, setData] = useState<StableCoin[] | []>([])

  useEffect(() => {
    async function fetchCoins() {
      const res = await fetch("/api/coins")
      const json = await res.json()

      if (!res.ok) {
        toast.error("Failed to fetch coin data")
      }

      setData(json.data)
    }

    fetchCoins()
  }, [])

  return (
    <div className="bg-background overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Peg Dev</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">Supply</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length !== 0 &&
            data.map((coin) => {
              const pegDev = (coin.current_price - 1) * 100

              return (
                <TableRow key={coin.id}>
                  <TableCell>{coin.market_cap_rank}</TableCell>

                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      className="h-6 w-6 rounded-full"
                      height={100}
                      width={100}
                      draggable={false}
                    />
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-muted-foreground text-xs uppercase">{coin.symbol}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">${coin.current_price.toFixed(4)}</TableCell>

                  <TableCell
                    className={`text-right font-medium ${
                      pegDev >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {pegDev.toFixed(2)}%
                  </TableCell>

                  <TableCell
                    className={`text-right font-medium ${
                      coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>

                  <TableCell className="text-right">${coin.market_cap.toLocaleString()}</TableCell>

                  <TableCell className="text-right">
                    ${coin.total_volume.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right">
                    {coin.circulating_supply.toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            })}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-6 text-center">
                Loading stablecoins...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
