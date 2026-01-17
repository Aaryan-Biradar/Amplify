"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  color: string
  velocity: { x: number; y: number }
  alpha: number
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
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const hasInteractedRef = useRef(false)
  const interactionTimeRef = useRef(0)
  const fadeProgressRef = useRef(0)
  const isFadingRef = useRef(false)

  const getTextPoints = useCallback((ctx: CanvasRenderingContext2D, text: string, width: number, height: number) => {
    const fontSize = Math.min(width / 4, 200)
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.clearRect(0, 0, width, height)
    ctx.fillText(text, width / 2, height / 2)

    const imageData = ctx.getImageData(0, 0, width, height)
    const points: { x: number; y: number }[] = []
    const gap = 2

    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const index = (y * width + x) * 4
        if (imageData.data[index + 3] > 128) {
          points.push({ x, y })
        }
      }
    }

    ctx.clearRect(0, 0, width, height)
    return points
  }, [])

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

      const colors = ["#a855f7", "#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4"]

      particlesRef.current = textPoints.map((point) => ({
        x: point.x,
        y: point.y,
        targetX: point.x,
        targetY: point.y,
        size: Math.random() * 0.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: { x: 0, y: 0 },
        alpha: 1,
      }))
    }

    resizeCanvas()

    if (typeof autoFadeAfterMs === "number" && autoFadeAfterMs >= 0) {
      hasInteractedRef.current = true
      interactionTimeRef.current = performance.now() - 2000 + autoFadeAfterMs
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true
        interactionTimeRef.current = performance.now()
      }
    }

    const animate = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = "#09090b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      const mouseRadius = 80
      const repelStrength = 6

      if (hasInteractedRef.current && performance.now() - interactionTimeRef.current > 2000 && !isFadingRef.current) {
        isFadingRef.current = true
        setFadeOut(true)
      }

      if (isFadingRef.current) {
        fadeProgressRef.current += 0.012
        if (fadeProgressRef.current >= 1) {
          onComplete()
          return
        }
      }

      particlesRef.current.forEach((particle, index) => {
        if (isFadingRef.current) {
          const staggerDelay = (index / particlesRef.current.length) * 0.6
          const particleFade = Math.max(0, (fadeProgressRef.current - staggerDelay) / 0.4)
          particle.alpha = Math.max(0, 1 - particleFade)

          particle.velocity.x += (Math.random() - 0.5) * 0.3
          particle.velocity.y -= Math.random() * 0.2
        } else {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distToMouse = Math.sqrt(dx * dx + dy * dy)

          if (distToMouse < mouseRadius && distToMouse > 0) {
            const force = (mouseRadius - distToMouse) / mouseRadius
            const angle = Math.atan2(dy, dx)
            particle.velocity.x -= Math.cos(angle) * force * repelStrength
            particle.velocity.y -= Math.sin(angle) * force * repelStrength
          }

          const toTargetX = particle.targetX - particle.x
          const toTargetY = particle.targetY - particle.y
          particle.velocity.x += toTargetX * 0.08
          particle.velocity.y += toTargetY * 0.08
        }

        particle.velocity.x *= 0.85
        particle.velocity.y *= 0.85

        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        if (particle.alpha <= 0) return

        ctx.globalAlpha = particle.alpha
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [getTextPoints, onComplete, autoFadeAfterMs])

  return (
    <div
      className={`fixed inset-0 z-50 bg-zinc-950 transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"
        }`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      {autoFadeAfterMs === undefined && (
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 text-sm transition-opacity duration-500 ${hasInteractedRef.current || fadeOut ? "opacity-0" : "animate-pulse"
            }`}
        >
          Move your mouse to interact
        </div>
      )}
    </div>
  )
}
