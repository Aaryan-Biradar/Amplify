"use client";

import { useCart } from "@/context/CartContext";
import { useUIOptimization } from "@/context/UIOptimizationContext";
import { Truck } from "lucide-react";

export function FreeShippingBar() {
    const { totalPrice } = useCart();
    const { freeShippingThreshold } = useUIOptimization();

    const remaining = Math.max(0, freeShippingThreshold - totalPrice);
    const progress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
    const qualifies = totalPrice >= freeShippingThreshold;

    return (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Truck className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    {qualifies ? (
                        <p className="font-semibold text-primary">
                            🎉 You qualify for FREE shipping!
                        </p>
                    ) : (
                        <p className="font-medium">
                            Add <span className="text-primary font-bold">${remaining.toFixed(2)}</span> more for FREE shipping!
                        </p>
                    )}
                </div>
                <span className="text-sm text-muted-foreground">
                    ${totalPrice.toFixed(2)} / ${freeShippingThreshold}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out rounded-full ${qualifies
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-primary to-primary/70"
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
