"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ShopLayout } from "@/components/layout/ShopLayout";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        address: "",
        city: "",
        zip: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setIsComplete(true);
        clearCart();
    };

    if (items.length === 0 && !isComplete) {
        router.push("/cart");
        return null;
    }

    if (isComplete) {
        return (
            <ShopLayout>
                <div className="max-w-2xl mx-auto text-center py-16">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Order Complete! 🎉</h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for your order! Your UofTHacks 13 stickers will be on their way soon.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </ShopLayout>
        );
    }

    const shippingCost = 4.99;
    const total = totalPrice + shippingCost;

    return (
        <ShopLayout>
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                </Link>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold">Contact Info</h2>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold">Shipping Address</h2>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Street address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP Code"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${total.toFixed(2)}`
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {item.product.name} x{item.quantity}
                                        </span>
                                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 border-t border-border pt-4">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>${shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
