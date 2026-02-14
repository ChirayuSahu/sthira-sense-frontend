"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://sthirasense.onrender.com/v1/auth/google"
  }

  return (
    <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Sign in to SthiraSense</CardTitle>
          <CardDescription>Continue with your Google account</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.8 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C33.8 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C33.8 6.1 29.2 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.6-5.3l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.8-3.1-11.3-7.5l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3.1 5.3-5.9 6.9l6.3 5.2C39.6 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
