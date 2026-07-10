import { describe, it, expect } from 'vitest'
import { danishDepthPoints, getVisibleDepthPoints, getDepthPointById } from './depthPoints'

describe('depthPoints', () => {
  describe('danishDepthPoints', () => {
    it('should have at least 80 depth points', () => {
      expect(danishDepthPoints.length).toBeGreaterThanOrEqual(80)
    })

    it('should have unique IDs', () => {
      const ids = danishDepthPoints.map(p => p.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(danishDepthPoints.length)
    })

    it('should have valid coordinates', () => {
      danishDepthPoints.forEach(point => {
        expect(point.latitude).toBeGreaterThanOrEqual(-90)
        expect(point.latitude).toBeLessThanOrEqual(90)
        expect(point.longitude).toBeGreaterThanOrEqual(-180)
        expect(point.longitude).toBeLessThanOrEqual(180)
      })
    })

    it('should have positive depth values', () => {
      danishDepthPoints.forEach(point => {
        expect(point.depth).toBeGreaterThan(0)
      })
    })

    it('should have location names', () => {
      danishDepthPoints.forEach(point => {
        expect(point.location).toBeTruthy()
        expect(point.location.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getVisibleDepthPoints', () => {
    it('should return all points with no minZoom at any zoom level', () => {
      const alwaysVisibleCount = danishDepthPoints.filter(p => !p.minZoom).length
      
      const visibleAt1 = getVisibleDepthPoints(1)
      const visibleAt5 = getVisibleDepthPoints(5)
      const visibleAt10 = getVisibleDepthPoints(10)
      
      expect(visibleAt1.filter(p => !p.minZoom).length).toBe(alwaysVisibleCount)
      expect(visibleAt5.filter(p => !p.minZoom).length).toBe(alwaysVisibleCount)
      expect(visibleAt10.filter(p => !p.minZoom).length).toBe(alwaysVisibleCount)
    })

    it('should show more points at higher zoom levels', () => {
      const visibleAt5 = getVisibleDepthPoints(5)
      const visibleAt8 = getVisibleDepthPoints(8)
      const visibleAt10 = getVisibleDepthPoints(10)
      
      expect(visibleAt10.length).toBeGreaterThanOrEqual(visibleAt8.length)
      expect(visibleAt8.length).toBeGreaterThanOrEqual(visibleAt5.length)
    })

    it('should respect minZoom threshold', () => {
      const visibleAt5 = getVisibleDepthPoints(5)
      
      visibleAt5.forEach(point => {
        if (point.minZoom) {
          expect(5).toBeGreaterThanOrEqual(point.minZoom)
        }
      })
    })

    it('should return array at zoom level 0', () => {
      const visible = getVisibleDepthPoints(0)
      expect(Array.isArray(visible)).toBe(true)
    })

    it('should return all points at very high zoom', () => {
      const visible = getVisibleDepthPoints(20)
      expect(visible.length).toBe(danishDepthPoints.length)
    })
  })

  describe('getDepthPointById', () => {
    it('should find existing point by ID', () => {
      const firstPoint = danishDepthPoints[0]
      const found = getDepthPointById(firstPoint.id)
      
      expect(found).toBeDefined()
      expect(found?.id).toBe(firstPoint.id)
    })

    it('should return undefined for non-existent ID', () => {
      const found = getDepthPointById('non-existent-id')
      expect(found).toBeUndefined()
    })

    it('should find all Bønnerup points', () => {
      const bonnerupPoint = getDepthPointById('dp-bonnerup-1')
      expect(bonnerupPoint).toBeDefined()
      expect(bonnerupPoint?.location).toContain('Bønnerup')
    })
  })
})
