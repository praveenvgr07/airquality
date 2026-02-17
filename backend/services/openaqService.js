const axios = require('axios');

// OpenAQ API service for real air quality data
const fetchGlobalAirQuality = async (bbox = null) => {
  try {
    const defaultBbox = bbox || '-180,-90,180,90';
    
    const response = await axios.get('https://api.openaq.org/v2/latest', {
      params: {
        bbox: defaultBbox,
        limit: 100
      },
      timeout: 15000
    });
    
    if (response.data && response.data.results) {
      return response.data.results
        .filter(item => item.coordinates && item.measurements && item.measurements.length > 0)
        .map(item => ({
          location: item.location || 'Unknown Location',
          country: item.country || 'Unknown',
          coordinates: {
            latitude: item.coordinates.latitude,
            longitude: item.coordinates.longitude
          },
          measurements: item.measurements.map(measurement => ({
            parameter: measurement.parameter,
            value: measurement.value,
            unit: measurement.unit,
            lastUpdated: measurement.lastUpdated
          }))
        }));
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching from OpenAQ API:', error.message);
    
    // Fallback to sample data if API fails
    console.log('🔄 Using fallback sample data');
    return [
      {
        location: 'New York',
        country: 'US',
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        measurements: [
          { parameter: 'pm25', value: 12, unit: 'µg/m³' },
          { parameter: 'pm10', value: 25, unit: 'µg/m³' },
          { parameter: 'o3', value: 45, unit: 'ppb' }
        ]
      },
      {
        location: 'London',
        country: 'GB',
        coordinates: { latitude: 51.5074, longitude: -0.1278 },
        measurements: [
          { parameter: 'pm25', value: 8, unit: 'µg/m³' },
          { parameter: 'pm10', value: 18, unit: 'µg/m³' },
          { parameter: 'o3', value: 38, unit: 'ppb' }
        ]
      },
      {
        location: 'Tokyo',
        country: 'JP',
        coordinates: { latitude: 35.6762, longitude: 139.6503 },
        measurements: [
          { parameter: 'pm25', value: 15, unit: 'µg/m³' },
          { parameter: 'pm10', value: 30, unit: 'µg/m³' },
          { parameter: 'no2', value: 25, unit: 'ppb' }
        ]
      }
    ];
  }
};

module.exports = fetchGlobalAirQuality;
