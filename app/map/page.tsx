"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './map.module.css';
import { Info, Wind, Thermometer, Droplets, Layers, Globe as GlobeIcon, Map as MapIcon } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
    loading: () => <div className={styles.loading}>Preparing Digital Earth...</div>
});

export default function MapPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mapStyle, setMapStyle] = useState<any>('satellite');
    const [showStyleMenu, setShowStyleMenu] = useState(false);
    const [isDarkBackground, setIsDarkBackground] = useState(true);
    const statsCardRef = useRef<HTMLDivElement>(null);
    const { setSelectedLocation: setGlobalLocation } = useLocation();

    const [selectedLocation, setSelectedLocation] = useState<any>({
        name: "Salem, Tamil Nadu",
        aqi: 54,
        wind: 14,
        temp: 28,
        hum: 42
    });

    const [locationData, setLocationData] = useState<any>({
        latitude: 11.6643,
        longitude: 78.1460,
        name: "Salem, Tamil Nadu",
        zoom: 3
    });

    // Helper to fetch real weather data
    const fetchWeatherData = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kmh`);
            const data = await response.json();
            return {
                temp: Math.round(data.current.temperature_2m),
                hum: Math.round(data.current.relative_humidity_2m),
                wind: Math.round(data.current.wind_speed_10m),
                aqi: Math.floor(Math.random() * 100) // Mock AQI (Open-Meteo Air Quality requires separate API call)
            };
        } catch (error) {
            console.error("Failed to fetch weather data", error);
            // Fallback to random if fetch fails
            return {
                temp: Math.floor(Math.random() * 35),
                hum: Math.floor(Math.random() * 90),
                wind: Math.floor(Math.random() * 30),
                aqi: Math.floor(Math.random() * 100)
            };
        }
    };

    // Helper to fetch location name (Reverse Geocoding)
    const fetchLocationName = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();
            return `${data.locality || data.city || data.principalSubdivision || ''}, ${data.countryCode || ''}`.replace(/^, /, '');
        } catch (error) {
            console.error("Failed to fetch location name", error);
            return `Loc: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    };

    useEffect(() => {
        const loadSearchLocation = async () => {
            const lat = searchParams.get('lat');
            const lng = searchParams.get('lng');
            const name = searchParams.get('name');

            if (lat && lng) {
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lng);

                // Fetch real data
                const weather = await fetchWeatherData(newLat, newLng);

                setLocationData({
                    latitude: newLat,
                    longitude: newLng,
                    name: name || "Selected Location",
                    zoom: 16
                });

                setSelectedLocation({
                    name: name || "Selected Location",
                    ...weather
                });

                // Update Global Context
                setGlobalLocation({
                    name: name || "Selected Location",
                    latitude: newLat,
                    longitude: newLng,
                    ...weather
                });
            }
        };

        loadSearchLocation();
    }, [searchParams]);

    // Detect background brightness and adjust box color
    useEffect(() => {
        const detectBackgroundBrightness = () => {
            if (!statsCardRef.current) return;

            const rect = statsCardRef.current.getBoundingClientRect();
            const canvas = document.querySelector('.maplibregl-canvas') as HTMLCanvasElement;

            if (canvas) {
                try {
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    // Sample the center area of the box from the canvas
                    const x = Math.max(0, Math.min(rect.left + rect.width / 2, canvas.width));
                    const y = Math.max(0, Math.min(rect.top + rect.height / 2, canvas.height));

                    const imageData = ctx.getImageData(x, y, 1, 1);
                    const [r, g, b] = imageData.data;

                    // Calculate luminosity (standard formula)
                    const luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                    // If bright (luminosity > 0.5), use dark background for box
                    setIsDarkBackground(luminosity < 0.5);
                } catch (error) {
                    // CORS or other errors, keep default
                    console.log('Background detection skipped');
                }
            }
        };

        const interval = setInterval(detectBackgroundBrightness, 500);
        return () => clearInterval(interval);
    }, []);

    const handleMapClick = async (event: any) => {
        const { lng, lat } = event.lngLat;

        // Show loading state or placeholder first
        setSelectedLocation({
            name: "Loading...",
            aqi: 0,
            wind: 0,
            temp: 0,
            hum: 0
        });

        const [weather, name] = await Promise.all([
            fetchWeatherData(lat, lng),
            fetchLocationName(lat, lng)
        ]);

        setSelectedLocation({
            name: name || `Loc: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            ...weather
        });

        // Update Global Context
        setGlobalLocation({
            name: name || `Loc: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            latitude: lat,
            longitude: lng,
            ...weather
        });
    };

    return (
        <div className={styles.mapContainer}>
            <MapView
                style={mapStyle}
                initialViewState={{
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    zoom: locationData.zoom,
                    pitch: 0,
                    bearing: 0
                }}
                // Key forces remount/recenter when location changes
                key={`${locationData.latitude}-${locationData.longitude}`}
                onClick={handleMapClick}
            />

            {/* Layer Switcher */}
            <div className={styles.controls}>
                <div className={styles.controlWrapper}>
                    {showStyleMenu && (
                        <div className={`${styles.styleMenu} ${styles.glassCard}`}>
                            <button onClick={() => { setMapStyle('streets'); setShowStyleMenu(false); }} className={mapStyle === 'streets' ? styles.activeStyle : ''}>
                                <MapIcon size={16} /> <span>Street Map</span>
                            </button>
                            <button onClick={() => { setMapStyle('satellite'); setShowStyleMenu(false); }} className={mapStyle === 'satellite' ? styles.activeStyle : ''}>
                                <GlobeIcon size={16} /> <span>Satellite Globe</span>
                            </button>
                            <button onClick={() => { setMapStyle('dark'); setShowStyleMenu(false); }} className={mapStyle === 'dark' ? styles.activeStyle : ''}>
                                <Layers size={16} /> <span>Dark Terrain</span>
                            </button>
                        </div>
                    )}
                    <button
                        className={`${styles.controlBtn} ${showStyleMenu ? styles.activeBtn : ''}`}
                        onClick={() => setShowStyleMenu(!showStyleMenu)}
                    >
                        <Layers size={20} />
                    </button>
                </div>
                <button className={styles.controlBtn} title="App Info"><Info size={20} /></button>
            </div>

            {/* Stats Sidebar */}
            <div className={styles.sidebar}>
                <div
                    ref={statsCardRef}
                    className={`${styles.statsCard} ${isDarkBackground ? styles.airIntelligenceCard : styles.airIntelligenceCardLight} ${styles.glassCard}`}>
                    <div className={styles.cardHeader}>
                        <GlobeIcon size={18} className={styles.headerIcon} />
                        <h3>Air Intelligence</h3>
                    </div>
                    <p className={styles.helpText}>Global Monitoring System</p>

                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: '#4ade80' }}></span>
                            <span className={styles.label}>AQI: Good (0-50)</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: '#fbbf24' }}></span>
                            <span className={styles.label}>Temp: Warm (25°C+)</span>
                        </div>
                    </div>
                </div>

                {selectedLocation && (
                    <div className={`${styles.detailCard} ${styles.glassCard}`}>
                        <div className={styles.locationTitle}>
                            <h2>{selectedLocation.name}</h2>
                            <span className={styles.statusBadge}>Live Data</span>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <Wind size={18} />
                                <div className={styles.statVal}>
                                    <span className={styles.val}>{selectedLocation.wind}</span>
                                    <span className={styles.unit}>km/h</span>
                                </div>
                                <span className={styles.statLabel}>Wind</span>
                            </div>
                            <div className={styles.statItem}>
                                <Thermometer size={18} />
                                <div className={styles.statVal}>
                                    <span className={styles.val}>{selectedLocation.temp}</span>
                                    <span className={styles.unit}>°C</span>
                                </div>
                                <span className={styles.statLabel}>Temp</span>
                            </div>
                            <div className={styles.statItem}>
                                <Droplets size={18} />
                                <div className={styles.statVal}>
                                    <span className={styles.val}>{selectedLocation.hum}</span>
                                    <span className={styles.unit}>%</span>
                                </div>
                                <span className={styles.statLabel}>Hum</span>
                            </div>
                        </div>
                        <button className={styles.actionBtn} onClick={() => {
                            const params = new URLSearchParams({
                                name: selectedLocation.name,
                                temp: selectedLocation.temp.toString(),
                                hum: selectedLocation.hum.toString(),
                                aqi: selectedLocation.aqi.toString()
                            });
                            router.push(`/crop?${params.toString()}`);
                        }}>
                            Agriculture AI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
