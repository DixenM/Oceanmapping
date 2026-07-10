import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MapContainer } from 'react-leaflet'
import { DepthMarker } from './DepthMarker'
import { DepthPoint } from '../types'

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MapContainer center={[56.0, 10.0]} zoom={7}>
    {children}
  </MapContainer>
)

describe('DepthMarker', () => {
  const mockDepthPoint: DepthPoint = {
    id: 'test-1',
    latitude: 56.0,
    longitude: 10.0,
    depth: 25,
    location: 'Test Location'
  }

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <TestWrapper>
          <DepthMarker iDepthPoint={mockDepthPoint} />
        </TestWrapper>
      )
      
      expect(container).toBeTruthy()
    })

    it('should render with shallow depth', () => {
      const shallowPoint: DepthPoint = {
        ...mockDepthPoint,
        depth: 5
      }
      
      const { container } = render(
        <TestWrapper>
          <DepthMarker iDepthPoint={shallowPoint} />
        </TestWrapper>
      )
      
      expect(container).toBeTruthy()
    })

    it('should render with deep depth', () => {
      const deepPoint: DepthPoint = {
        ...mockDepthPoint,
        depth: 75
      }
      
      const { container } = render(
        <TestWrapper>
          <DepthMarker iDepthPoint={deepPoint} />
        </TestWrapper>
      )
      
      expect(container).toBeTruthy()
    })
  })

  describe('depth point data', () => {
    it('should handle different depth values', () => {
      const depths = [5, 15, 30, 60, 100]
      
      depths.forEach(depth => {
        const point: DepthPoint = {
          ...mockDepthPoint,
          depth
        }
        
        const { container } = render(
          <TestWrapper>
            <DepthMarker iDepthPoint={point} />
          </TestWrapper>
        )
        
        expect(container).toBeTruthy()
      })
    })
  })
})
