// Global event bus for live events - syncs across browser tabs using BroadcastChannel
type LiveEvent = {
    id: string;
    eventType: string;
    timestamp: Date;
    properties?: Record<string, unknown>;
};

type EventListener = (event: LiveEvent) => void;

class LiveEventBus {
    private events: LiveEvent[] = [];
    private listeners: EventListener[] = [];
    private maxEvents = 100;
    private channel: BroadcastChannel | null = null;

    constructor() {
        // Initialize BroadcastChannel for cross-tab sync (only in browser)
        if (typeof window !== 'undefined') {
            try {
                this.channel = new BroadcastChannel('live-events-channel');
                this.channel.onmessage = (event) => {
                    if (event.data?.type === 'new-event') {
                        const liveEvent = {
                            ...event.data.event,
                            timestamp: new Date(event.data.event.timestamp)
                        };
                        this.receiveFromOtherTab(liveEvent);
                    }
                };
            } catch (e) {
                console.warn('BroadcastChannel not supported');
            }
        }
    }

    private receiveFromOtherTab(event: LiveEvent) {
        // Add to local events without broadcasting again
        this.events.push(event);
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }
        // Notify local listeners
        this.listeners.forEach(listener => listener(event));
    }

    push(eventType: string, properties?: Record<string, unknown>) {
        const event: LiveEvent = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            eventType,
            timestamp: new Date(),
            properties,
        };

        this.events.push(event);
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }

        // Notify local listeners
        this.listeners.forEach(listener => listener(event));

        // Broadcast to other tabs
        if (this.channel) {
            this.channel.postMessage({
                type: 'new-event',
                event: {
                    ...event,
                    timestamp: event.timestamp.toISOString()
                }
            });
        }
    }

    getEvents(): LiveEvent[] {
        return [...this.events];
    }

    getLatest(): LiveEvent | null {
        return this.events[this.events.length - 1] || null;
    }

    subscribe(listener: EventListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    clear() {
        this.events = [];
    }
}

// Singleton instance
export const liveEventBus = new LiveEventBus();
export type { LiveEvent };
