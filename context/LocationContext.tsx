"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationData {
    name: string;
    latitude: number;
    longitude: number;
    temp: number;
    hum: number;
    aqi: number;
    wind: number;
}

interface LocationContextType {
    selectedLocation: LocationData | null;
    setSelectedLocation: (location: LocationData | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

    // Persist to local storage if needed, or just keep in memory for session
    // For now, in-memory is fine as requested behavior is per-session navigation

    return (
        <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
