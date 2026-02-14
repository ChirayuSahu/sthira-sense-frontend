import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

//import sections
import Navbar from "@/components/sections/navbar"
import GoogleTranslate from "@/components/others/google-translate"
import { ThemeProvider } from "@/components/providers/theme-provider"

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster position="top-right" />
          <GoogleTranslate />
        </ThemeProvider>
      </body>
    </html>
  )
}
