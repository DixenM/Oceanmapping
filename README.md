# Oceanmapping

A modern ocean mapping application with comprehensive testing using Vitest.

> **🧪 Test-First Development**: This project enforces mandatory unit testing for all code. See [Contributing Guidelines](CONTRIBUTING.md) and [.cursorrules](.cursorrules) for details.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
npm install
```

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for unit testing - a blazing fast test runner built on Vite.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test -- --run

# Run tests with UI (interactive test viewer)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are colocated with their source files using the `.test.js` naming convention:

```
src/
├── utils/
│   ├── calculator.js
│   └── calculator.test.js
└── ocean/
    ├── coordinates.js
    └── coordinates.test.js
```

### Writing Tests

Example test structure:

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule.js';

describe('MyModule', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expectedValue);
  });
});
```

## 📁 Project Structure

```
oceanmapping/
├── src/
│   ├── ocean/          # Ocean mapping utilities
│   │   ├── coordinates.js
│   │   └── coordinates.test.js
│   └── utils/          # General utilities
│       ├── calculator.js
│       └── calculator.test.js
├── vitest.config.js    # Vitest configuration
├── package.json
└── README.md
```

## 🔧 Configuration

The Vitest configuration is in `vitest.config.js`:

- **Environment**: Node.js
- **Globals**: Enabled (no need to import describe, it, expect)
- **Coverage**: Configured with v8 provider
- **Reports**: Text, JSON, and HTML coverage reports

## 📚 Features

### Calculator Utilities
- Basic arithmetic operations (add, subtract, multiply, divide)
- Error handling for edge cases
- Comprehensive test coverage

### Coordinate Utilities
- Decimal to DMS (Degrees, Minutes, Seconds) conversion
- DMS to Decimal conversion
- Haversine formula for distance calculation
- Coordinate validation
- Perfect for ocean navigation and mapping

## 🎯 Testing Best Practices

1. **Test file naming**: Use `.test.js` suffix
2. **Test organization**: Group related tests with `describe` blocks
3. **Clear descriptions**: Use descriptive test names with `it('should ...')`
4. **Coverage**: Aim for high code coverage
5. **Edge cases**: Test boundary conditions and error states

## 📝 Available Scripts

- `npm test` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run test:coverage` - Generate coverage reports

## 🤝 Contributing

**⚠️ IMPORTANT: All new code MUST include unit tests!**

Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on:
- Testing requirements (mandatory unit tests for all code)
- Code standards and style guide
- Pull request process
- Development workflow

### Quick Contribution Guide

1. **Fork & Clone** the repository
2. **Install dependencies**: `npm install`
3. **Create feature branch**: `git checkout -b feature/your-feature`
4. **Write tests first** (Test-Driven Development)
5. **Implement your feature**
6. **Run tests**: `npm test -- --run` (must pass ✅)
7. **Check coverage**: `npm run test:coverage` (minimum 80%)
8. **Commit & Push** with clear messages
9. **Create Pull Request**

See [.cursorrules](.cursorrules) for AI-assisted development guidelines.

**Note**: Pull requests without tests will not be accepted.

## 📄 License

ISC
