"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { getProduct } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { notFound } from "next/navigation";
import { ShopLayout } from "@/components/layout/ShopLayout";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { id } = use(params);
    const product = getProduct(id);
    const { addToCart, items, updateQuantity } = useCart();

    if (!product) {
        notFound();
    }

    const cartItem = items.find((item) => item.product.id === product.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <ShopLayout>
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shop
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="aspect-square rounded-xl bg-card border border-border flex items-center justify-center">
                        <div className="text-9xl">{getEmoji(product.id)}</div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-muted-foreground text-lg">{product.description}</p>
                        </div>

                        <div className="text-4xl font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </div>

                        {quantity === 0 ? (
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2">
                                    <button
                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <Link
                                    href="/cart"
                                    className="flex-1 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-center hover:bg-secondary/80 transition-colors"
                                >
                                    View Cart
                                </Link>
                            </div>
                        )}

                        <div className="pt-6 border-t border-border space-y-4">
                            <h3 className="font-semibold">Details</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>✓ High-quality vinyl sticker</li>
                                <li>✓ Waterproof & durable</li>
                                <li>✓ Perfect for laptops, bottles, and more</li>
                                <li>✓ UofTHacks 13 exclusive design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}

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
