import React from "react"
import HeroGraph from "../hero-graph"
import { Button } from "../ui/button"

const HeroSection = () => {
  return (
    <section className="font-outfit min-h-screen w-full bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 pt-42 pb-24 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-black md:text-5xl">
          Sthira Sense
        </h1>

        <p className="md:text-md max-w-3xl text-lg leading-relaxed text-gray-600">
          Get analytics and structured insights on your mental health — designed for clarity,
          reflection, and long-term awareness.
        </p>

        <div className="flex gap-4">
          <Button className="cursor-pointer rounded-md bg-black px-6 py-3 text-white transition hover:scale-102">
            Get Started
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer rounded-md border border-gray-300 px-6 py-3 text-black transition hover:scale-102"
          >
            Explore Metrics
          </Button>
        </div>

        <div className="mt-10 h-[55vh] w-full max-w-6xl rounded-xl border border-gray-200 bg-white">
          <HeroGraph />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
