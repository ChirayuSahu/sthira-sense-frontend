import HeroSection from "@/components/sections/hero"
import GradualBlur from "@/components/GradualBlur"

export default function Home() {
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div style={{ height: "100%", overflowY: "auto", padding: "6rem 2rem" }}>
        <HeroSection />
      </div>

      <GradualBlur
        target="parent"
        position="bottom"
        height="2rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />
    </div>
  )
}
