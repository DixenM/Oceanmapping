# 🌊 Danish Tide Tracker

A modern, interactive web application for tracking tides at Danish coastal stations. Built with React, TypeScript, and Leaflet.

## ✨ Features

- 🗺️ **Interactive Map**: Browse 15 Danish coastal tide stations on an interactive map
- 🔍 **Smart Search**: Search by station name or city (Copenhagen, Esbjerg, Aalborg, etc.) with autocomplete
- 📍 **Location Finder**: Automatically find the nearest tide station to your current location using GPS
- 📊 **Real-time Tide Data**: Get current tide heights and upcoming high/low tide predictions
- 🎨 **Status Indicators**: Visual indicators for tide status (rising, falling, high, low) with colors and icons
- 📱 **Mobile-Friendly**: Responsive design optimized for all devices
- 🎯 **Station List**: Browse all stations organized by region with slide-out panel

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

3. Set up your WorldTides API key:
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
- **TypeScript** - Type safety and better developer experience
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **React Leaflet** - React components for Leaflet
- **WorldTides API** - Real-time tide data

## 📍 Covered Stations

The app includes 15 Danish coastal stations with accurate coordinates:

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

## 🎯 Usage

1. **Search for a Station**: Use the search bar at the top to find stations by name or city
2. **Find Nearest Station**: Click the location button (📍) to find the closest station to you
3. **View Tide Info**: Click any marker on the map or select from the station list
4. **Check Status**: See if the tide is currently rising, falling, high, or low with color-coded indicators:
   - 🔴 **Low Tide** (red)
   - 🔵 **Rising** (blue)
   - 🟢 **High Tide** (green)
   - 🟠 **Falling** (orange)

## 📱 Mobile Experience

The app is fully optimized for mobile devices with:
- Touch-friendly controls (56-64px touch targets)
- Responsive layout that adapts to screen size
- Bottom sheet for station list on mobile
- Full-screen tide information popups
- Smooth animations and transitions

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
```

## 📂 Project Structure

```
workspace/
├── public/              # Static assets
│   └── wave.svg        # App icon
├── src/
│   ├── components/      # React components
│   │   ├── SearchBar.tsx       # Smart search with autocomplete
│   │   ├── LocationButton.tsx  # GPS location finder
│   │   ├── StationList.tsx     # Station list panel
│   │   └── TideInfoPopup.tsx   # Tide information display
│   ├── data/            # Static data
│   │   └── stations.ts         # 15 Danish tide stations
│   ├── services/        # API services
│   │   └── tideApi.ts          # WorldTides API integration
│   ├── types/           # TypeScript types
│   │   └── index.ts            # Type definitions
│   ├── utils/           # Utility functions
│   │   └── helpers.ts          # Helper functions
│   ├── styles/          # CSS modules
│   │   ├── App.css
│   │   ├── SearchBar.css
│   │   ├── LocationButton.css
│   │   ├── StationList.css
│   │   ├── TideInfoPopup.css
│   │   └── index.css
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## 🎨 Features in Detail

### Search Bar
- Real-time autocomplete suggestions
- Search by station name, city, or region
- Fly-to animation on selection
- Auto-opens tide information popup
- Clear button for quick reset

### Location Finder
- Uses browser geolocation API
- Calculates nearest station using haversine formula
- Error handling for denied permissions
- Loading state indicator

### Station List
- Organized by region
- Slide-out panel (bottom sheet on mobile, side panel on desktop)
- Touch-friendly list items
- Station count display
- Smooth animations

### Tide Information
- Current tide height
- Tide status with color-coded indicators
- Next 6 high/low tide predictions
- Formatted times and heights
- Loading and error states

## 🔧 Configuration

### API Integration

The app uses the WorldTides API for real-time tide data. To configure:

1. Get a free API key from [WorldTides](https://www.worldtides.info/developer)
2. Add it to your `.env` file
3. The app will automatically use it for all API calls

### Adding New Stations

Edit `src/data/stations.ts` to add new stations:

```typescript
{
  id: 'station-id',
  name: 'Station Name',
  latitude: 55.1234,
  longitude: 10.5678,
  city: 'City Name',
  region: 'Region Name'
}
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenStreetMap contributors for map tiles
- WorldTides for tide prediction API
- Danish coastal monitoring stations
- The React and Vite communities
