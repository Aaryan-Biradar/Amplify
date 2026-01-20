"use client"

import { LiveShopperProfiler } from "@/components/dashboard/profile-scan/live-shopper-profiler"

export default function DashboardPage() {
  return (
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden">
      <LiveShopperProfiler />
    </div>
  )
}
