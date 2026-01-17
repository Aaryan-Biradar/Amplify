"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart, CreditCard, CheckCircle2, XCircle, Sparkles, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface JourneyStep {
  id: string
  stage: string
  icon: React.ReactNode
  status: "completed" | "current" | "friction" | "abandoned"
  timestamp: string
  details?: string
  incentive?: string
}

const mockJourneys = [
  {
    id: "session-1",
    user: "Visitor #4821",
    device: "Mobile",
    cartValue: "$127.50",
    steps: [
      {
        id: "1",
        stage: "Browse",
        icon: <Eye className="w-4 h-4" />,
        status: "completed" as const,
        timestamp: "2:34 PM",
        details: "Viewed 3 products",
      },
      {
        id: "2",
        stage: "Cart",
        icon: <ShoppingCart className="w-4 h-4" />,
        status: "completed" as const,
        timestamp: "2:38 PM",
        details: "Added 2 items",
      },
      {
        id: "3",
        stage: "Checkout",
        icon: <CreditCard className="w-4 h-4" />,
        status: "friction" as const,
        timestamp: "2:41 PM",
        details: "Idle for 52s",
        incentive: "Extended returns shown",
      },
      {
        id: "4",
        stage: "Outcome",
        icon: <CheckCircle2 className="w-4 h-4" />,
        status: "completed" as const,
        timestamp: "2:43 PM",
        details: "Purchase completed",
      },
    ],
  },
  {
    id: "session-2",
    user: "Visitor #4819",
    device: "Desktop",
    cartValue: "$84.00",
    steps: [
      {
        id: "1",
        stage: "Browse",
        icon: <Eye className="w-4 h-4" />,
        status: "completed" as const,
        timestamp: "2:28 PM",
        details: "Viewed 5 products",
      },
      {
        id: "2",
        stage: "Cart",
        icon: <ShoppingCart className="w-4 h-4" />,
        status: "friction" as const,
        timestamp: "2:35 PM",
        details: "Revisited 3 times",
        incentive: "Inventory hold offered",
      },
      {
        id: "3",
        stage: "Checkout",
        icon: <CreditCard className="w-4 h-4" />,
        status: "current" as const,
        timestamp: "2:40 PM",
        details: "In progress",
      },
      {
        id: "4",
        stage: "Outcome",
        icon: <XCircle className="w-4 h-4" />,
        status: "abandoned" as const,
        timestamp: "—",
      },
    ],
  },
]

const statusStyles = {
  completed: { bg: "bg-success", border: "border-success" },
  current: { bg: "bg-primary", border: "border-primary" },
  friction: { bg: "bg-warning", border: "border-warning" },
  abandoned: { bg: "bg-muted", border: "border-muted" },
}

export function ShopperJourney() {
  const [selectedJourney, setSelectedJourney] = useState(mockJourneys[0])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Shopper Journey</h2>
        <p className="text-muted-foreground mt-1">Track individual shopper paths and identify friction points</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-foreground">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockJourneys.map((journey) => (
              <button
                key={journey.id}
                onClick={() => setSelectedJourney(journey)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-colors",
                  selectedJourney.id === journey.id
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-secondary hover:bg-secondary/80",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-foreground">{journey.user}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {journey.device}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Cart: {journey.cartValue}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Journey Visualization */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium text-foreground">{selectedJourney.user}</CardTitle>
                <p className="text-sm text-muted-foreground">Cart Value: {selectedJourney.cartValue}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedJourney.device}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Journey Steps */}
              <div className="flex items-start justify-between">
                {selectedJourney.steps.map((step, index) => (
                  <div key={step.id} className="flex-1 relative">
                    {/* Connector Line */}
                    {index < selectedJourney.steps.length - 1 && (
                      <div
                        className={cn(
                          "absolute top-5 left-1/2 w-full h-0.5",
                          step.status === "completed" || step.status === "friction" ? "bg-success/50" : "bg-muted",
                        )}
                      />
                    )}

                    {/* Step Node */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-card",
                          statusStyles[step.status].border,
                          step.status === "friction" && "ring-4 ring-warning/20",
                        )}
                      >
                        <span
                          className={cn(
                            step.status === "completed" && "text-success",
                            step.status === "current" && "text-primary",
                            step.status === "friction" && "text-warning",
                            step.status === "abandoned" && "text-muted-foreground",
                          )}
                        >
                          {step.icon}
                        </span>
                      </div>

                      <div className="mt-3 text-center">
                        <p className="text-sm font-medium text-foreground">{step.stage}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.timestamp}</p>
                      </div>

                      {/* Details Card */}
                      <div
                        className={cn(
                          "mt-3 p-3 rounded-lg w-full max-w-[140px]",
                          step.status === "friction" ? "bg-warning/10" : "bg-secondary",
                        )}
                      >
                        <p className="text-xs text-muted-foreground">{step.details}</p>
                        {step.incentive && (
                          <div className="flex items-center gap-1 mt-2">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-xs text-primary font-medium">{step.incentive}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friction Legend */}
            <div className="flex items-center gap-4 mt-8 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Friction Point</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">Incentive Applied</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
