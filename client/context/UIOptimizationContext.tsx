"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIOptimizationState {
    freeShippingThresholdEnabled: boolean;
    toggleFreeShippingThreshold: () => void;
    freeShippingThreshold: number;
    comboDealsEnabled: boolean;
    toggleComboDeals: () => void;
    lowStockAlertEnabled: boolean;
    toggleLowStockAlert: () => void;
}

const UIOptimizationContext = createContext<UIOptimizationState | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 25;

export function UIOptimizationProvider({ children }: { children: ReactNode }) {
    const [freeShippingThresholdEnabled, setFreeShippingThresholdEnabled] = useState(false);
    const [comboDealsEnabled, setComboDealsEnabled] = useState(false);
    const [lowStockAlertEnabled, setLowStockAlertEnabled] = useState(false);

    const toggleFreeShippingThreshold = () => {
        setFreeShippingThresholdEnabled((prev) => !prev);
    };

    const toggleComboDeals = () => {
        setComboDealsEnabled((prev) => !prev);
    };

    const toggleLowStockAlert = () => {
        setLowStockAlertEnabled((prev) => !prev);
    };

    return (
        <UIOptimizationContext.Provider
            value={{
                freeShippingThresholdEnabled,
                toggleFreeShippingThreshold,
                freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
                comboDealsEnabled,
                toggleComboDeals,
                lowStockAlertEnabled,
                toggleLowStockAlert,
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


