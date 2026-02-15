"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function LoginSuccess() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = params.get("token")

    if (token) {
      document.cookie = `token=${token}; path=/; Secure; SameSite=Lax; Max-Age=3600` // 1 hour
      router.replace("/dashboard")
    }
  }, [params, router])

  return <p>Logging you in...</p>
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginSuccess />
    </Suspense>
  )
}
