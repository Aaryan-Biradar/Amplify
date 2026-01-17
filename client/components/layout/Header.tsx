"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Header() {
    const { totalItems } = useCart();

    return (
        <header className="fixed top-0 left-16 md:left-56 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold">Sticker Shop</h1>
                <p className="text-sm text-muted-foreground">UofTHacks 13 Merch</p>
            </div>

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
        </header>
    );
}
