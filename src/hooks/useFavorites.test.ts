import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFavorites } from './useFavorites'

/**
 * Test suite for useFavorites hook
 * 
 * Tests cover:
 * - Initial state
 * - Adding favorites
 * - Removing favorites
 * - Toggling favorites
 * - Checking favorite status
 * - LocalStorage persistence
 * - Error handling
 * - Input validation
 * - Performance optimizations
 */
describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should initialize with empty favorites', async () => {
      const { result } = renderHook(() => useFavorites())

      // Wait for initial load
      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      expect(result.current.oFavorites).toEqual([])
      expect(result.current.oFavoriteCount).toBe(0)
      expect(result.current.oLoadError).toBe(null)
    })

    it('should set oIsLoaded to true after loading', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => {
        expect(result.current.oIsLoaded).toBe(true)
      })
    })

    it('should load favorites from localStorage', async () => {
      const mockFavorites = [
        { stationId: 'station1', addedAt: 1000 },
        { stationId: 'station2', addedAt: 2000 }
      ]
      localStorage.setItem('oceanmapping_favorites', JSON.stringify(mockFavorites))

      const { result } = renderHook(() => useFavorites())

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(2)
        expect(result.current.oFavoriteCount).toBe(2)
      })
    })

    it('should sort loaded favorites by most recent first', async () => {
      const mockFavorites = [
        { stationId: 'station1', addedAt: 1000 },
        { stationId: 'station2', addedAt: 3000 },
        { stationId: 'station3', addedAt: 2000 }
      ]
      localStorage.setItem('oceanmapping_favorites', JSON.stringify(mockFavorites))

      const { result } = renderHook(() => useFavorites())

      await waitFor(() => {
        expect(result.current.oFavorites[0].stationId).toBe('station2')
        expect(result.current.oFavorites[1].stationId).toBe('station3')
        expect(result.current.oFavorites[2].stationId).toBe('station1')
      })
    })
  })

  describe('Adding Favorites', () => {
    it('should add a station to favorites', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
        expect(result.current.oFavorites[0].stationId).toBe('copenhagen')
        expect(result.current.oFavoriteCount).toBe(1)
      })
    })

    it('should not add duplicate favorites', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
        result.current.oAddFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })
    })

    it('should add new favorites to the front of the array', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('station1')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })

      act(() => {
        result.current.oAddFavorite('station2')
      })

      await waitFor(() => {
        expect(result.current.oFavorites[0].stationId).toBe('station2')
        expect(result.current.oFavorites[1].stationId).toBe('station1')
      })
    })

    it('should persist to localStorage when adding', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
      })

      await waitFor(() => {
        const stored = localStorage.getItem('oceanmapping_favorites')
        expect(stored).toBeTruthy()
        const parsed = JSON.parse(stored!)
        expect(parsed).toHaveLength(1)
        expect(parsed[0].stationId).toBe('copenhagen')
      })
    })

    it('should validate station ID and reject invalid inputs', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('')
        result.current.oAddFavorite('   ')
        // @ts-expect-error Testing invalid input
        result.current.oAddFavorite(null)
        // @ts-expect-error Testing invalid input
        result.current.oAddFavorite(undefined)
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(0)
      })
    })
  })

  describe('Removing Favorites', () => {
    it('should remove a station from favorites', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
        result.current.oAddFavorite('esbjerg')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(2)
      })

      act(() => {
        result.current.oRemoveFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
        expect(result.current.oFavorites[0].stationId).toBe('esbjerg')
      })
    })

    it('should handle removing non-existent station gracefully', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })

      act(() => {
        result.current.oRemoveFavorite('nonexistent')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })
    })

    it('should persist to localStorage when removing', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
        result.current.oAddFavorite('esbjerg')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(2)
      })

      act(() => {
        result.current.oRemoveFavorite('copenhagen')
      })

      await waitFor(() => {
        const stored = localStorage.getItem('oceanmapping_favorites')
        const parsed = JSON.parse(stored!)
        expect(parsed).toHaveLength(1)
        expect(parsed[0].stationId).toBe('esbjerg')
      })
    })
  })

  describe('Toggling Favorites', () => {
    it('should add a station when toggling non-favorited station', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oToggleFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
        expect(result.current.oFavorites[0].stationId).toBe('copenhagen')
      })
    })

    it('should remove a station when toggling favorited station', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oToggleFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })

      act(() => {
        result.current.oToggleFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(0)
      })
    })

    it('should validate station ID in toggle', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oToggleFavorite('')
        // @ts-expect-error Testing invalid input
        result.current.oToggleFavorite(null)
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(0)
      })
    })
  })

  describe('Checking Favorite Status', () => {
    it('should return true for favorited stations', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('copenhagen')
      })

      await waitFor(() => {
        expect(result.current.oIsFavorite('copenhagen')).toBe(true)
      })
    })

    it('should return false for non-favorited stations', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      expect(result.current.oIsFavorite('copenhagen')).toBe(false)
    })

    it('should use Map for O(1) lookup performance', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('station1')
        result.current.oAddFavorite('station2')
      })

      await waitFor(() => {
        expect(result.current.oFavoriteMap).toBeInstanceOf(Map)
        expect(result.current.oFavoriteMap.size).toBe(2)
        expect(result.current.oFavoriteMap.has('station1')).toBe(true)
        expect(result.current.oFavoriteMap.has('station2')).toBe(true)
      })
    })
  })

  describe('Clearing Favorites', () => {
    it('should clear all favorites', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('station1')
        result.current.oAddFavorite('station2')
        result.current.oAddFavorite('station3')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(3)
      })

      act(() => {
        result.current.oClearFavorites()
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(0)
        expect(result.current.oFavoriteCount).toBe(0)
      })
    })

    it('should persist empty array to localStorage when clearing', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      act(() => {
        result.current.oAddFavorite('station1')
      })

      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })

      act(() => {
        result.current.oClearFavorites()
      })

      await waitFor(() => {
        const stored = localStorage.getItem('oceanmapping_favorites')
        const parsed = JSON.parse(stored!)
        expect(parsed).toHaveLength(0)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem('oceanmapping_favorites', 'invalid json{{{')

      const { result } = renderHook(() => useFavorites())

      await waitFor(() => {
        expect(result.current.oIsLoaded).toBe(true)
        expect(result.current.oFavorites).toHaveLength(0)
        expect(result.current.oLoadError).toBeTruthy()
        expect(result.current.oLoadError).toContain('Failed to load')
      })
    })

    it('should handle localStorage being full or unavailable', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      act(() => {
        result.current.oAddFavorite('copenhagen')
      })

      // Should not crash, but log error
      await waitFor(() => {
        expect(result.current.oFavorites).toHaveLength(1)
      })

      // Restore original
      Storage.prototype.setItem = originalSetItem
    })
  })

  describe('Favorite Count', () => {
    it('should return correct favorite count', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      expect(result.current.oFavoriteCount).toBe(0)

      act(() => {
        result.current.oAddFavorite('station1')
      })

      await waitFor(() => {
        expect(result.current.oFavoriteCount).toBe(1)
      })

      act(() => {
        result.current.oAddFavorite('station2')
        result.current.oAddFavorite('station3')
      })

      await waitFor(() => {
        expect(result.current.oFavoriteCount).toBe(3)
      })
    })
  })

  describe('Timestamp Management', () => {
    it('should set addedAt timestamp when adding favorites', async () => {
      const { result } = renderHook(() => useFavorites())

      await waitFor(() => expect(result.current.oIsLoaded).toBe(true))

      const beforeTime = Date.now()

      act(() => {
        result.current.oAddFavorite('copenhagen')
      })

      await waitFor(() => {
        const favorite = result.current.oFavorites[0]
        expect(favorite.addedAt).toBeGreaterThanOrEqual(beforeTime)
        expect(favorite.addedAt).toBeLessThanOrEqual(Date.now())
      })
    })
  })
})
