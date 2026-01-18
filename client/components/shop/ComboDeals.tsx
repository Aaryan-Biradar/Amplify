"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useUIOptimization } from "@/context/UIOptimizationContext";
import { products, Product } from "@/lib/products";
import { Package, Check, Plus } from "lucide-react";

// Get combo: first cart item + 2 complementary items
function getComboSuggestions(cartProductIds: string[]): Product[] {
    if (cartProductIds.length === 0) return [];

    // Get the first cart item to anchor the combo
    const firstCartItem = products.find(p => p.id === cartProductIds[0]);
    if (!firstCartItem) return [];

    // Get 2 items NOT in cart as complementary suggestions
    const available = products.filter(p => !cartProductIds.includes(p.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const complementary = shuffled.slice(0, 2);

    // Return: [cart item, complement1, complement2]
    return [firstCartItem, ...complementary];
}

export function ComboDeals() {
    const { items, addToCart } = useCart();
    const { comboDealsEnabled } = useUIOptimization();

    const cartProductIds = items.map(item => item.product.id);
    const [suggestions] = useState(() => getComboSuggestions(cartProductIds));
    const [selectedIds, setSelectedIds] = useState<string[]>(suggestions.map(p => p.id));

    if (!comboDealsEnabled || suggestions.length === 0) return null;

    const selectedProducts = suggestions.filter(p => selectedIds.includes(p.id));
    const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const discount = subtotal * 0.1; // 10% discount
    const total = subtotal - discount;

    const toggleProduct = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const addAllToCart = () => {
        // Only add items that aren't already in cart
        selectedProducts
            .filter(product => !cartProductIds.includes(product.id))
            .forEach(product => addToCart(product));
    };

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

    return (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg">Frequently bought together</h3>
            </div>

            {/* Product Row with Plus Signs */}
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                {suggestions.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                        <button
                            onClick={() => toggleProduct(product.id)}
                            className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl transition-all ${selectedIds.includes(product.id)
                                ? "bg-card border-2 border-amber-500"
                                : "bg-secondary/50 border-2 border-transparent opacity-50"
                                }`}
                        >
                            {emojiMap[product.id] || "🎨"}
                        </button>
                        {index < suggestions.length - 1 && (
                            <Plus className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>
                ))}

                {/* Total and Add Button */}
                <div className="ml-4 flex flex-col items-end gap-2">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">${subtotal.toFixed(2)}</p>
                        <p className="text-xl font-bold text-amber-500">${total.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={addAllToCart}
                        disabled={selectedProducts.length === 0}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                        Add all to Cart
                    </button>
                </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
                {suggestions.map((product) => (
                    <label
                        key={product.id}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <div
                            onClick={() => toggleProduct(product.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedIds.includes(product.id)
                                ? "bg-amber-500 border-amber-500"
                                : "border-muted-foreground"
                                }`}
                        >
                            {selectedIds.includes(product.id) && (
                                <Check className="w-3 h-3 text-white" />
                            )}
                        </div>
                        <span className={selectedIds.includes(product.id) ? "" : "text-muted-foreground"}>
                            {product.name}
                        </span>
                        <span className="text-amber-500 font-medium">${product.price.toFixed(2)}</span>
                    </label>
                ))}
            </div>

            {selectedProducts.length > 0 && (
                <p className="text-sm text-green-500 font-medium mt-3">
                    🎉 Save {(discount).toFixed(2)} with this combo!
                </p>
            )}
        </div>
    );
}
