import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TideInfoPopup } from './TideInfoPopup'
import type { TideStation } from '../types'

// Mock the hooks
const mockUseTideData = vi.fn()
const mockUseFavorites = vi.fn()

vi.mock('../hooks/useTideData', () => ({
  useTideData: () => mockUseTideData()
}))

vi.mock('../hooks/useFavorites', () => ({
  useFavorites: () => mockUseFavorites()
}))

const mockStation: TideStation = {
  id: 'copenhagen',
  name: 'København',
  latitude: 55.6761,
  longitude: 12.5872,
  city: 'Copenhagen',
  region: 'Zealand'
}

const mockTideData = {
  current: {
    height: 1.5,
    time: '2026-07-10T12:00:00Z'
  },
  extremes: [
    { height: 2.1, time: '2026-07-10T14:00:00Z', type: 'High' as const },
    { height: 0.3, time: '2026-07-10T20:00:00Z', type: 'Low' as const }
  ],
  status: {
    state: 'rising' as const,
    message: 'Tide is rising',
    color: '#10b981',
    icon: '↑'
  }
}

describe('TideInfoPopup', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockUseTideData.mockReturnValue({
      data: mockTideData,
      isLoading: false,
      error: null
    })

    mockUseFavorites.mockReturnValue({
      oIsFavorite: vi.fn(() => false),
      oToggleFavorite: vi.fn()
    })
  })

  it('should render station name and location', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByText('København')).toBeInTheDocument()
    expect(screen.getByText('Copenhagen, Zealand')).toBeInTheDocument()
  })

  it('should render favorite button', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument()
  })

  it('should show unfilled heart when not favorited', () => {
    mockUseFavorites.mockReturnValue({
      oIsFavorite: vi.fn(() => false),
      oToggleFavorite: vi.fn()
    })

    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    const favoriteButton = screen.getByLabelText('Add to favorites')
    expect(favoriteButton.textContent).toBe('♡')
  })

  it('should show filled heart when favorited', () => {
    mockUseFavorites.mockReturnValue({
      oIsFavorite: vi.fn(() => true),
      oToggleFavorite: vi.fn()
    })

    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    const favoriteButton = screen.getByLabelText('Remove from favorites')
    expect(favoriteButton.textContent).toBe('♥')
  })

  it('should call toggleFavorite when favorite button is clicked', () => {
    const mockToggleFavorite = vi.fn()
    mockUseFavorites.mockReturnValue({
      oIsFavorite: vi.fn(() => false),
      oToggleFavorite: mockToggleFavorite
    })

    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    const favoriteButton = screen.getByLabelText('Add to favorites')
    fireEvent.click(favoriteButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith('copenhagen')
  })

  it('should render close button', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByLabelText('Close tide information')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    const closeButton = screen.getByLabelText('Close tide information')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display loading state', () => {
    mockUseTideData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByText('Loading tide data...')).toBeInTheDocument()
  })

  it('should display error state', () => {
    mockUseTideData.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch')
    })

    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByText(/Failed to load tide data/)).toBeInTheDocument()
  })

  it('should display tide data when loaded', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByText('Current Conditions')).toBeInTheDocument()
    expect(screen.getByText('Upcoming Tides')).toBeInTheDocument()
  })

  it('should have favorite and close buttons in header', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    const favoriteButton = screen.getByLabelText('Add to favorites')
    const closeButton = screen.getByLabelText('Close tide information')

    // Both buttons should be in the header
    const header = favoriteButton.closest('.popup-header')
    expect(header).toContain(closeButton)
  })

  it('should have correct button titles for tooltips', () => {
    render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    const favoriteButton = screen.getByLabelText('Add to favorites')
    expect(favoriteButton).toHaveAttribute('title', 'Add to favorites')
  })

  it('should update button when favorite status changes', () => {
    const { rerender } = render(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument()

    // Change favorite status
    mockUseFavorites.mockReturnValue({
      oIsFavorite: vi.fn(() => true),
      oToggleFavorite: vi.fn()
    })

    rerender(<TideInfoPopup iStation={mockStation} iOnClose={mockOnClose} />)

    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument()
  })
})
