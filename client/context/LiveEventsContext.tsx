"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LiveEvent {
    id: string;
    eventType: string;
    timestamp: Date;
    properties?: Record<string, unknown>;
}

interface LiveEventsContextType {
    events: LiveEvent[];
    pushEvent: (eventType: string, properties?: Record<string, unknown>) => void;
    clearEvents: () => void;
}

const LiveEventsContext = createContext<LiveEventsContextType | null>(null);

export function LiveEventsProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<LiveEvent[]>([]);

    const pushEvent = useCallback((eventType: string, properties?: Record<string, unknown>) => {
        const newEvent: LiveEvent = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            eventType,
            timestamp: new Date(),
            properties,
        };

        setEvents(prev => {
            const updated = [...prev, newEvent];
            // Keep only last 100 events
            return updated.slice(-100);
        });
    }, []);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    return (
        <LiveEventsContext.Provider value={{ events, pushEvent, clearEvents }}>
            {children}
        </LiveEventsContext.Provider>
    );
}

export function useLiveEvents() {
    const context = useContext(LiveEventsContext);
    if (!context) {
        throw new Error("useLiveEvents must be used within a LiveEventsProvider");
    }
    return context;
}
