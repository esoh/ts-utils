import { tsAssertExhaustiveKeys } from './index';

// Basic test with literal object and matching keys
const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

const orderedKeys = ['port', 'host', 'debug'] as const;
tsAssertExhaustiveKeys<typeof config, typeof orderedKeys>(); // OK

// Test with missing key in orderedKeys
const newConfig = {
  port: 3000,
  host: 'localhost',
  debug: true,
  timeout: 5000
} as const;

// @ts-expect-error - 'timeout' is missing from orderedKeys
tsAssertExhaustiveKeys<typeof newConfig, typeof orderedKeys>();

// Test with extra key in orderedKeys
const extraKeys = ['port', 'host', 'debug', 'extra'] as const;
// @ts-expect-error - 'extra' is not a key of config
tsAssertExhaustiveKeys<typeof config, typeof extraKeys>();

// Test with nested object
const nestedConfig = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  client: {
    timeout: 5000,
    retries: 3
  }
} as const;

const nestedKeys = ['server', 'client'] as const;
tsAssertExhaustiveKeys<typeof nestedConfig, typeof nestedKeys>(); // OK

// Test with empty object
const emptyObj = {} as const;
const emptyKeys = [] as const;
tsAssertExhaustiveKeys<typeof emptyObj, typeof emptyKeys>(); // OK

// Test with single key
const singleKeyObj = { a: 1 } as const;
const singleKey = ['a'] as const;
tsAssertExhaustiveKeys<typeof singleKeyObj, typeof singleKey>(); // OK

// Test with non-literal object
const nonLiteralObj = { a: 1, b: 2 };
const nonLiteralKeys = ['a', 'b'] as const;
tsAssertExhaustiveKeys<typeof nonLiteralObj, typeof nonLiteralKeys>(); // OK

// Test with Record type
const recordObj: Record<string, number> = { a: 1, b: 2 };
const recordKeys = ['a', 'b'] as const;
// @ts-expect-error - Record type is not supported as it has no literal keys
tsAssertExhaustiveKeys<typeof recordObj, typeof recordKeys>();

// Test with union type keys
const unionObj = { a: 1, b: 2 } as const;
const unionKeys = ['a', 'b'] as const;
tsAssertExhaustiveKeys<typeof unionObj, typeof unionKeys>(); // OK

// Test with readonly array
const readonlyKeys = ['a', 'b'] as readonly ['a', 'b'];
const readonlyObj = { a: 1, b: 2 } as const;
tsAssertExhaustiveKeys<typeof readonlyObj, typeof readonlyKeys>(); // OK 