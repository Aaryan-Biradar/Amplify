"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <span className="w-1.5 h-1.5 rounded-full bg-success mr-2 animate-pulse" />
          Live
        </Badge>
        <span className="text-sm text-muted-foreground">Last updated: Just now</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
