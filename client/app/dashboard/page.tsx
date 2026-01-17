
"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"
// import { ProfileCard } from "@/components/dashboard/profile-scan/profile-card"
import { ShopperJourney } from "@/components/dashboard/shopper-journey"
import { IncentiveEngine } from "@/components/dashboard/incentive-engine"
import { FeedbackLoop } from "@/components/dashboard/feedback-loop"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {activeTab === "overview" && <OverviewDashboard />}
          {/* {activeTab === "profile" && (
            <div className="w-full h-full flex items-center justify-center">
              <ProfileCard />
            </div>
          )} */}
          {activeTab === "journey" && <ShopperJourney />}
          {activeTab === "incentives" && <IncentiveEngine />}
          {activeTab === "feedback" && <FeedbackLoop />}
        </main>
      </div>
    </div>
  )
}