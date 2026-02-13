"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

const navItems = [
  { name: "Features", href: "#" },
  { name: "Metrics", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed top-6 right-0 left-0 z-50 flex justify-center">
      <div className="w-full max-w-7xl px-6">
        <div className="rounded-xl border border-gray-200 bg-white px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="text-lg font-semibold tracking-tight text-black">
              Sthira<span className="text-gray-500">Sense</span>
            </div>

            <nav className="hidden items-center gap-10 text-sm text-gray-600 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-all hover:scale-102 hover:text-black"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 md:flex">
              <Button
                variant="outline"
                className="cursor-pointer text-gray-600 hover:scale-102 hover:text-black"
              >
                Login
              </Button>

              <Button className="cursor-pointer rounded-md bg-black px-5 text-white hover:scale-102">
                Get Started
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setOpen(!open)} className="text-black md:hidden">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {open && (
            <div className="flex flex-col gap-6 border-t border-gray-200 py-6 text-sm text-gray-700 md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-black"
                >
                  {item.name}
                </Link>
              ))}

              <Button className="w-full cursor-pointer rounded-md bg-black text-white transition hover:scale-102">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
