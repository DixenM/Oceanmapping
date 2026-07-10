import { describe, it, expect } from 'vitest';
import {
  decimalToDMS,
  dmsToDecimal,
  calculateDistance,
  validateCoordinates,
} from './coordinates.js';

describe('Coordinate Utilities', () => {
  describe('decimalToDMS', () => {
    it('should convert positive latitude to DMS with N direction', () => {
      const result = decimalToDMS(40.7128, true);
      expect(result.degrees).toBe(40);
      expect(result.minutes).toBe(42);
      expect(result.seconds).toBeCloseTo(46.08, 1);
      expect(result.direction).toBe('N');
    });

    it('should convert negative latitude to DMS with S direction', () => {
      const result = decimalToDMS(-33.8688, true);
      expect(result.degrees).toBe(33);
      expect(result.minutes).toBe(52);
      expect(result.seconds).toBeCloseTo(7.68, 1);
      expect(result.direction).toBe('S');
    });

    it('should convert positive longitude to DMS with E direction', () => {
      const result = decimalToDMS(151.2093, false);
      expect(result.degrees).toBe(151);
      expect(result.minutes).toBe(12);
      expect(result.seconds).toBeCloseTo(33.48, 1);
      expect(result.direction).toBe('E');
    });

    it('should convert negative longitude to DMS with W direction', () => {
      const result = decimalToDMS(-74.006, false);
      expect(result.degrees).toBe(74);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBeCloseTo(21.6, 1);
      expect(result.direction).toBe('W');
    });
  });

  describe('dmsToDecimal', () => {
    it('should convert DMS to decimal degrees for North', () => {
      const result = dmsToDecimal(40, 42, 46.08, 'N');
      expect(result).toBeCloseTo(40.7128, 4);
    });

    it('should convert DMS to decimal degrees for South', () => {
      const result = dmsToDecimal(33, 52, 7.68, 'S');
      expect(result).toBeCloseTo(-33.8688, 4);
    });

    it('should convert DMS to decimal degrees for East', () => {
      const result = dmsToDecimal(151, 12, 33.48, 'E');
      expect(result).toBeCloseTo(151.2093, 4);
    });

    it('should convert DMS to decimal degrees for West', () => {
      const result = dmsToDecimal(74, 0, 21.6, 'W');
      expect(result).toBeCloseTo(-74.006, 4);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between New York and London', () => {
      const nyLat = 40.7128;
      const nyLon = -74.006;
      const londonLat = 51.5074;
      const londonLon = -0.1278;
      
      const distance = calculateDistance(nyLat, nyLon, londonLat, londonLon);
      expect(distance).toBeCloseTo(5570, 0);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.006, 40.7128, -74.006);
      expect(distance).toBe(0);
    });

    it('should calculate distance between Sydney and Tokyo', () => {
      const sydneyLat = -33.8688;
      const sydneyLon = 151.2093;
      const tokyoLat = 35.6762;
      const tokyoLon = 139.6503;
      
      const distance = calculateDistance(
        sydneyLat,
        sydneyLon,
        tokyoLat,
        tokyoLon
      );
      expect(distance).toBeCloseTo(7825.82, 1);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate correct coordinates', () => {
      expect(validateCoordinates(40.7128, -74.006)).toBe(true);
      expect(validateCoordinates(-33.8688, 151.2093)).toBe(true);
      expect(validateCoordinates(0, 0)).toBe(true);
    });

    it('should reject latitude out of range', () => {
      expect(validateCoordinates(91, 0)).toBe(false);
      expect(validateCoordinates(-91, 0)).toBe(false);
    });

    it('should reject longitude out of range', () => {
      expect(validateCoordinates(0, 181)).toBe(false);
      expect(validateCoordinates(0, -181)).toBe(false);
    });

    it('should reject both coordinates out of range', () => {
      expect(validateCoordinates(100, 200)).toBe(false);
    });

    it('should validate boundary values', () => {
      expect(validateCoordinates(90, 180)).toBe(true);
      expect(validateCoordinates(-90, -180)).toBe(true);
    });
  });
});
