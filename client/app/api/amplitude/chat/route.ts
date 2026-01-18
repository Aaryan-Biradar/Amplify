import { NextResponse } from 'next/server';

type ChatReq = { message: string };

// Amplitude Dashboard API for fetching recent events
async function fetchAmplitudeEvents() {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    const secretKey = process.env.AMPLITUDE_SECRET_KEY;

    if (!apiKey || !secretKey) {
        console.error('Missing Amplitude API credentials');
        return null;
    }

    // Calculate time range - last 24 hours
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Format: YYYYMMDDTHH (must be full hours)
    const formatAmplitudeDate = (d: Date) => {
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const hour = String(d.getUTCHours()).padStart(2, '0');
        return `${year}${month}${day}T${hour}`;
    };

    const startStr = formatAmplitudeDate(start);
    const endStr = formatAmplitudeDate(now);

    console.log(`Fetching Amplitude events from ${startStr} to ${endStr}`);

    try {
        const response = await fetch(
            `https://amplitude.com/api/2/export?start=${startStr}&end=${endStr}`,
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64'),
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Amplitude API error:', response.status, errorText);
            return null;
        }

        // Response is gzipped NDJSON - each line is a JSON event
        const text = await response.text();

        if (!text || text.trim().length === 0) {
            console.log('No events returned from Amplitude');
            return [];
        }

        const lines = text.trim().split('\n').filter(l => l.trim());
        console.log(`Received ${lines.length} events from Amplitude`);

        const events = lines.slice(-50).map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                return null;
            }
        }).filter(Boolean);

        return events;
    } catch (error) {
        console.error('Failed to fetch from Amplitude:', error);
        return null;
    }
}

export async function POST(req: Request) {
    const body = (await req.json()) as ChatReq;

    const events = await fetchAmplitudeEvents();

    if (!events || events.length === 0) {
        return NextResponse.json({
            answer: 'No events available from Amplitude.',
            events: []
        });
    }

    // Get the most recent events
    const recentEvents = events.slice(-10);

    // Format events for display
    const eventList = recentEvents.map((e: { event_type?: string }) =>
        `- ${e.event_type || 'unknown'}`
    ).join('\n');

    return NextResponse.json({
        answer: `Recent events:\n${eventList}`,
        events: recentEvents.map((e: { event_type?: string }) => e.event_type || 'unknown')
    });
}
