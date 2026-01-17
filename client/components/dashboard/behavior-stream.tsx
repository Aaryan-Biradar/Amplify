"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreamEvent {
  id: string
  type: "hesitation" | "incentive" | "conversion" | "abandoned"
  message: string
  time: string
}

const initialEvents: StreamEvent[] = [
  { id: "1", type: "conversion", message: "Checkout completed after incentive", time: "2s ago" },
  { id: "2", type: "incentive", message: "Extended returns shown to hesitant user", time: "15s ago" },
  { id: "3", type: "hesitation", message: "Hesitation detected at checkout", time: "18s ago" },
  { id: "4", type: "incentive", message: "Inventory hold triggered", time: "32s ago" },
  { id: "5", type: "hesitation", message: "Cart idle for 45 seconds", time: "35s ago" },
  { id: "6", type: "abandoned", message: "Session ended without purchase", time: "1m ago" },
  { id: "7", type: "conversion", message: "Purchase completed", time: "2m ago" },
]

const eventStyles = {
  hesitation: { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" },
  incentive: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  conversion: { bg: "bg-success/10", text: "text-success", dot: "bg-success" },
  abandoned: { bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
}

export function BehaviorStream() {
  const [events, setEvents] = useState(initialEvents)

  useEffect(() => {
    const interval = setInterval(() => {
      const newEventTypes: StreamEvent["type"][] = ["hesitation", "incentive", "conversion", "abandoned"]
      const messages = {
        hesitation: ["Hesitation detected at checkout", "Cart idle detected", "User revisiting cart"],
        incentive: ["Confidence panel shown", "Extended returns offered", "Inventory hold triggered"],
        conversion: ["Checkout completed", "Purchase after incentive", "Conversion recorded"],
        abandoned: ["Session ended", "Cart abandoned", "User left checkout"],
      }

      const type = newEventTypes[Math.floor(Math.random() * newEventTypes.length)]
      const message = messages[type][Math.floor(Math.random() * messages[type].length)]

      const newEvent: StreamEvent = {
        id: Date.now().toString(),
        type,
        message,
        time: "Just now",
      }

      setEvents((prev) => [newEvent, ...prev.slice(0, 6)])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
          <Activity className="w-4 h-4 text-primary" />
          Behavior Stream
          <Badge variant="outline" className="ml-auto text-xs bg-primary/10 text-primary border-primary/20">
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg transition-all",
              eventStyles[event.type].bg,
              index === 0 && "animate-in fade-in slide-in-from-top-2 duration-300",
            )}
          >
            <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", eventStyles[event.type].dot)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", eventStyles[event.type].text)}>{event.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
