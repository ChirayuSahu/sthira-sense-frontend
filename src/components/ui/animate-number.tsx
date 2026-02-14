"use client"

import { useEffect, useState, memo } from "react"
import { motion, useSpring, useTransform } from "motion/react"

interface SlotCounterProps {
  value: number
  className?: string
  decimals?: number
}

// A single vertical column containing 0-9
const DigitReel = memo(({ digit }: { digit: number }) => {
  const [isReady, setIsReady] = useState(false)

  // Spring physics for the "bounce" effect at the end of the spin
  const y = useSpring(0, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  })

  // Each digit is 1em high, so we move -10% for each digit (0 to 9)
  const translateY = useTransform(y, (latest) => `${latest * -10}%`)

  useEffect(() => {
    y.set(digit)
    setIsReady(true)
  }, [digit, y])

  return (
    <div className="relative inline-block h-[1em] overflow-hidden leading-[1em] tabular-nums">
      <motion.div
        style={{ y: translateY }}
        className="flex flex-col items-center transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="flex h-[1em] items-center justify-center">
            {num}
          </span>
        ))}
      </motion.div>
    </div>
  )
})

DigitReel.displayName = "DigitReel"

export default function JackpotCounter({ value, className, decimals = 2 }: SlotCounterProps) {
  const formatted = Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)

  return (
    <div className={`flex flex-wrap items-center font-mono font-bold ${className}`}>
      {formatted.split("").map((char, index) => {
        const isDigit = !isNaN(parseInt(char))

        if (!isDigit) {
          return (
            <span key={`char-${index}`} className="px-0.5">
              {char}
            </span>
          )
        }

        return <DigitReel key={`digit-${index}-${formatted.length}`} digit={parseInt(char)} />
      })}
    </div>
  )
}
