import React, { useState, useEffect } from 'react'
import { WMSTileLayer, useMap } from 'react-leaflet'
import { DepthMarker } from './DepthMarker'
import { DepthLegend } from './DepthLegend'
import { getVisibleDepthPoints } from '../data/depthPoints'
import '../styles/OceanDepthControl.css'

/**
 * OceanDepthControl component props
 */
export interface OceanDepthControlProps {
  iDefaultEnabled?: boolean
}

const STORAGE_KEY = 'ocean-depth-enabled'

/**
 * OceanDepthControl component
 * 
 * Purpose: Complete ocean depth visualization with color shading and numeric markers
 * Manages GEBCO bathymetry layer and 80+ depth point markers
 * Persists state to localStorage for better UX
 * 
 * Features:
 * - Large, clear toggle button
 * - Color-coded bathymetry layer (GEBCO_LATEST_2)
 * - 80+ numeric depth markers (zoom-based visibility)
 * - Interactive markers with detailed popups
 * - Depth legend
 * - State persistence (localStorage)
 * - Mobile-optimized
 * 
 * @param {OceanDepthControlProps} props - Component props
 * @returns {JSX.Element} Ocean depth control with all features
 */
export const OceanDepthControl: React.FC<OceanDepthControlProps> = ({ 
  iDefaultEnabled = false 
}) => {
  const map = useMap()
  const [isEnabled, setIsEnabled] = useState(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      return stored === 'true'
    }
    return iDefaultEnabled
  })
  
  const [currentZoom, setCurrentZoom] = useState(map.getZoom())
  const [visibleDepthPoints, setVisibleDepthPoints] = useState(
    getVisibleDepthPoints(currentZoom)
  )

  /**
   * Handles zoom changes for depth marker visibility
   * 
   * Purpose: Update visible depth markers based on zoom level
   * Shows more detail at higher zoom for better performance
   * 
   * @returns {void}
   */
  useEffect(() => {
    const handleZoomEnd = () => {
      const zoom = map.getZoom()
      setCurrentZoom(zoom)
      setVisibleDepthPoints(getVisibleDepthPoints(zoom))
    }

    map.on('zoomend', handleZoomEnd)
    
    return () => {
      map.off('zoomend', handleZoomEnd)
    }
  }, [map])

  /**
   * Toggles ocean depth visualization
   * 
   * Purpose: Enable/disable depth layer and markers
   * Persists state to localStorage
   * 
   * @returns {void}
   */
  const handleToggle = (): void => {
    const newState = !isEnabled
    setIsEnabled(newState)
    localStorage.setItem(STORAGE_KEY, String(newState))
  }

  return (
    <>
      {/* Large Toggle Button */}
      <div className="ocean-depth-control">
        <button
          onClick={handleToggle}
          className={`depth-toggle-btn ${isEnabled ? 'active' : ''}`}
          aria-label={isEnabled ? 'Hide ocean depth' : 'Show ocean depth'}
          title={isEnabled ? 'Hide Depth' : 'Show Depth'}
          data-testid="ocean-depth-toggle"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 9h18M3 15h18" />
            <circle cx="12" cy="12" r="9" strokeDasharray="3 2" opacity="0.5" />
          </svg>
          <span className="depth-toggle-label">
            {isEnabled ? 'Hide Depth' : 'Show Depth'}
          </span>
        </button>
      </div>

      {/* GEBCO Color-Coded Bathymetry Layer */}
      {isEnabled && (
        <>
          <WMSTileLayer
            url="https://wms.gebco.net/mapserv?"
            layers="GEBCO_LATEST_2"
            format="image/png"
            transparent={true}
            attribution='&copy; <a href="https://www.gebco.net/">GEBCO</a>'
            opacity={0.7}
          />
          
          {/* Numeric Depth Markers */}
          {visibleDepthPoints.map(point => (
            <DepthMarker key={point.id} iDepthPoint={point} />
          ))}
          
          {/* Depth Legend */}
          <DepthLegend />
        </>
      )}
    </>
  )
}
