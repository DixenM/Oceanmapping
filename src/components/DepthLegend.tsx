import React from 'react'
import '../styles/DepthLegend.css'

/**
 * DepthLegend component
 * 
 * Purpose: Displays color-coded legend for ocean depth interpretation
 * Shows depth ranges with corresponding colors from GEBCO bathymetry
 * and depth marker color coding
 * 
 * Features:
 * - Compact legend showing depth ranges
 * - Color gradient matching visualization
 * - Mobile-optimized positioning
 * - Shows both bathymetry colors and marker colors
 * 
 * @returns {JSX.Element} Depth legend component
 */
export const DepthLegend: React.FC = () => {
  return (
    <div className="depth-legend">
      <div className="legend-title">Ocean Depth</div>
      
      <div className="legend-section">
        <div className="legend-section-title">Depth Markers</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#10b981' }}>5m</div>
            <span className="legend-label">0-10m Shallow</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#14b8a6' }}>15m</div>
            <span className="legend-label">10-25m Medium</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#0ea5e9' }}>35m</div>
            <span className="legend-label">25-50m Deep</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#3b82f6' }}>75m</div>
            <span className="legend-label">50m+ Very Deep</span>
          </div>
        </div>
      </div>
      
      <div className="legend-section">
        <div className="legend-section-title">Color Shading</div>
        <div className="legend-gradient">
          <div className="gradient-bar"></div>
          <div className="gradient-labels">
            <span>Shallow</span>
            <span>Deep</span>
          </div>
        </div>
      </div>
      
      <div className="legend-note">
        Tap markers for details<br/>
        More markers when zoomed in
      </div>
    </div>
  )
}
