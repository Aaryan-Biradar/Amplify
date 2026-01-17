"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link href={`/product/${product.id}`}>
            <div className="group bg-card rounded-xl border border-border p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(92,225,230,0.15)]">
                {/* Image Container */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-secondary/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">{getEmoji(product.id)}</div>
                    </div>
                    {/* Uncomment when real images are available */}
                    {/* <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          /> */}
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

// Temporary emoji mapping for products (replace with real images later)
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
