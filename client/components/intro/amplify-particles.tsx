"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface Particle {
  x: number
  y: number
  anchorX: number
  anchorY: number
  size: number
  color: string
  velocity: { x: number; y: number }
  alpha: number
  noiseOffsetX: number
  noiseOffsetY: number
  brightness: number
}

// Simple Perlin-like noise function
function noise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0

  const v00 = noise(x0, y0, seed)
  const v10 = noise(x0 + 1, y0, seed)
  const v01 = noise(x0, y0 + 1, seed)
  const v11 = noise(x0 + 1, y0 + 1, seed)

  const smoothFx = fx * fx * (3 - 2 * fx)
  const smoothFy = fy * fy * (3 - 2 * fy)

  const i1 = v00 * (1 - smoothFx) + v10 * smoothFx
  const i2 = v01 * (1 - smoothFx) + v11 * smoothFx

  return i1 * (1 - smoothFy) + i2 * smoothFy
}

export function AmplifyParticles({
  onComplete,
  autoFadeAfterMs,
}: {
  onComplete: () => void
  autoFadeAfterMs?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fadeOut, setFadeOut] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const hasInteractedRef = useRef(false)
  const interactionTimeRef = useRef(0)
  const fadeProgressRef = useRef(0)
  const isFadingRef = useRef(false)
  const timeRef = useRef(0)

  const getTextPoints = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      width: number,
      height: number
    ): { x: number; y: number; charIndex: number }[] => {
      const fontSize = Math.min(width / 5, 180)
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.clearRect(0, 0, width, height)
      ctx.fillText(text, width / 2, height / 2)

      // Measure each character position
      const textMetrics = ctx.measureText(text)
      const textWidth = textMetrics.width
      const startX = (width - textWidth) / 2

      const charPositions: { start: number; end: number }[] = []
      let currentX = startX
      for (let i = 0; i < text.length; i++) {
        const charWidth = ctx.measureText(text[i]).width
        charPositions.push({ start: currentX, end: currentX + charWidth })
        currentX += charWidth
      }

      const imageData = ctx.getImageData(0, 0, width, height)
      const points: { x: number; y: number; charIndex: number }[] = []
      const gap = 3

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4
          if (imageData.data[index + 3] > 128) {
            // Determine which character this point belongs to
            let charIndex = 0
            for (let i = 0; i < charPositions.length; i++) {
              if (x >= charPositions[i].start && x < charPositions[i].end) {
                charIndex = i
                break
              }
            }
            points.push({ x, y, charIndex })
          }
        }
      }

      ctx.clearRect(0, 0, width, height)
      return points
    },
    []
  )

  useEffect(() => {
    // Show subtitle after 1.5 seconds
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true)
    }, 1500)

    return () => clearTimeout(subtitleTimer)
  }, [])

  useEffect(() => {
    if (typeof autoFadeAfterMs !== "number") return
    if (autoFadeAfterMs < 0) return

    hasInteractedRef.current = true
    interactionTimeRef.current = performance.now() - 2000 + autoFadeAfterMs
  }, [autoFadeAfterMs])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      initParticles()
    }

    const initParticles = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      const textPoints = getTextPoints(ctx, "Amplify", window.innerWidth, window.innerHeight)
      ctx.scale(dpr, dpr)

      // "Ampl" = indices 0-3 (blue), "ify" = indices 4-6 (green)
      const blueColors = ["#3b82f6", "#60a5fa", "#2563eb", "#1d4ed8", "#93c5fd"]
      const greenColors = ["#95bf47", "#a8cc6c", "#82a63d", "#b5d67a", "#6d8f32"]

      particlesRef.current = textPoints.map((point) => {
        const isGreen = point.charIndex >= 4 // "i", "f", "y"
        const colors = isGreen ? greenColors : blueColors

        return {
          x: point.x,
          y: point.y,
          anchorX: point.x,
          anchorY: point.y,
          size: Math.random() * 1.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: { x: 0, y: 0 },
          alpha: 1,
          noiseOffsetX: Math.random() * 1000,
          noiseOffsetY: Math.random() * 1000,
          brightness: 0.7 + Math.random() * 0.3,
        }
      })
    }

    resizeCanvas()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true
        interactionTimeRef.current = performance.now()
      }
    }

    const animate = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      timeRef.current += 0.008

      const mouseRadius = 120
      const repelStrength = 25

      if (hasInteractedRef.current && performance.now() - interactionTimeRef.current > 2000 && !isFadingRef.current) {
        isFadingRef.current = true
        setFadeOut(true)
      }

      if (isFadingRef.current) {
        fadeProgressRef.current += 0.015
        if (fadeProgressRef.current >= 1) {
          onComplete()
          return
        }
      }

      particlesRef.current.forEach((particle, index) => {
        if (isFadingRef.current) {
          const staggerDelay = (index / particlesRef.current.length) * 0.5
          const particleFade = Math.max(0, (fadeProgressRef.current - staggerDelay) / 0.5)
          particle.alpha = Math.max(0, 1 - particleFade)

          particle.velocity.x += (Math.random() - 0.5) * 0.4
          particle.velocity.y -= Math.random() * 0.3
        } else {
          // Continuous idle movement using layered noise for organic motion
          const time = timeRef.current

          // Layer multiple noise frequencies for more organic movement
          const noise1X = smoothNoise(particle.noiseOffsetX + time * 0.8, particle.noiseOffsetY, 0) - 0.5
          const noise1Y = smoothNoise(particle.noiseOffsetX, particle.noiseOffsetY + time * 0.8, 100) - 0.5
          const noise2X = smoothNoise(particle.noiseOffsetX * 2 + time * 1.2, particle.noiseOffsetY * 2, 50) - 0.5
          const noise2Y = smoothNoise(particle.noiseOffsetX * 2, particle.noiseOffsetY * 2 + time * 1.2, 150) - 0.5

          // Combine noise layers with different weights
          const combinedNoiseX = noise1X * 0.7 + noise2X * 0.3
          const combinedNoiseY = noise1Y * 0.7 + noise2Y * 0.3

          // Stronger idle movement that keeps particles dancing
          const idleStrength = 8

          // Calculate target position with noise offset (constrained around anchor)
          const maxDrift = 6 // Maximum pixels from anchor point
          const targetX = particle.anchorX + combinedNoiseX * maxDrift * 2
          const targetY = particle.anchorY + combinedNoiseY * maxDrift * 2

          // Warp effect from cursor
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distToMouse = Math.sqrt(dx * dx + dy * dy)

          if (distToMouse < mouseRadius && distToMouse > 0) {
            // Magnetic repel - strength scales inversely with distance
            const normalizedDist = distToMouse / mouseRadius
            const force = Math.pow(1 - normalizedDist, 2) * repelStrength
            const angle = Math.atan2(dy, dx)
            particle.velocity.x -= Math.cos(angle) * force
            particle.velocity.y -= Math.sin(angle) * force
          }

          // Move toward noise-driven target position with spring physics
          const toTargetX = targetX - particle.x
          const toTargetY = targetY - particle.y
          particle.velocity.x += toTargetX * 0.12
          particle.velocity.y += toTargetY * 0.12
        }

        // Apply velocity with damping (ease-out)
        particle.velocity.x *= 0.88
        particle.velocity.y *= 0.88

        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        if (particle.alpha <= 0) return

        // Dynamic brightness variation
        const brightnessVariation = smoothNoise(
          particle.noiseOffsetX + timeRef.current * 0.5,
          particle.noiseOffsetY,
          200
        )
        const dynamicAlpha = particle.alpha * (0.6 + brightnessVariation * 0.4) * particle.brightness

        ctx.globalAlpha = dynamicAlpha
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
        ctx.globalAlpha = 1
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resizeCanvas)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [getTextPoints, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Subtitle */}
      <div
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 ${showSubtitle && !fadeOut ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
      >
        <p className="text-zinc-500 text-sm tracking-wide">Ecommerce that pays attention.</p>
      </div>
    </div>
  )
}
