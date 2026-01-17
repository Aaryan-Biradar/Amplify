"use client"

import { useState, useEffect } from "react"
import { AmplifyParticles } from "@/components/intro/amplify-particles"
import { products } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function Home() {
    const [showIntro, setShowIntro] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    // Show Amplify intro animation first
    if (showIntro) {
        return <AmplifyParticles onComplete={() => setShowIntro(false)} />
    }

    // After intro completes, show the storefront
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <Header />
            <main className="ml-16 md:ml-56 pt-16 p-6">
                <div className="space-y-8">
                    {/* Hero Section */}
                    <section className="text-center py-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Welcome to <span className="text-primary">UofTHacks 13</span> Shop!
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Get your exclusive hackathon stickers. Limited edition designs from the best hackathon in Toronto! 🦌✨
                        </p>
                    </section>

                    {/* Products Grid */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">All Stickers</h2>
                            <span className="text-muted-foreground">{products.length} items</span>
                        </div>
                        <ProductGrid products={products} />
                    </section>
                </div>
            </main>
        </div>
    );
}
