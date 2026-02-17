// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');

const airQualityRoutes = require('./routes/airQuality');
const mapRoutes = require('./routes/map'); // New map routes

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/air-quality', airQualityRoutes);
app.use('/api/map', mapRoutes); // Add map routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});