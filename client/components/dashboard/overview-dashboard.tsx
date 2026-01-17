"use client"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { BehaviorStream } from "@/components/dashboard/behavior-stream"
import { ConversionChart } from "@/components/dashboard/conversion-chart"
import { TrendingUp, ShoppingCart, Sparkles, Target } from "lucide-react"

export function OverviewDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
        <p className="text-muted-foreground mt-1">Monitor real-time shopper behavior and incentive performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Conversion Rate" value="4.2%" change="+0.8%" trend="up" icon={Target} />
        <KpiCard title="Abandonment Rate" value="68.3%" change="-2.1%" trend="down" icon={ShoppingCart} />
        <KpiCard title="Incentives Triggered" value="1,284" change="+156" trend="up" icon={Sparkles} />
        <KpiCard title="Lift %" value="+18.4%" change="+3.2%" trend="up" icon={TrendingUp} />
      </div>

      {/* Charts and Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConversionChart />
        </div>
        <div>
          <BehaviorStream />
        </div>
      </div>
    </div>
  )
}
