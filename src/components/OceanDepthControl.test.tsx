import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MapContainer } from 'react-leaflet'
import { OceanDepthControl } from './OceanDepthControl'

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MapContainer center={[56.0, 10.0]} zoom={7}>
    {children}
  </MapContainer>
)

describe('OceanDepthControl', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('should render toggle button', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      expect(button).toBeInTheDocument()
    })

    it('should be disabled by default', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      expect(button).not.toHaveClass('active')
    })

    it('should respect iDefaultEnabled prop', () => {
      render(
        <TestWrapper>
          <OceanDepthControl iDefaultEnabled={true} />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      expect(button).toHaveClass('active')
    })

    it('should load state from localStorage', () => {
      localStorage.setItem('ocean-depth-enabled', 'true')
      
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      expect(button).toHaveClass('active')
    })
  })

  describe('toggle functionality', () => {
    it('should toggle active state on click', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      
      expect(button).not.toHaveClass('active')
      expect(screen.getByText('Show Depth')).toBeInTheDocument()
      
      fireEvent.click(button)
      expect(button).toHaveClass('active')
      expect(screen.getByText('Hide Depth')).toBeInTheDocument()
      
      fireEvent.click(button)
      expect(button).not.toHaveClass('active')
      expect(screen.getByText('Show Depth')).toBeInTheDocument()
    })

    it('should save state to localStorage', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      
      fireEvent.click(button)
      expect(localStorage.getItem('ocean-depth-enabled')).toBe('true')
      
      fireEvent.click(button)
      expect(localStorage.getItem('ocean-depth-enabled')).toBe('false')
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      expect(button).toHaveAttribute('aria-label', 'Show ocean depth')
    })

    it('should update aria-label when toggled', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-label', 'Hide ocean depth')
    })

    it('should be keyboard accessible', () => {
      render(
        <TestWrapper>
          <OceanDepthControl />
        </TestWrapper>
      )
      
      const button = screen.getByTestId('ocean-depth-toggle')
      button.focus()
      
      expect(button).toHaveFocus()
    })
  })
})
