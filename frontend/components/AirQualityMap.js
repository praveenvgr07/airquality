'use client';

import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AirQualityMap.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Function to get color based on AQI
const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#00e400';      // Good
  if (aqi <= 100) return '#ffff00';     // Moderate
  if (aqi <= 150) return '#ff7e00';     // Unhealthy for sensitive groups
  if (aqi <= 200) return '#ff0000';     // Unhealthy
  if (aqi <= 300) return '#99004c';     // Very unhealthy
  return '#7e0023';                     // Hazardous
};

// Function to get radius based on pollution level
const getRadius = (pm25) => {
  return Math.max(5, pm25 / 2);
};

// Custom hook to fetch air quality data from API
const useAirQualityData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from the backend API
      const response = await fetch('http://localhost:5000/api/air-quality');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const apiData = await response.json();
      setData(apiData);
      setError(null);
    } catch (err) {
      console.error('Error fetching air quality data:', err);
      setError('Failed to fetch real-time air quality data. Please check if the backend server is running on port 5000.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refreshData: fetchData };
};

// Component to handle map events
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      // When user clicks on map, you could potentially fetch data for that location
      // For now, we'll just pass the coordinates
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

export default function AirQualityMap() {
  const { data, loading, error, refreshData } = useAirQualityData();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter] = useState([20, 0]); // Center of the world
  const [mapZoom] = useState(2);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return (
      <div className="air-quality-map-container">
        <div className="map-header">
          <h2>Global Air Quality Map</h2>
          <p>Loading real-time air quality data from OpenAQ API...</p>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="air-quality-map-container">
        <div className="map-header">
          <h2>Global Air Quality Map</h2>
          <p>Error loading air quality data: {error}</p>
        </div>
        <div className="error-message">
          <p>Showing sample data instead...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="air-quality-map-container">
      <div className="map-header">
        <h2>Real-Time Global Air Quality Map</h2>
        <div className="header-controls">
          <p>Live air quality data from OpenAQ API - Updates every 5 minutes</p>
          <button className="refresh-button" onClick={refreshData} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>
      
      <div className="map-wrapper">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapClickHandler onLocationSelect={() => {}} />
          
          {data.map((location) => (
            <CircleMarker
              key={location.id}
              center={[location.lat, location.lng]}
              radius={getRadius(location.pm25)}
              color={getAQIColor(location.aqi)}
              fillColor={getAQIColor(location.aqi)}
              fillOpacity={0.6}
              weight={2}
              eventHandlers={{
                click: () => handleLocationClick(location)
              }}
            >
              <Popup>
                <div className="location-popup">
                  <h3>{location.name}</h3>
                  <div className="aqi-badge" style={{backgroundColor: getAQIColor(location.aqi)}}>
                    AQI: {location.aqi}
                  </div>
                  <div className="popup-details">
                    <div className="detail-row">
                      <span className="label">PM2.5:</span>
                      <span className="value">{location.pm25} μg/m³</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">PM10:</span>
                      <span className="value">{location.pm10} μg/m³</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">CO:</span>
                      <span className="value">{location.co} ppm</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">NO₂:</span>
                      <span className="value">{location.no2} μg/m³</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Temperature:</span>
                      <span className="value">{location.temperature}°C</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Humidity:</span>
                      <span className="value">{location.humidity}%</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Last Updated:</span>
                      <span className="value">{new Date(location.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="location-details">
          <h3>Air Quality Details - {selectedLocation.name}</h3>
          <div className="details-grid">
            <div className="detail-card">
              <h4>Air Quality Index</h4>
              <div 
                className="aqi-display" 
                style={{backgroundColor: getAQIColor(selectedLocation.aqi)}}
              >
                {selectedLocation.aqi}
              </div>
              <p className="aqi-description">
                {selectedLocation.aqi <= 50 ? 'Good' : 
                 selectedLocation.aqi <= 100 ? 'Moderate' : 
                 selectedLocation.aqi <= 150 ? 'Unhealthy for sensitive groups' : 
                 selectedLocation.aqi <= 200 ? 'Unhealthy' : 
                 selectedLocation.aqi <= 300 ? 'Very unhealthy' : 'Hazardous'}
              </p>
            </div>
            
            <div className="detail-card">
              <h4>Particulate Matter</h4>
              <div className="pollutant-levels">
                <div className="pollutant">
                  <span>PM2.5</span>
                  <div className="level-bar">
                    <div 
                      className="level-fill" 
                      style={{width: `${Math.min(100, selectedLocation.pm25)}%`}}
                    ></div>
                  </div>
                  <span>{selectedLocation.pm25} μg/m³</span>
                </div>
                <div className="pollutant">
                  <span>PM10</span>
                  <div className="level-bar">
                    <div 
                      className="level-fill" 
                      style={{width: `${Math.min(100, selectedLocation.pm10/2)}%`}}
                    ></div>
                  </div>
                  <span>{selectedLocation.pm10} μg/m³</span>
                </div>
              </div>
            </div>
            
            <div className="detail-card">
              <h4>Gas Pollutants</h4>
              <div className="gas-levels">
                <div className="gas-item">
                  <span>CO: {selectedLocation.co} ppm</span>
                </div>
                <div className="gas-item">
                  <span>NO₂: {selectedLocation.no2} μg/m³</span>
                </div>
                <div className="gas-item">
                  <span>SO₂: {selectedLocation.so2} μg/m³</span>
                </div>
                <div className="gas-item">
                  <span>O₃: {selectedLocation.o3} μg/m³</span>
                </div>
              </div>
            </div>
            
            <div className="detail-card">
              <h4>Weather Conditions</h4>
              <div className="weather-info">
                <div className="weather-item">
                  <span>🌡️ Temperature: {selectedLocation.temperature}°C</span>
                </div>
                <div className="weather-item">
                  <span>💧 Humidity: {selectedLocation.humidity}%</span>
                </div>
                <div className="weather-item">
                  <span>💨 Wind Speed: {selectedLocation.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="close-details" 
            onClick={() => setSelectedLocation(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}