import React from "react"
import HeroGraph from "../hero-graph"
import { Button } from "../ui/button"
import Link from "next/link"

const HeroSection = () => {
  return (
    <section className="font-outfit min-h-screen w-full bg-white dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 pt-42 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-black md:text-5xl dark:text-white">
          Sthira Sense
        </h1>

        <p className="md:text-md max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Get analytics and structured insights on your mental health — designed for clarity,
          reflection, and long-term awareness.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <Button className="cursor-pointer rounded-md bg-black px-6 py-3 text-white transition hover:scale-102 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
              Get Started
            </Button>
          </Link>

          <Button
            variant="outline"
            className="cursor-pointer rounded-md border border-gray-300 px-6 py-3 text-black transition hover:scale-102 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800"
          >
            Explore Metrics
          </Button>
        </div>

        <div className="mt-10 h-[55vh] w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <HeroGraph />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
