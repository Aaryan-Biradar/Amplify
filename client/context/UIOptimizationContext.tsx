"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIOptimizationState {
    freeShippingThresholdEnabled: boolean;
    toggleFreeShippingThreshold: () => void;
    freeShippingThreshold: number;
}

const UIOptimizationContext = createContext<UIOptimizationState | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 25; // $25 for free shipping

export function UIOptimizationProvider({ children }: { children: ReactNode }) {
    const [freeShippingThresholdEnabled, setFreeShippingThresholdEnabled] = useState(false);

    const toggleFreeShippingThreshold = () => {
        setFreeShippingThresholdEnabled((prev) => !prev);
    };

    return (
        <UIOptimizationContext.Provider
            value={{
                freeShippingThresholdEnabled,
                toggleFreeShippingThreshold,
                freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
            }}
        >
            {children}
        </UIOptimizationContext.Provider>
    );
}

export function useUIOptimization() {
    const context = useContext(UIOptimizationContext);
    if (!context) {
        throw new Error("useUIOptimization must be used within a UIOptimizationProvider");
    }
    return context;
}
