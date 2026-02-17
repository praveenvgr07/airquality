const AirQuality = require('../models/AirQuality');

const getMapData = async (req, res) => {
  try {
    // Fetch air quality data from database
    const airQualityData = await AirQuality.find({}).sort({ createdAt: -1 }).limit(100);
    
    // Transform the data to the format expected by the frontend map
    const mapData = airQualityData.map(item => ({
      id: item._id,
      name: item.location,
      lat: item.lat,
      lng: item.lng,
      aqi: calculateAQI(item), // Calculate AQI based on pollutants
      pm25: item.pm25 || 0,
      pm10: item.pm10 || 0,
      co: item.co || 0,
      no2: item.no2 || 0,
      so2: item.so2 || 0,
      o3: item.o3 || 0,
      temperature: item.temperature || 0,
      humidity: item.humidity || 0,
      windSpeed: item.windSpeed || 0,
      timestamp: item.updatedAt || item.createdAt
    }));
    
    res.json(mapData);
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ error: 'Failed to fetch air quality map data' });
  }
};

// Helper function to calculate AQI (simplified calculation)
const calculateAQI = (item) => {
  // Simplified AQI calculation based on major pollutants
  const pollutants = [
    { value: item.pm25, breakpoint: 50 },
    { value: item.pm10, breakpoint: 100 },
    { value: item.o3, breakpoint: 120 },
  ];
  
  // Return a calculated AQI based on pollutant levels
  // In reality, this would use the EPA's AQI calculation formula
  const maxRatio = Math.max(...pollutants.map(p => 
    p.value ? p.value / p.breakpoint : 0
  ));
  
  // Convert to AQI scale (0-500)
  const aqi = Math.min(500, Math.round(maxRatio * 200));
  
  return aqi || 0;
};

module.exports = {
  getMapData
};