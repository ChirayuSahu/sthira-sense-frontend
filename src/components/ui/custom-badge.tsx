import React from "react"

const CustomBadge = ({ text }: { text: string }) => {
  return (
    <div className="w-fit rounded-full border border-white/50 bg-white/1 px-3 py-1 text-sm text-white backdrop-blur-xl">
      {text}
    </div>
  )
}

export default CustomBadge
