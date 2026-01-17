"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface ShopLayoutProps {
    children: React.ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <Header />
            <main className="ml-16 md:ml-56 pt-16 p-6">
                {children}
            </main>
        </div>
    );
}
