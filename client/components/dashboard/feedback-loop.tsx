"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CheckCircle2, TrendingUp, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const comparisonData = [
  { name: "Extended Returns", before: 3.2, after: 4.2, lift: 31 },
  { name: "Inventory Hold", before: 2.8, after: 3.5, lift: 24 },
  { name: "Confidence Panel", before: 3.5, after: 4.1, lift: 18 },
  { name: "Time-Limited", before: 3.1, after: 3.6, lift: 15 },
]

const insights = [
  {
    id: "1",
    type: "success",
    title: "Extended Returns outperforming",
    description: "This incentive worked better for hesitant mobile users, increasing conversions by 31%.",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    id: "2",
    type: "success",
    title: "Inventory Hold effective for repeat visitors",
    description: "Users who revisit cart 2+ times respond well to scarcity messaging.",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    id: "3",
    type: "warning",
    title: "Time-Limited needs optimization",
    description: "Consider testing different countdown durations for higher-value carts.",
    icon: <Lightbulb className="w-4 h-4" />,
  },
  {
    id: "4",
    type: "neutral",
    title: "Confidence Panel best for new users",
    description: "First-time visitors with high cart values see the strongest response.",
    icon: <TrendingUp className="w-4 h-4" />,
  },
]

const insightStyles = {
  success: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
  neutral: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
}

export function FeedbackLoop() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Closed-Loop Feedback</h2>
        <p className="text-muted-foreground mt-1">Before vs after comparison and learning insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Baseline Conversion</p>
              <p className="text-3xl font-bold text-foreground mt-1">3.15%</p>
              <p className="text-xs text-muted-foreground mt-1">Without incentives</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">With Incentives</p>
              <p className="text-3xl font-bold text-success mt-1">4.20%</p>
              <p className="text-xs text-muted-foreground mt-1">After optimization</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Net Lift</p>
              <p className="text-3xl font-bold text-primary mt-1">+33.3%</p>
              <p className="text-xs text-muted-foreground mt-1">Improvement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before/After Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-foreground">Conversion: Before vs After</CardTitle>
            <p className="text-sm text-muted-foreground">Comparison by incentive type</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.25 0.01 270)"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    stroke="oklch(0.5 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="oklch(0.5 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.01 270)",
                      border: "1px solid oklch(0.25 0.01 270)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    formatter={(value: number, name: string) => [`${value}%`, name === "before" ? "Before" : "After"]}
                  />
                  <Bar dataKey="before" name="Before" fill="oklch(0.4 0 0)" radius={[0, 4, 4, 0]} barSize={16} />
                  <Bar dataKey="after" name="After" fill="oklch(0.65 0.18 270)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">Before Incentive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">After Incentive</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Learning Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">AI-generated feedback from outcomes</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-lg border",
                  insightStyles[insight.type as keyof typeof insightStyles].bg,
                  insightStyles[insight.type as keyof typeof insightStyles].border,
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn("mt-0.5", insightStyles[insight.type as keyof typeof insightStyles].text)}>
                    {insight.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Learning Status */}
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">System Learning Active</p>
                <p className="text-sm text-muted-foreground">
                  The AI continuously observes outcomes and refines incentive strategies
                </p>
              </div>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">Auto-optimizing</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
