import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DepthLegend } from './DepthLegend'

describe('DepthLegend', () => {
  describe('rendering', () => {
    it('should render legend title', () => {
      render(<DepthLegend />)
      
      expect(screen.getByText('Ocean Depth')).toBeInTheDocument()
    })

    it('should render depth markers section', () => {
      render(<DepthLegend />)
      
      expect(screen.getByText('Depth Markers')).toBeInTheDocument()
    })

    it('should render color shading section', () => {
      render(<DepthLegend />)
      
      expect(screen.getByText('Color Shading')).toBeInTheDocument()
    })

    it('should render all depth ranges', () => {
      render(<DepthLegend />)
      
      expect(screen.getByText('0-10m Shallow')).toBeInTheDocument()
      expect(screen.getByText('10-25m Medium')).toBeInTheDocument()
      expect(screen.getByText('25-50m Deep')).toBeInTheDocument()
      expect(screen.getByText('50m+ Very Deep')).toBeInTheDocument()
    })

    it('should render helper note', () => {
      render(<DepthLegend />)
      
      expect(screen.getByText(/Tap markers for details/)).toBeInTheDocument()
      expect(screen.getByText(/More markers when zoomed in/)).toBeInTheDocument()
    })

    it('should render gradient labels', () => {
      render(<DepthLegend />)
      
      expect(screen.getByText('Shallow')).toBeInTheDocument()
      expect(screen.getByText('Deep')).toBeInTheDocument()
    })
  })

  describe('structure', () => {
    it('should have correct CSS classes', () => {
      const { container } = render(<DepthLegend />)
      
      expect(container.querySelector('.depth-legend')).toBeInTheDocument()
      expect(container.querySelector('.legend-title')).toBeInTheDocument()
      expect(container.querySelector('.legend-section')).toBeInTheDocument()
      expect(container.querySelector('.legend-gradient')).toBeInTheDocument()
    })

    it('should have gradient bar', () => {
      const { container } = render(<DepthLegend />)
      
      const gradientBar = container.querySelector('.gradient-bar')
      expect(gradientBar).toBeInTheDocument()
    })
  })
})
