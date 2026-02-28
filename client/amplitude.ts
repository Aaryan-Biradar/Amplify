// lib/amplitude.ts
"use client";

import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import { Experiment } from "@amplitude/experiment-js-client";
import { liveEventBus } from "@/lib/liveEventBus";
import { Types } from "@amplitude/analytics-browser";

let isInitialized = false;

// Lazy-initialize experiment client (avoids `location is not defined` during SSR)
let _experiment: ReturnType<typeof Experiment.initializeWithAmplitudeAnalytics> | null = null;
function getExperiment() {
  if (!_experiment && typeof window !== "undefined") {
    _experiment = Experiment.initializeWithAmplitudeAnalytics(
      process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY ?? ""
    );
  }
  return _experiment;
}

// Proxy keeps the `experiment.variant(...)` API working without module-scope init
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const experiment: any = new Proxy({} as any, {
  get(_target, prop) {
    const client = getExperiment();
    if (!client) return () => ({ value: undefined });
    return (client as any)[prop];
  },
});

// Create a plugin that intercepts ALL events and pushes to our live event bus
const liveEventPlugin = (): Types.EnrichmentPlugin => {
  return {
    name: 'live-event-interceptor',
    type: 'enrichment',
    execute: async (event) => {
      // Push every tracked event to our live event bus
      if (event.event_type) {
        liveEventBus.push(event.event_type, event.event_properties as Record<string, unknown> || {});
      }
      return event;
    },
  };
};

export function initAmplitude() {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) {
    console.warn("Missing NEXT_PUBLIC_AMPLITUDE_API_KEY");
    return;
  }

  // Add session replay plugin
  amplitude.add(
    sessionReplayPlugin({
      forceSessionTracking: true,
      sampleRate: 1,
    })
  );

  // Add our live event interceptor plugin
  amplitude.add(liveEventPlugin());

  amplitude.init(apiKey, undefined, {
    defaultTracking: true,
    autocapture: {
      elementInteractions: true,
      pageViews: true,
      sessions: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });

  if (process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY) {
    experiment.start().catch((e: any) => console.warn("Experiment start failed", e));
  }

  isInitialized = true;
}

export function Amplitude() {
  useEffect(() => {
    initAmplitude();
  }, []);

  return null;
}

export default amplitude;