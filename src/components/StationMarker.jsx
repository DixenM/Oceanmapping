import { Marker, Tooltip } from 'react-leaflet'
import { Icon } from 'leaflet'

/**
 * Custom marker icon for tide stations
 */
const createStationIcon = (isSelected, isMajor) => {
  const size = isMajor ? 32 : 24
  const color = isSelected ? '#38bdf8' : isMajor ? '#0ea5e9' : '#0284c7'
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M12 6 L12 18 M6 12 L18 12" stroke="white" stroke-width="2"/>
    </svg>
  `
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  })
}

/**
 * StationMarker Component
 * Displays a clickable marker for a tide station
 */
const StationMarker = ({ station, onClick, isSelected }) => {
  const icon = createStationIcon(isSelected, station.type === 'major')

  return (
    <Marker
      position={[station.lat, station.lon]}
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
        <div className="text-sm">
          <div className="font-semibold">{station.nameLocal}</div>
          <div className="text-xs text-slate-300">{station.description}</div>
        </div>
      </Tooltip>
    </Marker>
  )
}

export default StationMarker
