"use client";

import React, { useMemo, useRef, useState } from 'react';
import Map, { NavigationControl, MapRef } from 'react-map-gl/maplibre';
import { Crosshair } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
    style?: string;
    initialViewState?: any;
    onClick?: (event: any) => void;
}

// Open-source Style Definitions
// Google-Style High-Detail Source (No Token Required)
const STYLES = {
    satellite: {
        version: 8,
        sources: {
            'google-hybrid': {
                type: 'raster',
                tiles: ['https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'],
                tileSize: 256,
                attribution: 'Google'
            }
        },
        layers: [{ id: 'google-hybrid', type: 'raster', source: 'google-hybrid', minzoom: 0, maxzoom: 22 }]
    },
    streets: {
        version: 8,
        sources: {
            'google-streets': {
                type: 'raster',
                tiles: ['https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'],
                tileSize: 256,
                attribution: 'Google'
            }
        },
        layers: [{ id: 'google-streets', type: 'raster', source: 'google-streets', minzoom: 0, maxzoom: 22 }]
    },
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

const MapView = ({
    style = 'satellite',
    initialViewState = {
        latitude: 11.6643,
        longitude: 78.1460,
        zoom: 3,
        bearing: 0
    },
    onClick
}: MapViewProps) => {
    const mapRef = useRef<MapRef>(null);
    const [isLocating, setIsLocating] = useState(false);

    const handleLocateUser = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                mapRef.current?.flyTo({
                    center: [longitude, latitude],
                    zoom: 14,
                    essential: true
                });
                setIsLocating(false);

                // Trigger onClick handler to update context if provided
                if (onClick) {
                    onClick({ lngLat: { lng: longitude, lat: latitude } });
                }
            },
            (error) => {
                setIsLocating(false);
                console.error("Geolocation error:", error);

                let errorMessage = "Unable to retrieve your location.";
                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                    errorMessage += "\n\nReason: Browser blocked access because the site is not on HTTPS.";
                } else if (error.code === 1) {
                    errorMessage += "\n\nReason: Permission denied. Please allow location access.";
                }

                alert(errorMessage);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const mapStyle = useMemo(() => {
        if (style.includes('satellite')) return STYLES.satellite;
        if (style.includes('streets')) return STYLES.streets;
        if (style.includes('dark')) return STYLES.dark;
        return STYLES.satellite;
    }, [style]);



    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
            <Map
                initialViewState={initialViewState}
                mapStyle={mapStyle as any}
                style={{ width: '100%', height: '100%' }}
                projection="globe"
                mapLib={maplibregl}
                maxZoom={21}
                minZoom={2}
                attributionControl={false}
                onClick={onClick}
                ref={mapRef}
            >
                <NavigationControl position="top-right" />

                {/* Custom Geolocation Button */}
                <button
                    onClick={handleLocateUser}
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        right: '10px',
                        zIndex: 1,
                        background: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '29px',
                        height: '29px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
                        color: isLocating ? '#3b82f6' : '#333'
                    }}
                    title="Show my location"
                >
                    <Crosshair size={20} className={isLocating ? 'spin-animation' : ''} />
                </button>


            </Map>
            <style jsx global>{`
                .maplibregl-canvas {
                    outline: none;
                }
                .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left {
                    /* display: none; */
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin-animation {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div >
    );
};

export default MapView;
