const express = require('express');
const AirQuality = require('../models/AirQuality');

const router = express.Router();

// GET /api/air-quality - Get all air quality data
router.get('/', async (req, res) => {
  try {
    const airQualityData = await AirQuality.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(airQualityData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

module.exports = router;

module.exports = router;
