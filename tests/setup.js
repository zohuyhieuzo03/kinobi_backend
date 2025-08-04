// Test setup configuration
process.env.NODE_ENV = 'test';

// Suppress console logs during testing
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    // Suppress log statements in tests
    log: jest.fn(),
    error: console.error,
    warn: console.warn,
    info: jest.fn(),
    debug: jest.fn(),
  };
}

// Set longer timeout for async operations
jest.setTimeout(10000);