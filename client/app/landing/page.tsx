"use client"

import { useEffect, useState } from "react"
import { AmplifyParticles } from "@/components/intro/amplify-particles"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {showIntro && (
        <div className="fixed inset-0 z-50 bg-zinc-950">
          <AmplifyParticles onComplete={() => setShowIntro(false)} autoFadeAfterMs={2000} />
        </div>
      )}

      <div
        className={`min-h-screen flex flex-col transition-opacity duration-500 ${showIntro ? "opacity-0" : "opacity-100"}`}
      >
        <div className="w-full h-[40vh] md:h-[45vh] relative overflow-hidden">
          <img src="/landing.webp" alt="E-commerce ecosystem illustration" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="flex-1 bg-background flex flex-col items-center justify-center px-6 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-balance">
            Amplify your store. Maximize your sales.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
            The self-optimizing AI that tracks analytics and evolves your UI to convert more customers
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              className="px-10 py-6 text-lg font-semibold rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
