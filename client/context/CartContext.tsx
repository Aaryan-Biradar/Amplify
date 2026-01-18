"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/products";
import * as amplitude from "@amplitude/analytics-browser";
import { liveEventBus } from "@/lib/liveEventBus";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // Track to Amplitude AND our live event bus
            amplitude.track("add_to_cart", {
                product_id: product.id,
                product_name: product.name,
                price: product.price,
            });
            liveEventBus.push("add_to_cart", { product_name: product.name, price: product.price });

            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        const item = items.find(i => i.product.id === productId);
        amplitude.track("remove_from_cart", {
            product_name: item?.product.name,
            product_id: productId
        });
        liveEventBus.push("remove_from_cart", {
            product_name: item?.product.name || 'item',
            product_id: productId
        });
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const item = items.find(i => i.product.id === productId);
        if (item) {
            const isIncrease = quantity > item.quantity;
            const eventType = isIncrease ? "quantity_increased" : "quantity_decreased";

            amplitude.track(eventType, {
                product_name: item.product.name,
                product_id: productId,
                old_quantity: item.quantity,
                new_quantity: quantity,
                price: item.product.price
            });
            liveEventBus.push(eventType, {
                product_name: item.product.name,
                product_id: productId,
                old_quantity: item.quantity,
                new_quantity: quantity,
                price: item.product.price
            });
        }

        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
