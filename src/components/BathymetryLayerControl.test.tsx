import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MapContainer } from 'react-leaflet'
import { BathymetryLayerControl } from './BathymetryLayerControl'

/**
 * Test wrapper component for BathymetryLayerControl
 * 
 * Purpose: Provides required MapContainer context for testing
 * React-Leaflet components must be rendered within MapContainer
 * 
 * @param {object} props - Component props to pass to BathymetryLayerControl
 * @returns {JSX.Element} Wrapped component for testing
 */
const TestWrapper: React.FC<{ iDefaultEnabled?: boolean }> = ({ iDefaultEnabled }) => (
  <MapContainer center={[56.0, 10.0]} zoom={7}>
    <BathymetryLayerControl iDefaultEnabled={iDefaultEnabled} />
  </MapContainer>
)

describe('BathymetryLayerControl', () => {
  describe('initialization', () => {
    it('should render toggle button', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      expect(button).toBeInTheDocument()
    })

    it('should be disabled by default', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      expect(button).not.toHaveClass('active')
    })

    it('should respect iDefaultEnabled prop', () => {
      render(<TestWrapper iDefaultEnabled={true} />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      expect(button).toHaveClass('active')
    })

    it('should have correct aria-label', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      expect(button).toHaveAttribute('aria-label', 'Toggle bathymetry layer')
    })
  })

  describe('toggle functionality', () => {
    it('should toggle active state on click', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      
      expect(button).not.toHaveClass('active')
      
      fireEvent.click(button)
      expect(button).toHaveClass('active')
      
      fireEvent.click(button)
      expect(button).not.toHaveClass('active')
    })

    it('should change title attribute when toggled', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      
      expect(button).toHaveAttribute('title', 'Show ocean depth')
      
      fireEvent.click(button)
      expect(button).toHaveAttribute('title', 'Hide ocean depth')
      
      fireEvent.click(button)
      expect(button).toHaveAttribute('title', 'Show ocean depth')
    })
  })

  describe('accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      button.focus()
      
      expect(button).toHaveFocus()
    })

    it('should display label text', () => {
      render(<TestWrapper />)
      
      const label = screen.getByText('Depth')
      expect(label).toBeInTheDocument()
    })
  })

  describe('visual states', () => {
    it('should show SVG icon', () => {
      render(<TestWrapper />)
      
      const button = screen.getByTestId('bathymetry-toggle')
      const svg = button.querySelector('svg')
      
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
    })
  })
})
