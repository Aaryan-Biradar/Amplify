"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Clock, RefreshCcw, Shield, Package, TrendingUp, Users, Sparkles, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Incentive {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  triggerCondition: string
  effectiveness: number
  timesTriggered: number
  enabled: boolean
}

const initialIncentives: Incentive[] = [
  {
    id: "inventory-hold",
    name: "Inventory Hold",
    description: "Reserve item for a limited time to create urgency",
    icon: <Package className="w-5 h-5" />,
    triggerCondition: "Cart revisits ≥ 2 times",
    effectiveness: 24,
    timesTriggered: 342,
    enabled: true,
  },
  {
    id: "extended-returns",
    name: "Extended Returns",
    description: "Offer 60-day returns to reduce purchase anxiety",
    icon: <RefreshCcw className="w-5 h-5" />,
    triggerCondition: "Hesitation at checkout > 30s",
    effectiveness: 31,
    timesTriggered: 518,
    enabled: true,
  },
  {
    id: "confidence-boost",
    name: "Confidence Panel",
    description: "Show social proof and satisfaction stats",
    icon: <Shield className="w-5 h-5" />,
    triggerCondition: "New user + cart value > $50",
    effectiveness: 18,
    timesTriggered: 226,
    enabled: true,
  },
  {
    id: "time-sensitive",
    name: "Time-Limited Offer",
    description: "Display countdown for exclusive pricing",
    icon: <Clock className="w-5 h-5" />,
    triggerCondition: "High intent + price sensitivity",
    effectiveness: 15,
    timesTriggered: 124,
    enabled: false,
  },
]

export function IncentiveEngine() {
  const [incentives, setIncentives] = useState(initialIncentives)
  const [selectedIncentive, setSelectedIncentive] = useState<Incentive | null>(null)

  const toggleIncentive = (id: string) => {
    setIncentives((prev) => prev.map((inc) => (inc.id === id ? { ...inc, enabled: !inc.enabled } : inc)))
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Incentive Engine</h2>
          <p className="text-muted-foreground mt-1">Configure and monitor adaptive incentives</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{incentives.filter((i) => i.enabled).length}</p>
                  <p className="text-sm text-muted-foreground">Active Incentives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">+22%</p>
                  <p className="text-sm text-muted-foreground">Avg. Effectiveness</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">1,210</p>
                  <p className="text-sm text-muted-foreground">Total Triggers (24h)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incentive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incentives.map((incentive) => (
            <Card
              key={incentive.id}
              className={cn(
                "bg-card border-border transition-all cursor-pointer",
                selectedIncentive?.id === incentive.id && "ring-2 ring-primary",
                !incentive.enabled && "opacity-60",
              )}
              onClick={() => setSelectedIncentive(incentive)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        incentive.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {incentive.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium text-foreground">{incentive.name}</CardTitle>
                      <CardDescription className="text-sm">{incentive.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={incentive.enabled}
                    onCheckedChange={() => toggleIncentive(incentive.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Trigger
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Condition that activates this incentive</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {incentive.triggerCondition}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Effectiveness</p>
                      <p className="text-lg font-semibold text-success">+{incentive.effectiveness}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Times Triggered</p>
                      <p className="text-lg font-semibold text-foreground">
                        {incentive.timesTriggered.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Effectiveness Bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all"
                      style={{ width: `${incentive.effectiveness * 2}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Reasoning Panel */}
        {selectedIncentive && (
          <Card className="bg-card border-border border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Reasoning: {selectedIncentive.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This incentive is most effective for{" "}
                <span className="text-foreground font-medium">hesitant mobile users</span> with cart values between{" "}
                <span className="text-foreground font-medium">$50-$150</span>. The AI has learned that showing this
                incentive after{" "}
                <span className="text-foreground font-medium">30-45 seconds of checkout hesitation</span> yields the
                highest conversion lift. Users who receive this incentive are{" "}
                <span className="text-success font-medium">{selectedIncentive.effectiveness}% more likely</span> to
                complete their purchase compared to the control group.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
