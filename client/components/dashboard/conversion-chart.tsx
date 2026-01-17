"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { time: "00:00", baseline: 3.2, withIncentive: 3.2 },
  { time: "04:00", baseline: 2.8, withIncentive: 3.1 },
  { time: "08:00", baseline: 3.5, withIncentive: 4.2 },
  { time: "12:00", baseline: 4.1, withIncentive: 5.0 },
  { time: "16:00", baseline: 3.8, withIncentive: 4.8 },
  { time: "20:00", baseline: 3.4, withIncentive: 4.5 },
  { time: "Now", baseline: 3.6, withIncentive: 4.2 },
]

export function ConversionChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-foreground">Conversion Rate Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Comparing baseline vs incentive-driven conversions</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0 0)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0 0)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIncentive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 270)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.18 270)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 270)" />
              <XAxis dataKey="time" stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="oklch(0.5 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.01 270)",
                  border: "1px solid oklch(0.25 0.01 270)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                formatter={(value: number) => [`${value}%`]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span style={{ color: "oklch(0.65 0 0)" }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="baseline"
                name="Baseline"
                stroke="oklch(0.5 0 0)"
                fill="url(#colorBaseline)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="withIncentive"
                name="With Incentive"
                stroke="oklch(0.65 0.18 270)"
                fill="url(#colorIncentive)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
