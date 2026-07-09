import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from './calculator.js';

describe('Calculator Functions', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    it('should subtract negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(4, 3)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(multiply(-4, -3)).toBe(12);
    });

    it('should multiply positive and negative numbers', () => {
      expect(multiply(4, -3)).toBe(-12);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(divide(12, 4)).toBe(3);
    });

    it('should handle decimal results', () => {
      expect(divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    it('should divide negative numbers', () => {
      expect(divide(-12, -4)).toBe(3);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero is not allowed');
    });
  });
});
