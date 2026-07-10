import React, { useState } from 'react'
import { TileLayer } from 'react-leaflet'
import '../styles/BathymetryLayerControl.css'

/**
 * BathymetryLayerControl component props
 */
export interface BathymetryLayerControlProps {
  iDefaultEnabled?: boolean
}

/**
 * BathymetryLayerControl component
 * 
 * Purpose: Provides toggleable ocean depth/bathymetry layer for nautical charts
 * Uses OpenSeaMap tiles for depth contours and nautical information
 * 
 * Features:
 * - Toggle button in map corner
 * - Optional layer (default off to save bandwidth)
 * - Shows depth contours and nautical chart features
 * - Mobile-optimized controls
 * 
 * @param {BathymetryLayerControlProps} props - Component props
 * @returns {JSX.Element} Bathymetry layer with toggle control
 */
export const BathymetryLayerControl: React.FC<BathymetryLayerControlProps> = ({ 
  iDefaultEnabled = false 
}) => {
  const [isEnabled, setIsEnabled] = useState(iDefaultEnabled)

  /**
   * Toggles bathymetry layer visibility
   * 
   * Purpose: Enable/disable ocean depth overlay
   * 
   * @returns {void}
   */
  const handleToggle = (): void => {
    setIsEnabled(!isEnabled)
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="bathymetry-control">
        <button
          onClick={handleToggle}
          className={`bathymetry-toggle-btn ${isEnabled ? 'active' : ''}`}
          aria-label="Toggle bathymetry layer"
          title={isEnabled ? 'Hide ocean depth' : 'Show ocean depth'}
          data-testid="bathymetry-toggle"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 12h3m12 0h3M3 18h3m12 0h3M3 6h3m12 0h3" />
            <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
          </svg>
          <span className="bathymetry-label">Depth</span>
        </button>
      </div>

      {/* OpenSeaMap Bathymetry Layer */}
      {isEnabled && (
        <TileLayer
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a>'
          maxZoom={18}
          opacity={0.7}
        />
      )}
    </>
  )
}
