"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedRadarChart } from "./animated-radar-chart"
import { Activity, Zap, Clock, MousePointer, ChevronRight } from "lucide-react"
import { LiveEventsNarration } from "./live-events-narration"

interface ShopperProfile {
  type: string
  traits: number[]
  confidence: number
  signals: string[]
  incentive: string
  incentiveReason: string
  sessionId: string
  timeOnSite: string
  signalsDetected: number
  lastBehavior: string
}

const TRAIT_LABELS = ["Hesitancy", "Price Sense", "Research", "Decision", "Engagement"]

const SHOPPER_PROFILES: ShopperProfile[] = [
  {
    type: "Hesitant Researcher",
    traits: [20, 30, 95, 35, 85],
    confidence: 94,
    signals: ["Multiple category views", "Feature comparisons", "Review reading"],
    incentive: "Extended Research Window",
    incentiveReason: "Reduces time pressure anxiety",
    sessionId: "SH-7829A",
    timeOnSite: "4m 32s",
    signalsDetected: 12,
    lastBehavior: "Opened size guide",
  },
  {
    type: "Price-Conscious",
    traits: [75, 95, 45, 60, 55],
    confidence: 88,
    signals: ["Cart price checks", "Competitor tab open", "Discount code attempt"],
    incentive: "Volume-Based Discount",
    incentiveReason: "Addresses value perception",
    sessionId: "SH-4521B",
    timeOnSite: "2m 18s",
    signalsDetected: 8,
    lastBehavior: "Removed item from cart",
  },
  {
    type: "Anxious Buyer",
    traits: [85, 60, 55, 25, 40],
    confidence: 91,
    signals: ["Add-to-cart hesitation", "Return policy views", "Trust badge hovers"],
    incentive: "Risk-Free Returns",
    incentiveReason: "Eliminates purchase anxiety",
    sessionId: "SH-9183C",
    timeOnSite: "6m 45s",
    signalsDetected: 15,
    lastBehavior: "Viewed shipping FAQ",
  },
  {
    type: "Ready Buyer",
    traits: [15, 40, 35, 95, 80],
    confidence: 92,
    signals: ["Direct navigation", "Quick add-to-cart", "Payment page visit"],
    incentive: "Priority Shipping",
    incentiveReason: "Maximizes high intent",
    sessionId: "SH-6734D",
    timeOnSite: "1m 12s",
    signalsDetected: 5,
    lastBehavior: "Entered checkout",
  },
  {
    type: "Window Shopper",
    traits: [50, 45, 70, 50, 75],
    confidence: 85,
    signals: ["Casual browsing", "Wishlist additions", "Newsletter hover"],
    incentive: "Early Access Offer",
    incentiveReason: "Nurtures future conversion",
    sessionId: "SH-2847E",
    timeOnSite: "8m 03s",
    signalsDetected: 9,
    lastBehavior: "Saved to wishlist",
  },
]

// Default empty profile
const DEFAULT_PROFILE: ShopperProfile = {
  type: "Analyzing...",
  traits: [10, 10, 10, 10, 10],
  confidence: 0,
  signals: [],
  incentive: "Analyzing...",
  incentiveReason: "Waiting for user action",
  sessionId: "LIVE-SESSION",
  timeOnSite: "0m 0s",
  signalsDetected: 0,
  lastBehavior: "Waiting..."
}

const CYCLE_DURATION = 5000

import { liveEventBus } from "@/lib/liveEventBus"

export function LiveShopperProfiler() {
  const [activeProfile, setActiveProfile] = useState<ShopperProfile>(DEFAULT_PROFILE)
  const [isMorphing, setIsMorphing] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const previousTraitsRef = useRef<number[]>([10, 10, 10, 10, 10])

  const currentProfile = activeProfile

  useEffect(() => {
    // Subscribe to live profile updates
    const unsubscribe = liveEventBus.subscribe((event) => {
      if (event.eventType === 'profile_update') {
        const liveProfile = event.properties as unknown as any;

        // Ensure scores never decrease - take maximum of previous and new values, but CAP at 100
        const cumulativeTraits = liveProfile.traits.map((newValue: number, index: number) => {
          const maxVal = Math.max(newValue, previousTraitsRef.current[index] || 0);
          return Math.min(maxVal, 100);
        });

        // Update the ref with new cumulative values
        previousTraitsRef.current = cumulativeTraits;

        setActiveProfile({
          type: liveProfile.type,
          traits: cumulativeTraits,
          confidence: liveProfile.confidence,
          signals: ["Live Action Detected"],
          incentive: liveProfile.incentive,
          incentiveReason: liveProfile.incentiveReason,
          sessionId: liveProfile.sessionId,
          timeOnSite: liveProfile.timeOnSite,
          signalsDetected: liveProfile.signalsDetected,
          lastBehavior: "Active"
        });

        // Trigger morph animation
        setIsMorphing(true);
        setShowDetails(false);
        setTimeout(() => {
          setIsMorphing(false);
          setShowDetails(true);
        }, 600);
      }
    });

    return () => unsubscribe();
  }, [])

  // Get status color based on confidence
  const getStatusColor = (confidence: number) => {
    if (confidence >= 90) return "bg-emerald-500"
    if (confidence >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="w-full min-h-full bg-black relative overflow-y-auto">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative w-full h-full flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isMorphing ? "bg-cyan-400 animate-pulse" : "bg-emerald-400"}`} />
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                {isMorphing ? "Analyzing" : "Live"}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {SHOPPER_PROFILES.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentProfileIndex ? "bg-cyan-400" : "bg-zinc-700"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Main grid layout */}
        <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-3 p-4 min-h-0">
          {/* Left Panel - Session Context */}
          <div
            className="col-span-3 row-span-4 flex flex-col gap-3 transition-opacity duration-500"
            style={{ opacity: showDetails ? 1 : 0.3 }}
          >
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-800/50 rounded-lg p-4 flex-1">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Session Context</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-800/50 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase">Session ID</p>
                    <p className="text-sm font-mono text-zinc-300">{currentProfile.sessionId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-800/50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase">Signals</p>
                    <p className="text-sm font-mono text-zinc-300">{currentProfile.signalsDetected} detected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-800/50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase">Time on Site</p>
                    <p className="text-sm font-mono text-zinc-300">{currentProfile.timeOnSite}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-800/50 flex items-center justify-center">
                    <MousePointer className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase">Last Action</p>
                    <p className="text-sm text-zinc-300">{currentProfile.lastBehavior}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Polygraph (dominant) */}
          <div className="col-span-6 row-span-5 flex items-center justify-center relative">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, rgba(0, 255, 255, 0.03) 0%, transparent 60%)`,
              }}
            />

            {/* Radar Chart */}
            <div className="w-full h-full max-w-[500px] max-h-[500px] aspect-square">
              <AnimatedRadarChart
                data={currentProfile.traits}
                labels={TRAIT_LABELS}
                isMorphing={isMorphing}
              />
            </div>
          </div>

          {/* Right Top Panel - Profile Status */}
          <div
            className="col-span-3 row-span-2 transition-opacity duration-500"
            style={{ opacity: showDetails ? 1 : 0.3 }}
          >
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-800/50 rounded-lg p-4 h-full">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Profile Status</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(currentProfile.confidence)}`} />
                    <span className="text-xs font-mono text-emerald-400">Active</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-500">Confidence</span>
                    <span className="text-xs font-mono text-cyan-400">{currentProfile.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${currentProfile.confidence}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-500">Type</span>
                  <p className="text-sm font-medium text-zinc-200 mt-0.5">{currentProfile.type}</p>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(currentProfile.confidence)}`} />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Middle Panel - Engagement Signals */}
          <div
            className="col-span-3 row-span-2 transition-opacity duration-500"
            style={{ opacity: showDetails ? 1 : 0.3 }}
          >
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-800/50 rounded-lg p-4 h-full">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Engagement Signals</h3>

              <div className="space-y-2.5">
                {TRAIT_LABELS.map((label, i) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-zinc-500">{label}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{currentProfile.traits[i]}%</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${currentProfile.traits[i]}%`,
                          background:
                            currentProfile.traits[i] > 70
                              ? "linear-gradient(90deg, #22d3ee, #14b8a6)"
                              : currentProfile.traits[i] > 40
                                ? "linear-gradient(90deg, #a78bfa, #8b5cf6)"
                                : "linear-gradient(90deg, #52525b, #3f3f46)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Bottom Panel - Recommended Action */}
          <div
            className="col-span-3 row-span-2 transition-opacity duration-500"
            style={{ opacity: showDetails ? 1 : 0.3 }}
          >
            <div className="bg-zinc-900/40 backdrop-blur border border-cyan-900/30 rounded-lg p-4 h-full relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 relative">
                Recommended Adaptation
              </h3>

              <div className="space-y-3 relative">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-cyan-400">{currentProfile.incentive}</p>
                    <p className="text-xs text-zinc-500 mt-1">{currentProfile.incentiveReason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: "78%" }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">+78% lift</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left - Detected Signals Log */}
          <div
            className="col-span-3 row-span-2 transition-opacity duration-500"
            style={{ opacity: showDetails ? 1 : 0.3 }}
          >
            <div className="bg-zinc-900/40 backdrop-blur border border-zinc-800/50 rounded-lg p-4 h-full">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Signal Log</h3>

              <div className="space-y-2">
                {currentProfile.signals.map((signal, i) => (
                  <div
                    key={`${currentProfile.type}-${i}`}
                    className="flex items-center gap-2 text-xs transition-all duration-300"
                    style={{
                      transitionDelay: `${i * 100}ms`,
                    }}
                  >
                    <div className="w-1 h-1 rounded-full bg-cyan-400" />
                    <span className="text-zinc-400">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Center - AI Narration Chat */}
          <div className="col-span-6 row-span-50">
            <LiveEventsNarration />
          </div>
        </div>
      </div>
    </div>
  )
}
