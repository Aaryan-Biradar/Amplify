"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedRadarChartProps {
  data: number[]
  labels: string[]
  isMorphing?: boolean
}

export function AnimatedRadarChart({ data, labels, isMorphing = false }: AnimatedRadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [displayData, setDisplayData] = useState<number[]>(data)
  const [prevData, setPrevData] = useState<number[]>(data)
  const [morphProgress, setMorphProgress] = useState(1)
  const [glowPulse, setGlowPulse] = useState(0)
  const [isInitialRender, setIsInitialRender] = useState(true)
  const animationFrameRef = useRef<number | null>(null)

  const size = 400
  const center = size / 2
  const maxRadius = 130
  const levels = 5
  const angleSlice = (Math.PI * 2) / data.length
  const morphDuration = 1200

  // Detect data changes and trigger morph animation
  useEffect(() => {
    if (isInitialRender) {
      // Initial grow animation
      const startTime = Date.now()
      const initialDuration = 800

      const animateInitial = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / initialDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

        setDisplayData(data.map((v) => v * eased))

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateInitial)
        } else {
          setIsInitialRender(false)
          setDisplayData(data)
          setPrevData(data)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateInitial)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }

    // Check if data actually changed
    const dataChanged = data.some((v, i) => v !== prevData[i])
    if (!dataChanged) return

    // Start morph animation
    const startTime = Date.now()
    const startData = [...displayData]

    const animateMorph = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / morphDuration, 1)

      // Smooth ease-in-out curve
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      // Interpolate between previous and new data
      const interpolated = data.map((target, i) => {
        const start = startData[i]
        return start + (target - start) * eased
      })

      setDisplayData(interpolated)
      setMorphProgress(progress)

      // Glow pulse effect during morph
      setGlowPulse(Math.sin(progress * Math.PI) * 0.5)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateMorph)
      } else {
        setDisplayData(data)
        setPrevData(data)
        setMorphProgress(1)
        setGlowPulse(0)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateMorph)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [data, isInitialRender])

  // Get coordinates for polygon points
  const getCoordinates = (value: number, index: number) => {
    const angle = angleSlice * index - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  // Calculate vertex positions
  const vertices = displayData.map((value, i) => getCoordinates(value, i))
  const polygonPoints = vertices.map((point) => `${point.x},${point.y}`).join(" ")

  // Grid lines
  const gridLines = Array.from({ length: levels }).map((_, level) => {
    const radius = ((level + 1) / levels) * maxRadius
    const points = labels
      .map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2
        return {
          x: center + radius * Math.cos(angle),
          y: center + radius * Math.sin(angle),
        }
      })
      .map((p) => `${p.x},${p.y}`)
      .join(" ")
    return points
  })

  // Axis lines and labels
  const axisEnds = labels.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2
    const labelRadius = maxRadius + 45
    return {
      endX: center + maxRadius * Math.cos(angle),
      endY: center + maxRadius * Math.sin(angle),
      labelX: center + labelRadius * Math.cos(angle),
      labelY: center + labelRadius * Math.sin(angle),
    }
  })

  const isMorphingNow = morphProgress < 1

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 0 ${20 + glowPulse * 15}px rgba(147, 112, 219, ${0.3 + glowPulse * 0.2}))` }}
    >
      {/* Glow filter definitions */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-strong">
          <feGaussianBlur stdDeviation={4 + glowPulse * 2} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="polygon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 255, 255, 0.15)" />
          <stop offset="50%" stopColor="rgba(147, 112, 219, 0.1)" />
          <stop offset="100%" stopColor="rgba(100, 200, 255, 0.15)" />
        </linearGradient>
      </defs>

      {/* Grid background circles */}
      {gridLines.map((points, i) => (
        <polygon
          key={`grid-${i}`}
          points={points}
          fill="none"
          stroke="rgba(147, 112, 219, 0.15)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisEnds.map((axis, i) => (
        <line
          key={`axis-${i}`}
          x1={center}
          y1={center}
          x2={axis.endX}
          y2={axis.endY}
          stroke="rgba(147, 112, 219, 0.25)"
          strokeWidth="1.5"
        />
      ))}

      {/* Ripple effect during morph */}
      {isMorphingNow && (
        <polygon
          points={polygonPoints}
          fill="none"
          stroke="rgba(0, 255, 255, 0.3)"
          strokeWidth={2 + glowPulse * 4}
          opacity={glowPulse}
          filter="url(#glow-strong)"
        />
      )}

      {/* Outer glow layer */}
      <polygon
        points={polygonPoints}
        fill="none"
        stroke={`rgba(0, 255, 255, ${0.2 + glowPulse * 0.3})`}
        strokeWidth={8 + glowPulse * 4}
        opacity={0.5}
        filter="url(#glow-strong)"
      />

      {/* Main polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#polygon-gradient)"
        stroke={`rgba(0, 255, 255, ${0.8 + glowPulse * 0.2})`}
        strokeWidth={2.5}
        filter="url(#glow)"
      />

      {/* Vertex dots with trail effect */}
      {vertices.map((vertex, i) => (
        <g key={`vertex-${i}`}>
          {/* Trail dot during morph */}
          {isMorphingNow && (
            <circle
              cx={vertex.x}
              cy={vertex.y}
              r={6}
              fill="none"
              stroke="rgba(147, 112, 219, 0.4)"
              strokeWidth="2"
              opacity={glowPulse}
            />
          )}
          {/* Main vertex dot */}
          <circle
            cx={vertex.x}
            cy={vertex.y}
            r={4}
            fill="rgb(0, 255, 255)"
            filter="url(#glow)"
            opacity={0.9}
          />
          {/* Inner bright dot */}
          <circle cx={vertex.x} cy={vertex.y} r={2} fill="white" opacity={0.8} />
        </g>
      ))}

      {/* Axis labels */}
      {axisEnds.map((axis, i) => (
        <text
          key={`label-${i}`}
          x={axis.labelX}
          y={axis.labelY}
          textAnchor="middle"
          dy="0.3em"
          className="fill-muted-foreground text-xs font-medium"
          opacity={0.9}
          style={{
            pointerEvents: "none",
            fontSize: "12px",
            letterSpacing: "0.5px",
          }}
        >
          {labels[i]}
        </text>
      ))}
    </svg>
  )
}
