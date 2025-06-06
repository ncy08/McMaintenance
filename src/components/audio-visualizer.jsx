"use client";
import { useRef, useEffect } from "react"

export function AudioVisualizer({
  data
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    // Draw visualization
    const barWidth = rect.width / data.length
    const barSpacing = 1
    const maxBarHeight = rect.height * 0.8

    ctx.fillStyle = "#ef4444" // Red color for recording

    for (let i = 0; i < data.length; i++) {
      const barHeight = Math.max((data[i] / 255) * maxBarHeight, 2) // Minimum height of 2px
      const x = i * (barWidth + barSpacing)
      const y = (rect.height - barHeight) / 2

      // Draw rounded bars with glow effect
      ctx.shadowColor = "#ef4444"
      ctx.shadowBlur = 4
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }, [data])

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
