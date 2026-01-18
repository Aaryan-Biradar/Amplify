import { NextResponse } from "next/server";

export async function POST() {
  const mgmtKey = process.env.AMPLITUDE_EXPERIMENT_MGMT_KEY; // Bearer token
  const flagId = process.env.AMPLITUDE_HOME_LAYOUT_FLAG_ID;  // flag numeric/string ID

  if (!mgmtKey || !flagId) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  // TODO: fetch your chart result + compute winner, e.g. "cards"
  const winner = "cards";

  // Update the flag rollout to 100% and weight winner = 1
  const res = await fetch(`https://experiment.amplitude.com/api/1/flags/${flagId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${mgmtKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      enabled: true,
      rolloutPercentage: 100,
      rolloutWeights: { [winner]: 1 },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: "Flag update failed", details: text }, { status: 500 });
  }

  return NextResponse.json({ ok: true, winner });
}
