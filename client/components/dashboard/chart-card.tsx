"use client"

export default function ChartCard({
  title,
  embedUrl,
}: {
  title: string
  embedUrl: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4 text-foreground shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>

      <div className="overflow-hidden rounded-lg border bg-background" style={{ height: 420 }}>
        <iframe
          src={embedUrl}
          className="h-full w-full"
          loading="lazy"
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
