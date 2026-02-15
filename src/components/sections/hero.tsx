import React from "react"
import HeroGraph from "../hero-graph"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowRight, Activity, ShieldCheck, Users } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="font-outfit relative min-h-screen w-full overflow-hidden bg-white selection:bg-neutral-200 dark:bg-neutral-950 dark:selection:bg-neutral-800">
      {/* Background Pattern - Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-neutral-950"></div>

      {/* Background Pattern - Radial Fade */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_800px_at_50%_200px,#e5e5e5,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#1a1a1a,transparent)]"></div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 pt-32 text-center md:pt-42">
        {/* Badge / Announcement */}
        <div className="animate-fade-in inline-flex items-center rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-sm text-neutral-600 backdrop-blur-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white"></span>
          <span>v2.0 Now Available</span>
        </div>

        {/* Main Heading */}
        <div className="max-w-4xl space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight text-black md:text-7xl dark:text-white">
            Clarity in every <br className="hidden md:block" />
            <span className="text-neutral-500 dark:text-neutral-500">structured insight.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-400">
            Sthira Sense transforms raw stable coin health data into clear, actionable analytics.
            Designed for traders, analysts, and enthusiasts seeking to navigate the stable coin
            landscape with confidence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button className="group h-12 min-w-[160px] cursor-pointer rounded-full bg-black px-8 text-white transition hover:scale-105 hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-100 dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:hover:ring-neutral-800">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="h-12 min-w-[160px] cursor-pointer rounded-full border border-neutral-200 bg-white px-8 text-neutral-900 transition hover:scale-105 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
          >
            Explore Metrics
          </Button>
        </div>

        {/* Data / Credibility Section */}
        <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-6 border-y border-neutral-100 py-8 md:grid-cols-3 dark:border-neutral-900">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Data Points</span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">1.2M+</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 border-x border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Active Users</span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">10k+</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Privacy Score</span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">100%</span>
          </div>
        </div>

        {/* Graph Container - Styled as a Dashboard Window */}
        <div className="relative mt-12 mb-20 w-full max-w-[1400px]">
          {/* Glow Effect behind the graph */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 opacity-50 blur-xl dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800"></div>

          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]">
            {/* Fake Browser/App Header */}
            <div className="flex h-10 w-full items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
              </div>
              <div className="text-xs font-medium text-neutral-400">sthirasense.vercel.app</div>
              <div className="w-10"></div>
            </div>

            {/* The Graph Component */}
            <div className="h-[60vh] w-full bg-neutral-50/30 p-2 dark:bg-neutral-950/30">
              <HeroGraph />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
