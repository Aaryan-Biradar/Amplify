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

    // Helper to render bold text
    const renderLine = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={i} className="font-bold text-zinc-200">{part.slice(2, -2)}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    // AI Shopper Analysis State
    type ShopperState = {
        viewedProducts: Set<string>;
        cartTotal: number;
        cartItems: number;
        checkoutVisits: number;
        lastEventTime: number;
        hesitationCount: number;
        categoriesViewed: Set<string>;
        hasAddedToCart: boolean;
        sessionStartTime: number;
    };

    const shopperProfile = useRef<ShopperState>({
        viewedProducts: new Set(),
        cartTotal: 0,
        cartItems: 0,
        checkoutVisits: 0,
        lastEventTime: Date.now(),
        hesitationCount: 0,
        categoriesViewed: new Set(),
        hasAddedToCart: false,
        sessionStartTime: Date.now(),
    });

    // Calculate and broadcast Shopper Profile locally (Fast Path)
    const broadcastProfileUpdate = (state: ShopperState, aiData?: any) => {
        if (aiData) {
            console.log("AI Agent: Broadcasting profile update (AI Autoritative)", aiData);
            // Authoritative AI Update
            liveEventBus.push('profile_update', {
                traits: [
                    aiData.scores.hesitancy,
                    aiData.scores.price_sense,
                    aiData.scores.research,
                    aiData.scores.decision,
                    aiData.scores.engagement
                ],
                type: aiData.current_archetype,
                confidence: aiData.confidence || aiData.confidence_score,
                is_confirmed: aiData.is_confirmed,
                incentive: aiData.next_best_action,
                incentiveReason: "AI Strategy",
                sessionId: "LIVE-" + state.sessionStartTime.toString().slice(-4),
                signalsDetected: state.viewedProducts.size + state.cartItems + state.checkoutVisits,
                timeOnSite: `${Math.floor((Date.now() - state.sessionStartTime) / 60000)}m ${Math.floor(((Date.now() - state.sessionStartTime) % 60000) / 1000)}s`
            });
            return;
        }

        // --- Local Heuristics Fallback ---
        // Calculate basic scores based on state if AI is unavailable
        const scores = {
            hesitancy: Math.min(100, (state.hesitationCount * 20) + (state.viewedProducts.size > 4 ? 30 : 10)),
            price_sense: state.cartTotal > 15 ? 40 : 70,
            research: Math.min(100, state.viewedProducts.size * 20),
            decision: Math.min(100, (state.cartItems * 30) + (state.checkoutVisits * 35)),
            engagement: Math.min(100, (state.viewedProducts.size * 10) + 20)
        };

        let archetype = "Analyzing...";
        if (scores.decision > 70) archetype = "Surgical Buyer (Local)";
        else if (scores.research > 60) archetype = "Hesitant Researcher (Local)";
        else if (scores.hesitancy > 50) archetype = "Anxious Shopper (Local)";

        console.log("AI Agent: Falling back to Local Heuristics", scores);

        liveEventBus.push('profile_update', {
            traits: [scores.hesitancy, scores.price_sense, scores.research, scores.decision, scores.engagement],
            type: archetype,
            confidence: 50, // Local is less confident
            is_confirmed: false,
            incentive: state.cartItems > 0 ? "Limited Time Offer" : "Explore More",
            incentiveReason: "Heuristic fallback",
            sessionId: "LOCAL-" + state.sessionStartTime.toString().slice(-4),
            signalsDetected: state.viewedProducts.size + state.cartItems,
            timeOnSite: "Local Tracking"
        });
    };

    // Update State (MUTATION - Run Once)
    const updateShopperState = (event: LiveEvent) => {
        const type = event.eventType.toLowerCase();
        const props = event.properties || {};
        const state = shopperProfile.current;
        const now = Date.now();

        state.lastEventTime = now;

        // Track Product Views
        if (type.includes('product_viewed')) {
            const productName = (props.product_name as string) || 'unknown product';
            state.viewedProducts.add(productName);
        }

        // Track Cart Actions
        if (type.includes('add_to_cart')) {
            state.hasAddedToCart = true;
            state.cartItems++;
            const price = props.price ? Number(props.price) : 0;
            state.cartTotal += price;
        }
        if (type.includes('remove_from_cart')) {
            state.cartItems = Math.max(0, state.cartItems - 1);
            state.hesitationCount++; // Removal is a hesitation signal
        }

        // Track Checkout
        if (type.includes('checkout_started')) state.checkoutVisits++;
        if (type.includes('checkout_exit')) state.hesitationCount++;
    };


    // AI Agent Engine
    const askAgent = async (event: LiveEvent, currentState: ShopperState): Promise<string | null> => {
        // Skip AI for high-frequency low-value events locally if needed, 
        // but for this demo we want "Thinking Out Loud" on interesting actions.
        if (event.eventType.includes('scroll') || event.eventType.includes('form')) return null;

        try {
            console.log("AI Agent: Requesting analysis for", event.eventType);
            const response = await fetch('/api/ai/narrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event,
                    shopperState: {
                        ...currentState,
                        viewedProducts: Array.from(currentState.viewedProducts),
                        categoriesViewed: Array.from(currentState.categoriesViewed)
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("AI Agent: Route error", response.status, errorData);
                // Trigger Local Fallback on API failure
                broadcastProfileUpdate(currentState);
                const rawError = errorData.debug_error || errorData.message || "Unknown Error";
                return `⚠️ AI Error: ${rawError.substring(0, 40)}... (Falling back)`;
            }

            const data = await response.json();
            console.log("AI Agent: Response received", data);

            // Broadcast the AI's deep analysis to the visualizer
            if (data.scores) {
                broadcastProfileUpdate(currentState, data);
            }

            return data.live_narration;
        } catch (error) {
            console.error("AI Error", error);
            broadcastProfileUpdate(currentState); // Fallback on network error too
            return `❌ Network Error: Using Local Detective.`;
        }
    };

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
            return `[${time}] Added "**${name}**" to cart${price}.`;
        }
        if (type.includes('remove_from_cart')) {
            const name = (props.product_name as string) || 'item';
            return `[${time}] Removed "**${name}**" from cart.`;
        }

        // Quantity changes
        if (type.includes('quantity_increased')) {
            const name = (props.product_name as string) || 'item';
            const oldQty = props.old_quantity || '?';
            const newQty = props.new_quantity || '?';
            return `[${time}] Increased "**${name}**" quantity (${oldQty} → ${newQty}).`;
        }
        if (type.includes('quantity_decreased')) {
            const name = (props.product_name as string) || 'item';
            const oldQty = props.old_quantity || '?';
            const newQty = props.new_quantity || '?';
            return `[${time}] Decreased "**${name}**" quantity (${oldQty} → ${newQty}).`;
        }

        // Product viewed (our custom event)
        if (type.includes('product_viewed')) {
            const name = (props.product_name as string) || 'product';
            const price = props.price ? ` ($${Number(props.price).toFixed(2)})` : '';
            return `[${time}] Viewing "**${name}**"${price}.`;
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
                return `[${time}] **Purchase completed!** ($${Number(total).toFixed(2)})`;
            }
            return `[${time}] **Purchase completed!**`;
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

        let debounceTimer: NodeJS.Timeout;

        const handleEvent = (event: LiveEvent) => {
            // Special handling for UI optimization triggers
            if (event.eventType === 'ui_optimization_triggered') {
                const props = event.properties as any;
                const uiChange = props.uiChange || "Unknown";
                const triggerMetric = props.triggerMetric || "Unknown";
                const archetype = props.archetype || "Unknown";

                const announcement = `🚀 **UI OPTIMIZATION ACTIVATED**: ${triggerMetric} metric exceeded 80% threshold, confirming ${archetype} behavior. Implementing **${uiChange}** to maximize conversion.`;
                addNarration(announcement);
                return; // Don't process this as a regular event
            }

            // 1. Immediate Local Narration (Fast feedback)
            const localNarration = generateNarration(event);
            addNarration(localNarration);

            // 2. Update Internal State
            updateShopperState(event);

            // 3. Ask AI for Deep Analysis (Debounced to prevent spamming)
            // Only for "Meaningful" events
            const isMeaningful = event.eventType.match(/viewed|viewing|cart|checkout|search|purchase|click|scan/i);

            if (isMeaningful) {
                console.log("AI Agent: Triggering AI for meaningful event", event.eventType);
                clearTimeout(debounceTimer);

                debounceTimer = setTimeout(() => {
                    if (isMeaningful) {
                        console.log("[AI Trigger] Meaningful event detected, calling AI...");
                        askAgent(event, shopperProfile.current).then(narration => {
                            if (narration) addNarration(narration);
                        });
                    }
                }, 5000); // 5 second debounce for free tier rate limits
            } else {
                // console.log("AI Agent: Skipping non-meaningful event", event.eventType);
            }
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
            clearTimeout(debounceTimer);
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, [isLive]);

    useEffect(() => {
        // Auto-scroll on lines update
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines, currentLine]);

    useEffect(() => {
        return () => {
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, []);

    // Manual test function
    const simulateAIEvent = () => {
        const mockEvent = { eventType: 'MANUAL_PING', timestamp: new Date(), id: 'ping' };
        addNarration("[System] Pinging AI Detective for link status...");
        askAgent(mockEvent as any, shopperProfile.current).then(res => {
            if (res) addNarration(res);
        });
    };

    return (
        <div className="h-full w-full bg-[#0a0a0a] font-mono text-xs flex flex-col">
            <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-[#0a0a0a]">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                    <span className="font-bold text-zinc-300">Live Narration</span>
                </div>
                <div className="h-3 w-[1px] bg-zinc-800" />
                <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">AI Detective Agent</span>
                </div>
                <button
                    onClick={simulateAIEvent}
                    className="ml-auto text-[10px] text-zinc-600 hover:text-cyan-400 transition-colors uppercase tracking-wider"
                >
                    Test AI
                </button>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
            >
                {lines.map((line, i) => (
                    <div key={i} className="text-zinc-400 leading-relaxed font-mono">
                        {renderLine(line)}
                    </div>
                ))}
                {currentLine && (
                    <div className="text-zinc-600 animate-pulse">
                        {renderLine(currentLine)}
                    </div>
                )}
                {/* Invisible element to anchor scroll to bottom */}
                <div id="scroll-anchor" className="h-px" />
            </div>

            {/* Status Bar */}
            <div className="px-4 py-1 border-t border-zinc-800/50 bg-zinc-900/30 flex justify-between items-center text-[10px] text-zinc-600">
                <span>{isTyping ? "AI Analyzing..." : "Ready"}</span>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className="hover:text-zinc-400 transition-colors"
                >
                    {isLive ? "PAUSE FEED" : "RESUME FEED"}
                </button>
            </div>
        </div>
    );
}
