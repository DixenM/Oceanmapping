import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StationList } from './StationList'
import type { TideStation } from '../types'

// Mock the useFavorites hook
vi.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    oIsFavorite: vi.fn((id: string) => id === 'copenhagen'),
    oToggleFavorite: vi.fn(),
    oFavoriteCount: 2,
    oFavoriteMap: new Map([['copenhagen', true], ['esbjerg', true]]),
    oLoadError: null,
    oFavorites: [
      { stationId: 'copenhagen', addedAt: 2000 },
      { stationId: 'esbjerg', addedAt: 1000 }
    ]
  })
}))

const mockStations: TideStation[] = [
  {
    id: 'copenhagen',
    name: 'København',
    latitude: 55.6761,
    longitude: 12.5872,
    city: 'Copenhagen',
    region: 'Zealand'
  },
  {
    id: 'esbjerg',
    name: 'Esbjerg',
    latitude: 55.4677,
    longitude: 8.4380,
    city: 'Esbjerg',
    region: 'South Jutland'
  },
  {
    id: 'aalborg',
    name: 'Aalborg',
    latitude: 57.0488,
    longitude: 9.9217,
    city: 'Aalborg',
    region: 'North Jutland'
  }
]

describe('StationList', () => {
  const mockOnStationSelect = vi.fn()

  it('should render station list toggle button', () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    expect(screen.getByLabelText('Open stations list')).toBeInTheDocument()
  })

  it('should open panel when toggle button is clicked', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('Danish Tide Stations')).toBeInTheDocument()
    })
  })

  it('should display all stations by default', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/København tide station/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Esbjerg tide station/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Aalborg tide station/)).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should display filter tabs', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('All Stations')).toBeInTheDocument()
      expect(screen.getByText(/Favorites/)).toBeInTheDocument()
    })
  })

  it('should display favorite count badge', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('should display station count', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('3 locations')).toBeInTheDocument()
    })
  })

  it('should show heart icons for stations', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const favoriteButtons = screen.getAllByLabelText(/favorites/)
      expect(favoriteButtons.length).toBeGreaterThan(0)
    })
  })

  it('should call onStationSelect when station is clicked', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const stationButton = screen.getByText(/København/).closest('div[role="button"]')
      expect(stationButton).toBeInTheDocument()
      fireEvent.click(stationButton!)
    }, { timeout: 1000 })

    expect(mockOnStationSelect).toHaveBeenCalledWith(mockStations[0])
  })

  it('should close panel after selecting a station', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const stationButton = screen.getByText(/København/).closest('div[role="button"]')
      expect(stationButton).toBeInTheDocument()
      fireEvent.click(stationButton!)
    }, { timeout: 1000 })

    // Panel closes - check that toggle button shows "Open" instead of "Close"
    await waitFor(() => {
      expect(screen.getByLabelText('Open stations list')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should support keyboard navigation for stations', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const stationButton = screen.getByText(/København/).closest('div[role="button"]')
      expect(stationButton).toBeInTheDocument()
      fireEvent.keyDown(stationButton!, { key: 'Enter' })
    }, { timeout: 1000 })

    expect(mockOnStationSelect).toHaveBeenCalled()
  })

  it('should show backdrop when panel is open', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const backdrops = screen.getAllByLabelText('Close stations list')
      // Should have both toggle button (now labeled "Close") and backdrop
      expect(backdrops.length).toBeGreaterThan(0)
    })
  })

  it('should group stations by region', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('Zealand')).toBeInTheDocument()
      expect(screen.getByText('South Jutland')).toBeInTheDocument()
      expect(screen.getByText('North Jutland')).toBeInTheDocument()
    })
  })

  it('should show star badge for favorited stations', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const stars = screen.getAllByText('★')
      expect(stars.length).toBeGreaterThan(0)
    })
  })

  it('should have correct ARIA labels', async () => {
    render(<StationList iStations={mockStations} iOnStationSelect={mockOnStationSelect} />)
    
    const toggleButton = screen.getByLabelText('Open stations list')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByLabelText('Show all stations')).toBeInTheDocument()
      expect(screen.getByLabelText('Show favorite stations only')).toBeInTheDocument()
    })
  })
})
