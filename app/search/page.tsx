"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, History } from 'lucide-react';
import styles from './search.module.css';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            try {
                // Use Nominatim (OpenStreetMap) for free geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon, display_name } = data[0];
                    // Redirect to map with coordinates and location name
                    router.push(`/map?lat=${lat}&lng=${lon}&name=${encodeURIComponent(display_name)}`);
                } else {
                    alert('Location not found. Please try a different search term.');
                }
            } catch (error) {
                console.error('Search error:', error);
                // Fallback to simple redirect if geocoding fails
                router.push('/map?search=' + encodeURIComponent(query));
            }
        }
    };

    const suggestions = [
        'Bangalore, India', 'New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France'
    ];

    return (
        <div className={`${styles.container} container`}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className="gradient-text">Global Search</h1>
                    <p>Find real-time air quality and environmental data for any location on Earth.</p>
                </div>

                <form className={`${styles.searchBox} glass-card`} onSubmit={handleSearch}>
                    <Search className={styles.searchIcon} size={24} />
                    <input
                        type="text"
                        placeholder="Search for street, address, city, or region..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Search</button>
                </form>

                <div className={styles.grid}>
                    <div className={`${styles.card} glass-card`}>
                        <h3><MapPin size={18} color="#3b82f6" /> Popular Searches</h3>
                        <div className={styles.chips}>
                            {suggestions.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => {
                                        setQuery(city);
                                        // Trigger search immediately on chip click
                                        const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
                                        setTimeout(() => handleSearch(syntheticEvent), 100);
                                    }}
                                    className={styles.chip}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
