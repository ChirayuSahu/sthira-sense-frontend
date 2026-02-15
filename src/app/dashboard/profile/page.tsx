"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Key, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const user = {
    name: "Chirayu Sahu",
    email: "chirayuajaysahu01@gmail.com",
  }

  // 🔐 Simulated API key generator
  const generateApiKey = async () => {
    setLoading(true)

    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const randomPart = crypto.randomUUID().replace(/-/g, "")
    const newKey = `sk_live_${randomPart}`

    setApiKey(newKey)
    setShowKey(false)
    setLoading(false)
  }

  const copyToClipboard = () => {
    if (apiKey) navigator.clipboard.writeText(apiKey)
  }

  const maskedKey = apiKey ? apiKey.slice(0, 10) + "••••••••••••••••" : ""

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>

        {/* User Info Card */}
        <Card className="rounded-2xl border-neutral-800 bg-neutral-900">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Account Information</h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-400">Full Name</p>
                <p className="text-base">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-400">Email</p>
                <p className="text-base">{user.email}</p>
              </div>

              <Badge className="bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* API Key Section */}
        <Card className="rounded-2xl border-neutral-800 bg-neutral-900">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Key size={18} />
                API Key Management
              </h2>

              <Button onClick={generateApiKey} disabled={loading}>
                {loading ? "Generating..." : apiKey ? "Regenerate Key" : "Generate API Key"}
              </Button>
            </div>

            {apiKey && (
              <div className="flex items-center gap-2">
                <Input
                  value={showKey ? apiKey : maskedKey}
                  readOnly
                  className="border-neutral-700 bg-neutral-800"
                />

                <Button variant="secondary" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>

                <Button variant="secondary" onClick={copyToClipboard}>
                  <Copy size={16} />
                </Button>
              </div>
            )}

            {!apiKey && (
              <p className="text-sm text-neutral-400">
                Generate an API key to access the stablecoin risk API.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
