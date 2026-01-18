"use client";

import { useState, useEffect, useRef } from "react";
import { Radio } from "lucide-react";
import { liveEventBus, LiveEvent } from "@/lib/liveEventBus";

export function LiveEventsNarration() {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isLive, setIsLive] = useState(true);
    const [queue, setQueue] = useState<string[]>([]);
    const typingRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Format time as [10:05:37 PM EST]
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'America/New_York'
        }) + ' EST';
    };

    // Generate detailed narration from event type and properties
    const generateNarration = (event: LiveEvent): string => {
        const type = event.eventType.toLowerCase();
        const time = formatTime(event.timestamp);
        const props = event.properties || {};

        // Extract common Amplitude auto-capture properties
        const elementText = (props['[Amplitude] Element Text'] as string) ||
            (props.element_text as string) ||
            (props.text as string) || '';
        const elementTag = (props['[Amplitude] Element Tag'] as string) || '';
        const pageTitle = (props['[Amplitude] Page Title'] as string) ||
            (props.page_title as string) || '';
        const pageUrl = (props['[Amplitude] Page URL'] as string) ||
            (props.page_url as string) || '';

        // Checkout events
        if (type.includes('checkout_started')) {
            const total = props.total ? ` ($${Number(props.total).toFixed(2)})` : '';
            return `[${time}] User initiated checkout${total}.`;
        }
        if (type.includes('checkout_exit')) {
            const duration = props.duration_ms ? ` after ${Math.round(Number(props.duration_ms) / 1000)}s` : '';
            return `[${time}] User exited checkout${duration}.`;
        }

        // Cart events
        if (type.includes('add_to_cart')) {
            const name = (props.product_name as string) || 'item';
            const price = props.price ? ` ($${Number(props.price).toFixed(2)})` : '';
            return `[${time}] Added "${name}" to cart${price}.`;
        }
        if (type.includes('remove_from_cart')) {
            const name = (props.product_name as string) || 'item';
            return `[${time}] Removed "${name}" from cart.`;
        }

        // Quantity changes
        if (type.includes('quantity_increased')) {
            const name = (props.product_name as string) || 'item';
            const oldQty = props.old_quantity || '?';
            const newQty = props.new_quantity || '?';
            return `[${time}] Increased "${name}" quantity (${oldQty} → ${newQty}).`;
        }
        if (type.includes('quantity_decreased')) {
            const name = (props.product_name as string) || 'item';
            const oldQty = props.old_quantity || '?';
            const newQty = props.new_quantity || '?';
            return `[${time}] Decreased "${name}" quantity (${oldQty} → ${newQty}).`;
        }

        // Product viewed (our custom event)
        if (type.includes('product_viewed')) {
            const name = (props.product_name as string) || 'product';
            const price = props.price ? ` ($${Number(props.price).toFixed(2)})` : '';
            return `[${time}] Viewing "${name}"${price}.`;
        }

        // Page views
        if (type.includes('page_view') || type.includes('pageview')) {
            // Check if we have path or URL info
            const path = (props['[Amplitude] Page Path'] as string) ||
                (props.pathname as string) ||
                (props.path as string) || '';
            const url = (props['[Amplitude] Page URL'] as string) ||
                (props.url as string) || '';

            // Match specific paths
            if (path.includes('/cart') || url.includes('/cart')) {
                return `[${time}] Reviewing Cart.`;
            }
            if (path.includes('/checkout') || url.includes('/checkout')) {
                return `[${time}] At Checkout.`;
            }
            if (path === '/' || path.match(/\/$/) || (url.match(/\/$/) && !url.includes('/product'))) {
                return `[${time}] Browsing Storefront.`;
            }
            if (path.includes('/dashboard') || url.includes('/dashboard')) {
                return `[${time}] Monitoring Dashboard.`;
            }
            if (path.includes('/product') || url.includes('/product')) {
                return `[${time}] Viewing Product Details.`;
            }

            // Fallback to title
            if (pageTitle && pageTitle.length < 50 && !pageTitle.includes('Adaptiv')) {
                return `[${time}] Viewing "${pageTitle}".`;
            }

            return `[${time}] Navigated to new page.`;
        }

        // Viewed element (Amplitude auto-capture format)
        if (type.startsWith('[amplitude] viewed')) {
            const match = event.eventType.match(/viewed\s+"?([^"]+)"?\s+/i);
            if (match) {
                return `[${time}] Viewed ${match[1]}.`;
            }
            return `[${time}] ${event.eventType.replace('[Amplitude] ', '')}.`;
        }

        // Click events
        if (type.includes('click') || type.startsWith('[amplitude] clicked')) {
            if (elementText) {
                const truncated = elementText.length > 30 ? elementText.slice(0, 30) + '...' : elementText;
                return `[${time}] Clicked "${truncated}".`;
            }
            const match = event.eventType.match(/clicked\s+"?([^"]+)"?/i);
            if (match) {
                return `[${time}] Clicked "${match[1]}".`;
            }
            return `[${time}] User clicked element.`;
        }

        // Form events
        if (type.includes('form')) {
            if (type.includes('start')) {
                return `[${time}] Started filling out form.`;
            }
            if (type.includes('submit')) {
                return `[${time}] Form submitted.`;
            }
            return `[${time}] Form interaction.`;
        }

        // Search
        if (type.includes('search')) {
            const query = props.query || props.search_query || '';
            if (query) {
                return `[${time}] Searched for "${query}".`;
            }
            return `[${time}] User searching.`;
        }

        // Purchase
        if (type.includes('purchase') || type.includes('order')) {
            const total = props.total || props.revenue;
            if (total) {
                return `[${time}] Purchase completed! ($${Number(total).toFixed(2)})`;
            }
            return `[${time}] Purchase completed!`;
        }

        // Session events
        if (type.includes('session_start')) {
            return `[${time}] New session started.`;
        }
        if (type.includes('session_end')) {
            return `[${time}] Session ended.`;
        }

        // Default: show the raw event type (cleaned up)
        const cleanType = event.eventType.replace('[Amplitude] ', '').replace(/^\[|\]$/g, '');
        return `[${time}] ${cleanType}.`;
    };

    // Typewriter effect for current line
    const typeText = (text: string) => {
        if (typingRef.current) clearInterval(typingRef.current);

        setIsTyping(true);
        setCurrentLine("");
        let currentIndex = 0;

        typingRef.current = setInterval(() => {
            if (currentIndex < text.length) {
                setCurrentLine(prev => prev + text[currentIndex]);
                currentIndex++;

                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            } else {
                if (typingRef.current) clearInterval(typingRef.current);
                setIsTyping(false);

                // Move current line to completed lines
                setLines(prev => [...prev.slice(-50), text]);
                setCurrentLine("");

                // Process next in queue
                setQueue(prev => {
                    if (prev.length > 0) {
                        const [next, ...rest] = prev;
                        setTimeout(() => typeText(next), 100);
                        return rest;
                    }
                    return prev;
                });
            }
        }, 5); // Very fast typing
    };

    // Add narration to queue
    const addNarration = (narration: string) => {
        if (isTyping) {
            setQueue(prev => [...prev, narration]);
        } else {
            typeText(narration);
        }
    };

    // Subscribe to live events
    useEffect(() => {
        if (!isLive) return;

        const handleEvent = (event: LiveEvent) => {
            const narration = generateNarration(event);
            addNarration(narration);
        };

        // Subscribe to new events
        const unsubscribe = liveEventBus.subscribe(handleEvent);

        // Show existing events
        const existingEvents = liveEventBus.getEvents();
        existingEvents.slice(-5).forEach(event => {
            const narration = generateNarration(event);
            setLines(prev => [...prev, narration]);
        });

        return () => {
            unsubscribe();
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, [isLive]);

    useEffect(() => {
        return () => {
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, []);

    return (
        <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/50 rounded-xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? "bg-cyan-400 animate-pulse" : "bg-emerald-400"}`} />
                    <span className="text-xs font-medium text-zinc-200">Live Narration</span>
                </div>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${isLive
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-700/50 text-zinc-400"
                        }`}
                >
                    <Radio className={`w-3 h-3 ${isLive ? "animate-pulse" : ""}`} />
                    {isLive ? "LIVE" : "PAUSED"}
                </button>
            </div>

            {/* Narration Text Area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 min-h-0 font-mono text-xs"
            >
                {lines.map((line, idx) => (
                    <div key={idx} className="text-zinc-300 leading-6">{line}</div>
                ))}
                {currentLine && (
                    <div className="text-zinc-300 leading-6">
                        {currentLine}
                        <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-0.5 align-middle" />
                    </div>
                )}
                {lines.length === 0 && !currentLine && (
                    <p className="text-zinc-600 italic">Waiting for user activity...</p>
                )}
            </div>
        </div>
    );
}
