"use client";

import { useSearchParams } from 'next/navigation';
import { Leaf, Info, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';
import styles from './crop.module.css';

export default function CropPage() {
    const searchParams = useSearchParams();

    // Get data from URL params or fallback to defaults
    const currentLoc = searchParams.get('name') || "Bangalore, KA";
    const tempVal = searchParams.get('temp') ? `${searchParams.get('temp')}°C` : "28°C";
    const humVal = searchParams.get('hum') ? `${searchParams.get('hum')}%` : "45%";

    // Helper for AQI text
    const getAqiStatus = (aqi: string | null) => {
        if (!aqi) return "Moderate";
        const val = parseInt(aqi);
        if (val <= 50) return "Good";
        if (val <= 100) return "Moderate";
        return "Unhealthy";
    };

    const aqiVal = getAqiStatus(searchParams.get('aqi'));

    const stats = [
        { label: "Temperature", val: tempVal, icon: <Thermometer size={18} />, color: "#f87171" },
        { label: "Humidity", val: humVal, icon: <Droplets size={18} />, color: "#60a5fa" },
        { label: "Air Quality", val: aqiVal, icon: <Wind size={18} />, color: "#fbbf24" }
    ];

    const recommendations = [
        { name: "Ragi (Finger Millet)", suit: 95, icon: "🌾", desc: "Highly suitable for current dry climate and moderate rainfall." },
        { name: "Maize", suit: 82, icon: "🌽", desc: "Good growth potential with current soil moisture levels." },
        { name: "Groundnut", suit: 65, icon: "🥜", desc: "Moderate suitability; requires controlled irrigation." }
    ];

    return (
        <div className={`${styles.container} container`}>
            <header className={styles.header}>
                <div className={styles.breadcrumb}><Leaf size={16} /> Agricultural Intelligence</div>
                <h1 className="gradient-text">Crop Recommendations</h1>
                <div className={styles.location}>
                    <MapPin size={18} /> {currentLoc}
                </div>
            </header>

            <div className={styles.statsRow}>
                {stats.map((s, i) => (
                    <div key={i} className={`${styles.statCard} glass-card`}>
                        <div className={styles.statIcon} style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{s.label}</span>
                            <span className={styles.statVal}>{s.val}</span>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.main}>
                <div className={styles.resultsHeader}>
                    <h2>Analysis Results</h2>
                    <div className={styles.badge}>Live Data</div>
                </div>

                <div className={styles.cropGrid}>
                    {recommendations.map((crop, i) => (
                        <div key={i} className={`${styles.cropCard} glass-card`}>
                            <div className={styles.cropTop}>
                                <span className={styles.cropIcon}>{crop.icon}</span>
                                <div className={styles.suitability}>
                                    <div className={styles.suitBar} style={{ width: `${crop.suit}%` }}></div>
                                    <span>{crop.suit}% Match</span>
                                </div>
                            </div>
                            <h3>{crop.name}</h3>
                            <p>{crop.desc}</p>
                            <button className={styles.detailBtn}>View Growth Guide</button>
                        </div>
                    ))}
                </div>
            </section>

            <div className={`${styles.infoBox} glass-card`}>
                <Info size={20} color="#3b82f6" />
                <p>Our AI models analyze regional atmospheric data, soil pH, and historical weather patterns to provide these recommendations.</p>
            </div>
        </div>
    );
}
