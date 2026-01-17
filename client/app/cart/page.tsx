"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ShopLayout } from "@/components/layout/ShopLayout";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <ShopLayout>
                <div className="max-w-2xl mx-auto text-center py-16">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Looks like you haven&apos;t added any stickers yet!
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Browse Stickers
                    </Link>
                </div>
            </ShopLayout>
        );
    }

    return (
        <ShopLayout>
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>

                <h1 className="text-3xl font-bold mb-8">Your Cart ({totalItems} items)</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex gap-4 p-4 bg-card rounded-xl border border-border"
                            >
                                <div className="w-24 h-24 rounded-lg bg-secondary flex items-center justify-center text-4xl flex-shrink-0">
                                    {getEmoji(item.product.id)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{item.product.name}</h3>
                                    <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="p-1 rounded hover:bg-secondary transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="p-1 rounded hover:bg-secondary transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <span className="font-bold text-primary">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>$4.99</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${(totalPrice + 4.99).toFixed(2)}</span>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="block w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-center hover:bg-primary/90 transition-colors"
                            >
                                Proceed to Checkout
                            </Link>
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
