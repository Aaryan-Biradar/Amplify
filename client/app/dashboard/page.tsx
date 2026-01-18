"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"
import { ShopperJourney } from "@/components/dashboard/shopper-journey"
import { IncentiveEngine } from "@/components/dashboard/incentive-engine"
import { FeedbackLoop } from "@/components/dashboard/feedback-loop"
import ChartCard from "@/components/dashboard/chart-card"
import { LiveShopperProfiler } from "@/components/dashboard/profile-scan/live-shopper-profiler"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const charts = [
    {
      title: "Time spent on checkout",
      embedUrl: "https://app.amplitude.com/analytics/share/386a94bef7f648c28b51b5d2859098bf",
    },
    {
      title: "Number of visits vs number of purchases",
      embedUrl: "https://app.amplitude.com/analytics/share/3a258936eb1145b49572f5daa501034c",
    },
    {
      title: "Pricing tier at time of event",
      embedUrl: "https://app.amplitude.com/analytics/share/426baf86e1f744abb64f34419a4ee552",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            "flex-1",
            activeTab === "profile" ? "overflow-hidden p-0" : "overflow-auto p-6"
          )}
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              <OverviewDashboard />

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Analytics</h2>
                <p className="text-sm text-muted-foreground">
                  Pulled from your saved Amplitude charts.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {charts.map((c) => (
                  <ChartCard key={c.title} title={c.title} embedUrl={c.embedUrl} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && <LiveShopperProfiler />}

          {activeTab === "journey" && <ShopperJourney />}
          {activeTab === "incentives" && <IncentiveEngine />}
          {activeTab === "feedback" && <FeedbackLoop />}
        </main>
      </div>
    </div>
  )
}
