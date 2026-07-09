# 🌊 Denmark Tide Map

A mobile-friendly Progressive Web App (PWA) that displays real-time ocean tide information along the Danish coast. Built with React, Leaflet, and modern web technologies.

![Denmark Tide Map](./docs/screenshot.png)

## ✨ Features

- 🗺️ **Interactive Map**: Full-screen Leaflet map centered on Denmark with OpenStreetMap tiles
- 📍 **13 Tide Stations**: Major monitoring locations including Copenhagen, Esbjerg, Aarhus, Skagen, Frederikshavn, Hirtshals, Hornbæk, and more
- 📊 **Tide Predictions**: Current tide levels, high/low tide times, and 24/48-hour predictions with interactive charts
- 🔍 **Smart Search**: Quick search with "fly to" animation - search by name, region, or description
- 📍 **Current Location**: Built-in geolocation to find nearest tide stations
- 🌙 **Dark Theme**: Ocean-inspired dark UI optimized for outdoor visibility
- 📱 **Mobile-First**: Responsive bottom sheet design with drag handle and backdrop
- ⚡ **PWA**: Installable on mobile devices with offline support
- 🎨 **Modern UI**: Clean interface built with Tailwind CSS
- 📈 **Toggle Charts**: Switch between 24-hour and 48-hour tide predictions

## 🚀 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React-Leaflet** - Interactive maps
- **TanStack Query** - Data fetching and caching
- **Recharts** - Tide prediction charts
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite PWA Plugin** - Progressive Web App features

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd workspace
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. (Optional) Add your WorldTides API key to `.env`:
```
VITE_TIDE_API_KEY=your_api_key_here
```

> **Note**: The app works with mock data by default. For production use, get a free API key from [WorldTides](https://www.worldtides.info/developer).

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📱 PWA Installation

### Desktop
1. Visit the app in Chrome, Edge, or another PWA-compatible browser
2. Click the install icon in the address bar
3. Follow the prompts to install

### Mobile
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. Confirm installation

## 🗺️ Tide Stations

The app currently tracks 13 tide stations across Denmark:

| Station | Region | Type |
|---------|--------|------|
| Copenhagen (København) | Zealand | Major |
| Esbjerg | Jutland | Major |
| Aarhus | Jutland | Major |
| Skagen | Jutland | Major |
| Aalborg | Jutland | Major |
| Frederikshavn | Jutland | Major |
| Hirtshals | Jutland | Major |
| Helsingør | Zealand | Major |
| Hornbæk | Zealand | Secondary |
| Korsør | Zealand | Secondary |
| Gedser | Zealand | Secondary |
| Fredericia | Jutland | Secondary |
| Rønne | Bornholm | Secondary |

## 📂 Project Structure

```
workspace/
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   └── vite.svg        # App icon
├── src/
│   ├── components/      # React components
│   │   ├── Map.jsx            # Main map component
│   │   ├── StationMarker.jsx  # Tide station markers
│   │   ├── TideCard.jsx       # Tide information card
│   │   ├── TideChart.jsx      # Prediction chart
│   │   ├── SearchBar.jsx      # Station search
│   │   ├── Header.jsx         # App header
│   │   └── InfoModal.jsx      # Information modal
│   ├── services/        # API services
│   │   └── tideService.js     # Tide data fetching
│   ├── data/            # Static data
│   │   └── danishStations.js  # Station coordinates
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## 🔧 Configuration

### API Integration

To use real tide data instead of mock data:

1. Get a WorldTides API key: https://www.worldtides.info/developer
2. Add it to `.env`:
   ```
   VITE_TIDE_API_KEY=your_key_here
   ```
3. Open `src/services/tideService.js` and uncomment the real API code (search for "REAL API INTEGRATION")

The mock data is quite realistic and suitable for development and demos. It simulates:
- Semi-diurnal tides (2 high tides, 2 low tides per day)
- Different tide ranges for North Sea vs Baltic Sea
- Proper tide cycles (~12.4 hours between high tides)
- Realistic heights and timing

### Adding New Stations

Edit `src/data/danishStations.js`:

```javascript
{
  id: 'station-id',
  name: 'Station Name',
  nameLocal: 'Lokalt Navn',
  lat: 55.1234,
  lon: 10.5678,
  description: 'Description',
  type: 'major', // or 'secondary'
  region: 'Region'
}
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the ocean color palette:

```javascript
colors: {
  ocean: {
    // Customize these values
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  }
}
```

### Map Settings

Adjust map center and zoom in `src/components/Map.jsx`:

```javascript
const denmarkCenter = [55.7, 10.5]
const defaultZoom = 7
```

## 📊 Data Sources

- **Tide Data**: WorldTides API (optional, uses mock data by default)
- **Map Tiles**: OpenStreetMap
- **Station Coordinates**: Danish Meteorological Institute references

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- OpenStreetMap contributors for map tiles
- WorldTides for tide prediction API
- Danish Meteorological Institute for station references
- The React and Vite communities

## 🐛 Known Issues

- PWA icons are placeholders (need actual PNG icons for production)
- Using mock tide data by default (real API integration commented out)
- Service worker caching may need tuning for production

## 🔮 Future Enhancements

- [ ] Real-time weather integration
- [ ] Sunrise/sunset times
- [ ] Wave height predictions
- [ ] Current/flow direction
- [ ] Historical tide data
- [ ] Favorite stations
- [ ] Push notifications for tide alerts
- [ ] Multi-language support (Danish/English)
- [ ] User location detection
- [ ] More stations coverage

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ for coastal enthusiasts in Denmark
