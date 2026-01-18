import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ chartId: string }> }
) {
  const { chartId } = await ctx.params;

  const apiKey = process.env.AMPLITUDE_API_KEY;
  const secretKey = process.env.AMPLITUDE_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      { error: "Missing Amplitude credentials" },
      { status: 500 }
    );
  }

  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  const url = `https://amplitude.com/api/3/chart/${chartId}/csv`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Amplitude fetch failed", details: text },
      { status: 500 }
    );
  }

  const csv = await res.text();
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv" },
  });
}
