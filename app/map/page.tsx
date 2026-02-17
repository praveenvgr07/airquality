"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./map.module.css";
import {
  Wind,
  Thermometer,
  Droplets,
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Preparing Digital Earth...</div>,
});

/* ---------------- Wrapper Component ---------------- */

export default function MapPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading Map...</div>}>
      <MapInner />
    </Suspense>
  );
}

/* ---------------- Actual Logic Component ---------------- */

function MapInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSelectedLocation: setGlobalLocation } = useLocation();

  const statsCardRef = useRef<HTMLDivElement>(null);

  const [mapStyle] = useState<string>("satellite");

  const [selectedLocation, setSelectedLocation] = useState({
    name: "Salem, Tamil Nadu",
    aqi: 54,
    wind: 14,
    temp: 28,
    hum: 42,
  });

  const [locationData, setLocationData] = useState({
    latitude: 11.6643,
    longitude: 78.1460,
    zoom: 3,
  });

  /* ---------------- Fetch Weather ---------------- */

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kmh`
      );
      const data = await res.json();

      return {
        temp: Math.round(data.current.temperature_2m),
        hum: Math.round(data.current.relative_humidity_2m),
        wind: Math.round(data.current.wind_speed_10m),
        aqi: Math.floor(Math.random() * 100),
      };
    } catch {
      return { temp: 25, hum: 50, wind: 10, aqi: 60 };
    }
  };

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await res.json();
      return `${data.locality || data.city || ""}, ${data.countryCode || ""}`;
    } catch {
      return `Loc: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  /* ---------------- Load From URL ---------------- */

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const name = searchParams.get("name");

    if (!lat || !lng) return;

    const newLat = parseFloat(lat);
    const newLng = parseFloat(lng);

    const loadData = async () => {
      const weather = await fetchWeatherData(newLat, newLng);

      setLocationData({
        latitude: newLat,
        longitude: newLng,
        zoom: 10,
      });

      setSelectedLocation({
        name: name || "Selected Location",
        ...weather,
      });

      setGlobalLocation({
        name: name || "Selected Location",
        latitude: newLat,
        longitude: newLng,
        ...weather,
      });
    };

    loadData();
  }, [searchParams]);

  /* ---------------- Map Click ---------------- */

  const handleMapClick = async (event: any) => {
    const { lng, lat } = event.lngLat;

    setSelectedLocation({
      name: "Loading...",
      aqi: 0,
      wind: 0,
      temp: 0,
      hum: 0,
    });

    const [weather, locationName] = await Promise.all([
      fetchWeatherData(lat, lng),
      fetchLocationName(lat, lng),
    ]);

    setSelectedLocation({
      name: locationName,
      ...weather,
    });

    setGlobalLocation({
      name: locationName,
      latitude: lat,
      longitude: lng,
      ...weather,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={styles.mapContainer}>
      <MapView
        style={mapStyle}
        initialViewState={{
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          zoom: locationData.zoom,
          pitch: 0,
          bearing: 0,
        }}
        key={`${locationData.latitude}-${locationData.longitude}`}
        onClick={handleMapClick}
      />

      <div className={styles.sidebar}>
        <div className={styles.detailCard}>
          <h2>{selectedLocation.name}</h2>

          <p><Wind size={16} /> {selectedLocation.wind} km/h</p>
          <p><Thermometer size={16} /> {selectedLocation.temp} °C</p>
          <p><Droplets size={16} /> {selectedLocation.hum} %</p>

          <button
            onClick={() => {
              const params = new URLSearchParams({
                name: selectedLocation.name,
                temp: selectedLocation.temp.toString(),
                hum: selectedLocation.hum.toString(),
                aqi: selectedLocation.aqi.toString(),
              });

              router.push(`/crop?${params.toString()}`);
            }}
          >
            Agriculture AI
          </button>
        </div>
      </div>
    </div>
  );
}
