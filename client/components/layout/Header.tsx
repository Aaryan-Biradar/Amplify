"use client";

import Link from "next/link";
import { ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUIOptimization } from "@/context/UIOptimizationContext";

export function Header() {
    const { totalItems } = useCart();
    const { freeShippingThresholdEnabled, toggleFreeShippingThreshold } = useUIOptimization();

    return (
        <header className="fixed top-0 left-16 md:left-56 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold">Sticker Shop</h1>
                <p className="text-sm text-muted-foreground">UofTHacks 13 Merch</p>
            </div>

            {/* Free Shipping Threshold Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleFreeShippingThreshold}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${freeShippingThresholdEnabled
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                >
                    <Truck className="w-4 h-4" />
                    <span className="hidden sm:inline">Free Shipping Threshold</span>
                    <div
                        className={`w-8 h-4 rounded-full transition-colors ${freeShippingThresholdEnabled ? "bg-primary-foreground/30" : "bg-muted"
                            }`}
                    >
                        <div
                            className={`w-3 h-3 rounded-full bg-white shadow transition-transform mt-0.5 ${freeShippingThresholdEnabled ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                                }`}
                        />
                    </div>
                </button>

                <Link
                    href="/cart"
                    className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}

