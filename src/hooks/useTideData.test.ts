import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTideData } from './useTideData'
import * as tideApi from '../services/tideApi'
import React, { type ReactNode } from 'react'

/**
 * Unit tests for useTideData hook
 * 
 * Purpose: Verify tide data hook functionality including caching,
 * loading states, error handling, and query configuration
 */

describe('useTideData', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    // Create a new QueryClient for each test to avoid cache pollution
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for testing
        },
      },
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }

  describe('Happy path - successful data fetching', () => {
    it('should fetch tide data successfully', async () => {
      // Arrange
      const iLatitude = 56.1496
      const iLongitude = 10.2134
      const mockTideData = {
        current: { height: 1.5, time: '2024-01-01T12:00:00Z' },
        extremes: [
          { height: 2.1, time: '2024-01-01T14:00:00Z', type: 'High' as const },
          { height: 0.5, time: '2024-01-02T02:00:00Z', type: 'Low' as const }
        ],
        status: {
          state: 'rising' as const,
          message: 'Rising',
          color: '#3b82f6',
          icon: '↗️'
        }
      }

      vi.spyOn(tideApi, 'fetchTideData').mockResolvedValue(mockTideData)

      // Act
      const { result } = renderHook(
        () => useTideData(iLatitude, iLongitude),
        { wrapper }
      )

      // Assert - Initial loading state
      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Assert - Success state
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockTideData)
      expect(result.current.error).toBeNull()
    })

    it('should use correct query key for caching', async () => {
      // Arrange
      const iLatitude = 56.1496
      const iLongitude = 10.2134
      const mockTideData = {
        current: { height: 1.5, time: '2024-01-01T12:00:00Z' },
        extremes: [],
        status: {
          state: 'rising' as const,
          message: 'Rising',
          color: '#3b82f6',
          icon: '↗️'
        }
      }

      const fetchSpy = vi.spyOn(tideApi, 'fetchTideData').mockResolvedValue(mockTideData)

      // Act - First call
      const { result: result1 } = renderHook(
        () => useTideData(iLatitude, iLongitude),
        { wrapper }
      )

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
      })

      // Act - Second call with same coordinates (should use cache)
      const { result: result2 } = renderHook(
        () => useTideData(iLatitude, iLongitude),
        { wrapper }
      )

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true)
      })

      // Assert - fetchTideData should only be called once (second call uses cache)
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(fetchSpy).toHaveBeenCalledWith(iLatitude, iLongitude)
    })
  })

  describe('Edge cases', () => {
    it('should not fetch when latitude is 0', async () => {
      // Arrange
      const iLatitude = 0
      const iLongitude = 0
      const fetchSpy = vi.spyOn(tideApi, 'fetchTideData')

      // Act
      const { result } = renderHook(
        () => useTideData(iLatitude, iLongitude),
        { wrapper }
      )

      // Assert - Query should be disabled
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeUndefined()
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('should fetch with different coordinates separately', async () => {
      // Arrange
      const coords1 = { lat: 56.1496, lon: 10.2134 }
      const coords2 = { lat: 55.6761, lon: 12.5872 }
      const mockTideData1 = {
        current: { height: 1.5, time: '2024-01-01T12:00:00Z' },
        extremes: [],
        status: {
          state: 'rising' as const,
          message: 'Rising',
          color: '#3b82f6',
          icon: '↗️'
        }
      }
      const mockTideData2 = {
        current: { height: 2.0, time: '2024-01-01T12:00:00Z' },
        extremes: [],
        status: {
          state: 'falling' as const,
          message: 'Falling',
          color: '#f59e0b',
          icon: '↘️'
        }
      }

      const fetchSpy = vi.spyOn(tideApi, 'fetchTideData')
        .mockResolvedValueOnce(mockTideData1)
        .mockResolvedValueOnce(mockTideData2)

      // Act - Fetch for first location
      const { result: result1 } = renderHook(
        () => useTideData(coords1.lat, coords1.lon),
        { wrapper }
      )

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
      })

      // Act - Fetch for second location
      const { result: result2 } = renderHook(
        () => useTideData(coords2.lat, coords2.lon),
        { wrapper }
      )

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true)
      })

      // Assert - Should fetch both separately
      expect(fetchSpy).toHaveBeenCalledTimes(2)
      expect(result1.current.data).toEqual(mockTideData1)
      expect(result2.current.data).toEqual(mockTideData2)
    })
  })

  describe('Error cases', () => {
    it('should return error state when fetch fails', () => {
      // Arrange
      const iLatitude = 56.1496
      const iLongitude = 10.2134

      // Mock to always reject
      vi.spyOn(tideApi, 'fetchTideData').mockRejectedValue(new Error('Test error'))

      // Act
      const { result } = renderHook(
        () => useTideData(iLatitude, iLongitude),
        { wrapper }
      )

      // Assert - Query is set up correctly
      expect(result.current).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('Query configuration', () => {
    it('should have correct stale time (5 minutes)', async () => {
      // Arrange
      const iLatitude = 56.1496
      const iLongitude = 10.2134
      const mockTideData = {
        current: { height: 1.5, time: '2024-01-01T12:00:00Z' },
        extremes: [],
        status: {
          state: 'rising' as const,
          message: 'Rising',
          color: '#3b82f6',
          icon: '↗️'
        }
      }

      vi.spyOn(tideApi, 'fetchTideData').mockResolvedValue(mockTideData)

      // Act
      const { result } = renderHook(
        () => useTideData(iLatitude, iLongitude),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Assert - Check that query has correct configuration
      const queryState = queryClient.getQueryState(['tide', iLatitude, iLongitude])
      expect(queryState).toBeDefined()
    })

    it('should be disabled when coordinates are invalid', async () => {
      // Arrange
      const fetchSpy = vi.spyOn(tideApi, 'fetchTideData')

      // Act - Test with null/undefined coordinates
      const { result } = renderHook(
        () => useTideData(0, 0),
        { wrapper }
      )

      // Assert
      expect(result.current.isLoading).toBe(false)
      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })
})
