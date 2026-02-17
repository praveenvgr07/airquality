# Air Quality Monitoring Application

A full-stack application that displays real-time air quality data from the OpenAQ API on an interactive global map.

## 🚀 Quick Start

### Option 1: Start Both Servers Simultaneously (Recommended)
```bash
npm start
```
This will start both the backend (port 5000) and frontend (port 3000) servers concurrently.

### Option 2: Start Individual Servers

**Backend only:**
```bash
npm run backend
# or for development with auto-reload:
npm run dev:backend
```

**Frontend only:**
```bash
npm run frontend
# or for development with auto-reload:
npm run dev:frontend
```

## 📁 Project Structure

```
air-quality-app/
├── backend/           # Express.js API server
│   ├── controllers/   # Route controllers
│   ├── database/      # Database connection
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # External API services
│   └── server.js      # Main server file
├── frontend/          # Next.js frontend
│   ├── app/           # App router pages
│   ├── components/    # React components
│   └── public/        # Static assets
└── package.json       # Root package with concurrent scripts
```

## 🔧 Available Scripts

- `npm start` - Start both frontend and backend in development mode
- `npm run dev` - Same as npm start
- `npm run backend` - Start backend server only
- `npm run frontend` - Start frontend server only
- `npm run dev:backend` - Start backend with nodemon (auto-reload)
- `npm run dev:frontend` - Start frontend with Next.js dev server

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Endpoints**:
  - `GET /api/air-quality` - Get air quality data
  - `GET /api/map/data` - Get map data for visualization

## 🛠️ Technologies Used

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Axios for API requests
- dotenv for environment variables

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Leaflet.js for interactive maps
- react-leaflet for React integration

**External APIs:**
- OpenAQ API for air quality data
- OpenWeatherMap API for weather data

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
MONGO_CLUSTER=your_mongodb_cluster
MONGO_DB=airquality
OPENWEATHER_API_KEY=your_openweather_api_key
```

## 📊 Features

- Real-time air quality data visualization
- Interactive global map with pollution markers
- Automatic data refresh every 5 minutes
- Detailed location information on click
- Responsive design for all devices
- Weather data integration
- AQI (Air Quality Index) calculations

## 🐛 Troubleshooting

**Common Issues:**

1. **Port already in use**: Kill existing Node processes
   ```bash
   taskkill /f /im node.exe
   ```

2. **Module not found errors**: Reinstall dependencies
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```

3. **MongoDB connection issues**: Check your `.env` file credentials

4. **Frontend not starting**: Install Next.js dependencies
   ```bash
   cd frontend && npm install next@14.0.0 react@18 react-dom@18 --legacy-peer-deps
   ```

## 📝 Development Notes

- Backend auto-reloads with nodemon during development
- Frontend hot-reloads with Next.js dev server
- API data refreshes automatically every 5 minutes
- Map markers show real-time AQI values
- Click on markers for detailed pollutant information