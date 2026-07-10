# Contributing to Oceanmapping

Thank you for your interest in contributing to Oceanmapping! This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Testing Requirements](#testing-requirements)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Development Workflow](#development-workflow)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Testing Requirements

### 🚨 MANDATORY: All Code Must Have Tests

**Every new feature, function, or module MUST include corresponding unit tests.**

#### Test Structure

- **Location**: Tests must be colocated with source files
- **Naming**: Use `.test.js` suffix (e.g., `calculator.test.js`)
- **Framework**: Vitest
- **Coverage**: Minimum 80% for new code

#### Example Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { yourFunction } from './yourModule.js';

describe('YourModule', () => {
  describe('yourFunction', () => {
    it('should handle normal input correctly', () => {
      const result = yourFunction('input');
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      expect(yourFunction('')).toBe('default');
      expect(yourFunction(null)).toBe('default');
    });

    it('should throw on invalid input', () => {
      expect(() => yourFunction(-1)).toThrow();
    });
  });
});
```

#### Required Test Coverage

For each function/module, include tests for:

1. ✅ **Happy Path** - Normal, expected usage
2. ✅ **Edge Cases** - Boundary values, empty inputs, special values
3. ✅ **Error Cases** - Invalid inputs, exceptions, error handling
4. ✅ **Type Variations** - Different data types (if applicable)

#### Running Tests

```bash
# Development (watch mode)
npm test

# Single run (CI)
npm test -- --run

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

## Code Standards

### General Guidelines

1. **Meaningful Names**
   - Use descriptive variable and function names
   - Follow camelCase for JavaScript
   - Avoid abbreviations unless widely understood

2. **Function Length**
   - Keep functions focused and concise
   - Prefer multiple small functions over one large function
   - Maximum ~50 lines per function

3. **Documentation**
   - Add JSDoc comments for public functions
   - Include parameter types and return types
   - Document complex logic with inline comments

4. **Error Handling**
   - Handle errors appropriately
   - Throw meaningful error messages
   - Validate input parameters

### Code Style

```javascript
/**
 * Calculates the distance between two coordinates
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 * @throws {Error} If coordinates are invalid
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!validateCoordinates(lat1, lon1) || !validateCoordinates(lat2, lon2)) {
    throw new Error('Invalid coordinates');
  }
  
  // Implementation
  return distance;
}
```

### File Structure

```
src/
├── ocean/           # Ocean-specific utilities
│   ├── module.js
│   └── module.test.js
├── utils/           # General utilities
│   ├── helper.js
│   └── helper.test.js
└── components/      # UI components (if applicable)
    ├── Component.js
    └── Component.test.js
```

## Pull Request Process

### Before Submitting

1. **Run Tests**
   ```bash
   npm test -- --run
   ```
   All tests must pass ✅

2. **Check Coverage**
   ```bash
   npm run test:coverage
   ```
   Ensure minimum 80% coverage for new code

3. **Verify Changes**
   - Review your code changes
   - Remove console.logs and debug code
   - Check for proper error handling

4. **Update Documentation**
   - Update README if adding new features
   - Add JSDoc comments to new functions
   - Update examples if necessary

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All new code has corresponding unit tests
- [ ] All tests pass locally
- [ ] Code coverage meets minimum requirements (80%)
- [ ] No console.logs or debug code
- [ ] Documentation updated (if applicable)
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] All tests passing
- [ ] Coverage: X%

## Related Issues
Closes #issue_number
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/descriptive-name
```

### 2. Develop with TDD (Test-Driven Development)

**Recommended workflow:**

1. Write test cases first
2. Run tests (they should fail)
3. Implement the feature
4. Run tests until they pass
5. Refactor if needed
6. Run tests again

```bash
# Keep tests running in watch mode
npm test
```

### 3. Commit Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add tide calculation function"
git commit -m "fix: correct coordinate validation for edge cases"
git commit -m "test: add comprehensive tests for tide tracker"
```

Commit message prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### 4. Push and Create PR

```bash
git push origin feature/descriptive-name
```

Then create a Pull Request on GitHub.

## Testing Examples

### Basic Function Test

```javascript
describe('calculateTideHeight', () => {
  it('should return correct height for high tide', () => {
    const height = calculateTideHeight(new Date('2026-01-01T12:00:00Z'));
    expect(height).toBeGreaterThan(0);
  });
});
```

### Async Function Test

```javascript
describe('fetchWeatherData', () => {
  it('should fetch data successfully', async () => {
    const data = await fetchWeatherData(40.7128, -74.006);
    expect(data).toBeDefined();
    expect(data.temperature).toBeTypeOf('number');
  });
});
```

### Error Handling Test

```javascript
describe('validateCoordinates', () => {
  it('should throw error for invalid latitude', () => {
    expect(() => validateCoordinates(91, 0)).toThrow('Invalid latitude');
  });
});
```

## Questions?

If you have questions about contributing, please:
1. Check existing issues and discussions
2. Review this contributing guide
3. Open an issue for clarification

## Thank You!

Your contributions help make Oceanmapping better for everyone. We appreciate your time and effort! 🌊
