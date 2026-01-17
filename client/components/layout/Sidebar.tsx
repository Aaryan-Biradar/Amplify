"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, User, Sparkles } from "lucide-react";

const navItems = [
    { href: "/", label: "Shop", icon: Home },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 md:w-56 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center md:justify-start md:px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="hidden md:block font-bold text-lg">UofTHacks</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                            ? "bg-sidebar-accent text-primary"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="hidden md:block">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden md:block text-sm text-muted-foreground">Guest</span>
                </div>
            </div>
        </aside>
    );
}
