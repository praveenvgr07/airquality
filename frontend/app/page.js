'use client';

import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🌍 Global Air Quality Monitor</h1>
        <p>Real-time air quality data powered by OpenAQ API and OpenWeatherMap</p>
        
        <div className="features">
          <div className="feature-card">
            <h3>📊 Real-Time Data</h3>
            <p>Fresh air quality measurements updated every 5 minutes</p>
          </div>
          <div className="feature-card">
            <h3>🌐 Global Coverage</h3>
            <p>Data from monitoring stations worldwide</p>
          </div>
          <div className="feature-card">
            <h3>🌡️ Weather Integration</h3>
            <p>Combined air quality and weather information</p>
          </div>
        </div>
        
        <Link href="/map" className="cta-button">
          View Live Air Quality Map
        </Link>
        
        <div className="api-info">
          <h3>API Integration Status</h3>
          <ul>
            <li>✅ OpenAQ API: Real-time air quality data</li>
            <li>✅ OpenWeatherMap API: Weather data integration</li>
            <li>✅ MongoDB: Data storage and retrieval</li>
            <li>✅ Express.js Backend: API endpoints</li>
            <li>✅ React Frontend: Interactive visualization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}