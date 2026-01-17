// lib/amplitude.ts
"use client";

import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";  
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import { Experiment } from "@amplitude/experiment-js-client";

let isInitialized = false;


export const experiment = Experiment.initializeWithAmplitudeAnalytics(
  process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY ?? ""
);

export function initAmplitude() {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) {
    console.warn("Missing NEXT_PUBLIC_AMPLITUDE_API_KEY");
    return;
  }

  amplitude.add(
    sessionReplayPlugin({
      forceSessionTracking: true,
      sampleRate: 1,
    })
  );


  amplitude.init(apiKey, undefined, {
    autocapture: true,
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });


  experiment.start();

  isInitialized = true;
}

export function Amplitude() {
  useEffect(() => {
    initAmplitude();
  }, []);

  return null;
}

export default amplitude;