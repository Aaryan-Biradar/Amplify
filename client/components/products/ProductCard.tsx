"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import * as amplitude from "@amplitude/analytics-browser";
import { useUIOptimization } from "@/context/UIOptimizationContext";

interface ProductCardProps {
    product: Product;
}

// Simulated stock levels (in real app, this would come from API)
function getStockLevel(productId: string): number {
    const stockMap: Record<string, number> = {
        "pink-gremlin": 3,
        "blue-hamster": 7,
        "lollipop-owl": 2,
        "laptop-gal": 12,
        "screaming-cloud": 4,
        "stork-delivery": 15,
        "job-seekers": 1,
        "job-application": 8,
        "procrastinate": 5,
        "fire-hacker": 2,
        "sleep-not-found": 6,
        "trophy-axolotl": 3,
    };
    return stockMap[productId] || 10;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { lowStockAlertEnabled } = useUIOptimization();

    const stockLevel = getStockLevel(product.id);
    const isLowStock = stockLevel <= 5;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);

        amplitude.track("add_to_cart", {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
        });
    };

    return (
        <Link href={`/product/${product.id}`}>
            <div className="group glass-card rounded-xl p-4 relative">
                {/* Low Stock Badge */}
                {lowStockAlertEnabled && isLowStock && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Only {stockLevel} left!
                    </div>
                )}

                {/* Image Container */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-secondary/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">{getEmoji(product.id)}</div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
                            aria-label="Add to cart"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Temporary emoji mapping for products
function getEmoji(productId: string): string {
    const emojiMap: Record<string, string> = {
        "pink-gremlin": "👹",
        "blue-hamster": "🐹",
        "lollipop-owl": "🦉",
        "laptop-gal": "💻",
        "screaming-cloud": "☁️",
        "stork-delivery": "🦢",
        "job-seekers": "🏔️",
        "job-application": "📄",
        "procrastinate": "😴",
        "fire-hacker": "🔥",
        "sleep-not-found": "🦉",
        "trophy-axolotl": "🏆",
    };
    return emojiMap[productId] || "🎨";
}

