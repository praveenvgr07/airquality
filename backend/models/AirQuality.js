const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  pm25: {
    type: Number,
    default: 0
  },
  pm10: {
    type: Number,
    default: 0
  },
  co: {
    type: Number,
    default: 0
  },
  no2: {
    type: Number,
    default: 0
  },
  so2: {
    type: Number,
    default: 0
  },
  o3: {
    type: Number,
    default: 0
  },
  temperature: {
    type: Number,
    default: 0
  },
  humidity: {
    type: Number,
    default: 0
  },
  windSpeed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AirQuality', airQualitySchema);
