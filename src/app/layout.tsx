import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

//import sections
import Navbar from "@/components/sections/navbar"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Sthira Sense",
  description: "Get Analytics and Insights on your Mental Health with Sthira Sense.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
