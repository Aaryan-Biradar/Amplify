// lib/experiment.ts
"use client";

import { experiment } from "@/amplitude";

export function getHomeLayout(): string {
  const variant = experiment.variant("home_layout");
  return variant?.value ?? "classic";
}
