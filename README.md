# 🌊 Danish Tide & Marine Weather Tracker

A comprehensive web application combining real-time tide tracking and marine weather forecasting for Danish coastal stations. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### 🌊 Marine Weather Overlay (NEW!)
- **Real-time Marine Weather Data** from Open-Meteo Marine API (free, no API key needed)
- **Wave Height Visualization** with color-coded markers
- **Wind Speed & Direction** with compass indicators and directional arrows
- **Safety Indicators**: Automatic condition assessment (Good / Caution / Dangerous)
  - **Good**: Wave height < 1.5m, Wind speed < 15 km/h
  - **Caution**: Wave height 1.5-3m, Wind speed 15-25 km/h
  - **Dangerous**: Wave height > 3m, Wind speed > 25 km/h
- **24-Hour Marine Forecast** with hourly wave and wind predictions
- **Toggle Wave Overlay** to show/hide wave height visualization on map
- **Swell & Wave Period Data** for comprehensive marine conditions

### 🗺️ Tide Tracking
- **Interactive Map** with 15+ Danish coastal tide stations
- **Smart Search** by station name or city with autocomplete
- **GPS Location Finder** to find nearest tide station automatically
- **Real-time Tide Data** with current heights and upcoming predictions
- **Status Indicators** showing tide status (rising, falling, high, low) with color codes
- **Station List Panel** organized by region

### 📱 User Experience
- **Mobile-Friendly** responsive design optimized for all devices
- **Touch-Friendly Controls** with proper touch targets
- **Bottom Sheet Interface** for station information
- **Smooth Animations** and transitions
- **Clean Modern UI** with intuitive navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd oceanmapping
```

2. Install dependencies:
```bash
npm install
```

3. Set up your WorldTides API key (for tide data):
   - Get a free API key from [WorldTides.info](https://www.worldtides.info/)
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your API key to `.env`:
     ```
     VITE_WORLDTIDES_API_KEY=your_api_key_here
     ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## 🏗️ Building for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **React Leaflet** - React components for Leaflet
- **WorldTides API** - Real-time tide data
- **Open-Meteo Marine API** - Free marine weather data

## 📍 Covered Stations

The app includes 15+ Danish coastal stations with accurate coordinates:

### Zealand
- Copenhagen (København Havnegade)
- Helsingør
- Korsør
- Gedser

### Jutland
- Esbjerg Havn
- Aalborg
- Aarhus Havn
- Skagen Havn
- Frederikshavn
- Hirtshals
- Thyborøn
- Rømø

### Funen
- Odense Fjord
- Svendborg

### Bornholm
- Rønne

## 🌊 Marine Weather Stations

5 marine weather monitoring stations with wave and wind data:
- Copenhagen Harbor (55.68°N, 12.57°E)
- Aarhus Bay (56.16°N, 10.21°E)
- Esbjerg Port (55.47°N, 8.45°E)
- Skagen (57.72°N, 10.58°E)
- Roskilde Fjord (55.84°N, 12.09°E)

## 🎯 Usage

### Tide Tracking
1. **Search for a Station**: Use the search bar at the top
2. **Find Nearest Station**: Click the location button (📍)
3. **View Tide Info**: Click any marker on the map
4. **Check Status**: See color-coded tide indicators

### Marine Weather
1. **View Marine Conditions**: Click any station marker
2. **Toggle Wave Overlay**: Click the button in top-right corner
3. **Check Safety Level**: View Good/Caution/Dangerous badges
4. **View Forecast**: See 24-hour wave and wind predictions
5. **Expand Details**: Click station name for full information

## 🎨 Color-Coded Status Indicators

### Tide Status
- 🔴 **Low Tide** (red)
- 🔵 **Rising** (blue)
- 🟢 **High Tide** (green)
- 🟠 **Falling** (orange)

### Marine Weather
- 🟢 **Good** (green): Safe conditions
- 🟡 **Caution** (orange): Moderate conditions, exercise care
- 🔴 **Dangerous** (red): Unsafe conditions, avoid marine activities

## 📂 Project Structure

```
oceanmapping/
├── public/              # Static assets
│   ├── wave.svg
│   └── manifest.json
├── src/
│   ├── components/      # React components (TypeScript)
│   │   ├── SearchBar.tsx
│   │   ├── LocationButton.tsx
│   │   ├── StationList.tsx
│   │   ├── TideInfoPopup.tsx
│   │   ├── Map.jsx                 # Marine weather map
│   │   ├── TideBottomSheet.jsx     # Marine weather bottom sheet
│   │   └── StationDetail.jsx       # Marine weather detail view
│   ├── data/            # Static data
│   │   └── stations.ts
│   ├── services/        # API services
│   │   ├── tideApi.ts              # WorldTides API
│   │   ├── marineWeatherService.js # Open-Meteo Marine API
│   │   └── tideService.js
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── styles/          # CSS modules
│   │   ├── App.css
│   │   ├── SearchBar.css
│   │   ├── LocationButton.css
│   │   ├── StationList.css
│   │   └── TideInfoPopup.css
│   ├── App.tsx          # Main app component (TypeScript)
│   ├── App.jsx          # Marine weather app (JavaScript)
│   ├── main.tsx         # App entry point
│   └── vite-env.d.ts
├── test/                # Test suites
│   └── testMarineWeatherService.js
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run marine weather tests
npm test
```

## 📱 Mobile Experience

The app is fully optimized for mobile devices with:
- Touch-friendly controls (56-64px touch targets)
- Responsive layout that adapts to screen size
- Bottom sheet for station information
- Full-screen popups for detailed information
- Smooth animations and transitions
- Horizontal scrolling forecasts

## 🔧 API Configuration

### WorldTides API (for Tide Data)
1. Get a free API key from [WorldTides](https://www.worldtides.info/developer)
2. Add it to your `.env` file
3. The app will automatically use it for all tide API calls

### Open-Meteo Marine API (for Marine Weather)
- **Endpoint**: `https://marine-api.open-meteo.com/v1/marine`
- **No API key required** - completely free!
- **Data**: Wave height, wave direction, wind speed, wind direction, swell
- **Documentation**: https://open-meteo.com/en/docs/marine-weather-api

## 🎨 Features in Detail

### Marine Weather Bottom Sheet
- Current wave height, wind speed, and wind wave height
- Wind direction with arrow indicator and compass direction
- Safety condition badge (Good/Caution/Dangerous)
- 24-hour forecast with hourly predictions
- Swell wave height and wave period data
- Tide information integration

### Wave Overlay
- Toggle button to show/hide wave visualization
- Color-coded circular markers on map
- Wave height displayed on each marker
- Updates in real-time with current conditions

### Search & Navigation
- Real-time autocomplete suggestions
- Search by station name, city, or region
- Fly-to animation on selection
- Auto-opens information popup
- Clear button for quick reset

### Safety Assessment
- Automatic evaluation based on conditions
- Clear warning messages
- Recommended actions
- Historical context for conditions

## 🚀 Future Enhancements

- Integration with DMI (Danish Meteorological Institute)
- Water temperature display
- Historical weather and tide data charts
- User-defined custom stations
- Push notifications for dangerous conditions
- Offline support with cached data
- Weather radar overlay
- Sailing route planning

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenStreetMap contributors for map tiles
- WorldTides for tide prediction API
- Open-Meteo for free marine weather API
- Danish coastal monitoring stations
- The React, TypeScript, and Vite communities
