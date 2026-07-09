# 🌊 Danish Tide Tracker

A modern, interactive web application for tracking tides at Danish coastal stations. Built with React, TypeScript, and Leaflet.

## ✨ Features

- 🗺️ **Interactive Map**: Browse 15 Danish coastal tide stations on an interactive map
- 🔍 **Smart Search**: Search by station name or city (Copenhagen, Esbjerg, Aalborg, etc.)
- 📍 **Location Finder**: Automatically find the nearest tide station to your current location
- 📊 **Real-time Tide Data**: Get current tide heights and upcoming high/low tide predictions
- 🎨 **Status Indicators**: Visual indicators for tide status (rising, falling, high, low)
- 📱 **Mobile-Friendly**: Responsive design optimized for all devices
- 🎯 **Station List**: Browse all stations organized by region

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
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **WorldTides API** - Tide data

## 📍 Covered Stations

The app includes 15 Danish coastal stations:

- **Zealand**: Copenhagen, Helsingør, Korsør, Gedser
- **Jutland**: Esbjerg, Aalborg, Aarhus, Skagen, Frederikshavn, Hirtshals, Thyborøn, Rømø
- **Funen**: Odense, Svendborg
- **Bornholm**: Rønne

## 🎯 Usage

1. **Search for a Station**: Use the search bar at the top to find stations by name or city
2. **Find Nearest Station**: Click the location button (📍) to find the closest station to you
3. **View Tide Info**: Click any marker on the map or select from the station list
4. **Check Status**: See if the tide is currently rising, falling, high, or low with color-coded indicators

## 📱 Mobile Experience

The app is fully optimized for mobile devices with:
- Touch-friendly controls
- Responsive layout
- Bottom sheet for station list
- Full-screen tide information popups

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

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
