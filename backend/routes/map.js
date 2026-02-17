const express = require('express');
const { getMapData } = require('../controllers/mapController');

const router = express.Router();

router.get('/data', getMapData);

module.exports = router;