"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AmplifyParticles } from "@/components/intro/amplify-particles"

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const router = useRouter()

  const handleComplete = () => {
    setShowIntro(false)
    router.push("/dashboard")
  }

  return <>{showIntro && <AmplifyParticles onComplete={handleComplete} autoFadeAfterMs={2000} />}</>
}

