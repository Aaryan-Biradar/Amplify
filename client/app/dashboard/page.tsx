"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"
import { ShopperJourney } from "@/components/dashboard/shopper-journey"
import { IncentiveEngine } from "@/components/dashboard/incentive-engine"
import { FeedbackLoop } from "@/components/dashboard/feedback-loop"
import { AmplifyParticles } from "@/components/intro/amplify-particles"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && <AmplifyParticles onComplete={() => setShowIntro(false)} autoFadeAfterMs={2000} />}

      <div
        className={`flex h-screen bg-background transition-opacity duration-500 ${showIntro ? "opacity-0" : "opacity-100"}`}
      >
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            {activeTab === "overview" && <OverviewDashboard />}
            {activeTab === "journey" && <ShopperJourney />}
            {activeTab === "incentives" && <IncentiveEngine />}
            {activeTab === "feedback" && <FeedbackLoop />}
          </main>
        </div>
      </div>
    </>
  )
}
