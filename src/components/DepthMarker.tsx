import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { DepthPoint } from '../types'

/**
 * DepthMarker component props
 */
export interface DepthMarkerProps {
  iDepthPoint: DepthPoint
}

/**
 * Creates custom depth marker icon
 * 
 * Purpose: Generate small, readable depth label icons for map
 * Icons show depth in meters with color coding based on depth
 * 
 * @param {number} iDepth - Depth in meters
 * @returns {L.DivIcon} oIcon - Leaflet div icon for depth marker
 */
const createDepthIcon = (iDepth: number): L.DivIcon => {
  // Color coding based on depth
  let bgColor = '#10b981' // green for shallow
  let textColor = '#ffffff'
  
  if (iDepth > 50) {
    bgColor = '#3b82f6' // blue for deep
  } else if (iDepth > 25) {
    bgColor = '#0ea5e9' // sky blue for medium
  } else if (iDepth > 10) {
    bgColor = '#14b8a6' // teal for medium-shallow
  }
  
  const oIcon = L.divIcon({
    className: 'depth-marker-icon',
    html: `
      <div style="
        background: ${bgColor};
        color: ${textColor};
        border: 2px solid white;
        border-radius: 12px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-family: -apple-system, system-ui, sans-serif;
      ">
        ${iDepth}m
      </div>
    `,
    iconSize: [40, 20],
    iconAnchor: [20, 10],
  })
  
  return oIcon
}

/**
 * DepthMarker component
 * 
 * Purpose: Displays individual depth marker on map with popup
 * Shows depth in meters with color-coded icon
 * Provides detailed information on click
 * 
 * Features:
 * - Small, readable depth label
 * - Color-coded by depth (shallow green, deep blue)
 * - Interactive popup with details
 * - Non-overlapping design
 * - Mobile-friendly
 * 
 * @param {DepthMarkerProps} props - Component props
 * @returns {JSX.Element} Depth marker with popup
 */
export const DepthMarker: React.FC<DepthMarkerProps> = ({ iDepthPoint }) => {
  const icon = createDepthIcon(iDepthPoint.depth)
  
  return (
    <Marker
      position={[iDepthPoint.latitude, iDepthPoint.longitude]}
      icon={icon}
    >
      <Popup>
        <div className="depth-marker-popup">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700 }}>
            {iDepthPoint.location}
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0ea5e9', margin: '8px 0' }}>
            {iDepthPoint.depth}m
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Depth below sea level
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
            Lat: {iDepthPoint.latitude.toFixed(4)}<br/>
            Lon: {iDepthPoint.longitude.toFixed(4)}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
