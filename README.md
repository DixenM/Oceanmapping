# Ocean Mapping - Tide & Marine Weather

A modern web application for visualizing marine weather conditions and tide information for Denmark's coastal areas.

## Features

### 🌊 Marine Weather Overlay
- Real-time marine weather data from Open-Meteo Marine API
- Wave height, wind speed, wind direction, and swell data
- Color-coded wave height visualization on map markers
- Toggle-able wave overlay display

### 📊 Station Information
- 5 pre-configured stations across Denmark
- Interactive map markers
- Detailed bottom sheet with current conditions
- Full station detail view with 24-hour forecasts

### ⚠️ Safety Indicators
- Automatic condition assessment (Good / Caution / Dangerous)
- Based on wave height and wind speed thresholds:
  - **Good**: Wave height < 1.5m, Wind speed < 15 km/h
  - **Caution**: Wave height 1.5-3m, Wind speed 15-25 km/h
  - **Dangerous**: Wave height > 3m, Wind speed > 25 km/h

### 🌊 Tide Information
- Current tide height
- Upcoming high and low tides
- 4-tide preview schedule

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **Open-Meteo Marine API** - Free marine weather data

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
oceanmapping/
├── src/
│   ├── components/
│   │   ├── Map.jsx                 # Main map with markers
│   │   ├── TideBottomSheet.jsx     # Bottom sheet with tide & weather
│   │   └── StationDetail.jsx       # Full detail view
│   ├── services/
│   │   ├── marineWeatherService.js # Open-Meteo API integration
│   │   └── tideService.js          # Tide data service
│   ├── App.jsx                     # Main application
│   ├── App.css                     # Styles
│   └── main.jsx                    # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Information

### Open-Meteo Marine API
- **Endpoint**: `https://marine-api.open-meteo.com/v1/marine`
- **Data**: Wave height, wave direction, wind speed, wind direction, swell
- **Free**: No API key required
- **Documentation**: https://open-meteo.com/en/docs/marine-weather-api

## Usage

1. **View Stations**: The map displays 5 stations across Denmark
2. **Click a Station**: Opens bottom sheet with current conditions
3. **Toggle Wave Overlay**: Click the button in the top-right to show/hide wave heights
4. **Expand Details**: Click station name to view full detail page with 24-hour forecast
5. **View Conditions**: Color-coded badges indicate safety levels

## Stations

- Copenhagen Harbor (55.68°N, 12.57°E)
- Aarhus Bay (56.16°N, 10.21°E)
- Esbjerg Port (55.47°N, 8.45°E)
- Skagen (57.72°N, 10.58°E)
- Roskilde Fjord (55.84°N, 12.09°E)

## Mobile-Friendly

The application is fully responsive and optimized for mobile devices with:
- Touch-friendly bottom sheet
- Collapsible content
- Horizontal scrolling forecasts
- Adaptive grid layouts

## Future Enhancements

- Integration with DMI (Danish Meteorological Institute) for real tide data
- Water temperature display
- Historical weather data
- User-defined custom stations
- Push notifications for dangerous conditions
- Offline support with cached data

## License

MIT
