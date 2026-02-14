"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Features", href: "#" },
  { name: "Metrics", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard")) return null

  return (
    <div className="fixed top-6 right-0 left-0 z-50 flex justify-center">
      <div className="w-full max-w-7xl px-6">
        <div className="border-border bg-background/80 rounded-xl border px-6 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-foreground text-lg font-semibold tracking-tight">
              Sthira<span className="text-muted-foreground">Sense</span>
            </Link>

            <nav className="text-muted-foreground hidden items-center gap-10 text-sm md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-foreground transition-all hover:scale-102"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-4 md:flex">
              {/* <ModeToggle /> */}
              <Link href="/login ">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-md px-5 hover:scale-102">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 md:hidden">
              {/* <ModeToggle /> */}
              <button onClick={() => setOpen(!open)} className="text-foreground">
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {open && (
            <div className="border-border text-muted-foreground flex flex-col gap-6 border-t py-6 text-sm md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/login ">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full cursor-pointer rounded-md transition hover:scale-102">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
