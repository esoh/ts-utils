# @esoh/ts-utils

A collection of TypeScript utility functions and types with strict type safety.

## Installation

```bash
yarn add @esoh/ts-utils
```

## Usage

This package provides type-safe assertion functions and utility types that help with TypeScript development.

### Utility Types

#### ValueOf

Extracts the type of values from an object type.

```typescript
import { ValueOf } from '@esoh/ts-utils';

// With string literal types
type Colors = { red: 'red'; blue: 'blue'; green: 'green' };
type Color = ValueOf<Colors>; // 'red' | 'blue' | 'green'

// With mixed value types
type Config = {
  port: number;
  host: string;
  debug: boolean;
};
type ConfigValue = ValueOf<Config>; // number | string | boolean

// With nested objects
type Nested = {
  a: { x: number };
  b: { y: string };
};
type NestedValue = ValueOf<Nested>; // { x: number } | { y: string }
```

### Assertion Functions

#### Basic Assertion

```typescript
import { assert } from '@esoh/ts-utils';

function processUser(user: unknown) {
  // Using string message
  assert(user && typeof user === 'object', 'User must be an object');
  
  // Using Error object
  assert(user && typeof user === 'object', new Error('Invalid user object'));
  
  // TypeScript now knows user is an object
  const name = (user as { name?: string }).name;
  // ...
}
```

#### Undefined Check

```typescript
import { assertDefined } from '@esoh/ts-utils';

function processName(name: string | undefined) {
  // Using string message
  assertDefined(name, 'Name is required');
  
  // Using Error object
  assertDefined(name, new Error('Name cannot be undefined'));
  
  // TypeScript now knows name is a string
  console.log(name.toUpperCase());
}
```

#### Null Check

```typescript
import { assertNotNull } from '@esoh/ts-utils';

function processValue(value: string | null) {
  // Using string message
  assertNotNull(value, 'Value cannot be null');
  
  // Using Error object
  assertNotNull(value, new Error('Value must not be null'));
  
  // TypeScript now knows value is a string
  console.log(value.length);
}
```

#### Nullish Check (null or undefined)

```typescript
import { assertNotNullish } from '@esoh/ts-utils';

function processValue(value: string | null | undefined) {
  // Using string message
  assertNotNullish(value, 'Value must be defined and not null');
  
  // Using Error object
  assertNotNullish(value, new Error('Value must be defined and not null'));
  
  // TypeScript now knows value is a string
  console.log(value.length);
}
```

#### Asserted Value

```typescript
import { asserted } from '@esoh/ts-utils';

function processValue(value: string | null | undefined) {
  // Using string message
  const safeValue = asserted(value, 'Value must be defined and not null');
  // TypeScript knows safeValue is a string
  console.log(safeValue.length);

  // Using Error object
  const anotherValue = asserted(value, new Error('Value must be defined and not null'));
  // TypeScript knows anotherValue is a string
  console.log(anotherValue.length);

  // Can be used in expressions
  const length = asserted(value, 'Value required').length;
}
```

#### Key Assertion

```typescript
import { assertedKeyOf } from '@esoh/ts-utils';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

function getConfigValue(key: string) {
  // Using string message
  const validKey = assertedKeyOf(config, key, 'Invalid config key');
  // TypeScript knows validKey is 'port' | 'host' | 'debug'
  return config[validKey];

  // Using Error object
  const anotherKey = assertedKeyOf(config, key, new Error('Invalid config key'));
  // TypeScript knows anotherKey is 'port' | 'host' | 'debug'
  return config[anotherKey];
}

// Type-safe object access
const port = config[assertedKeyOf(config, 'port')]; // TypeScript knows this is 3000
const host = config[assertedKeyOf(config, 'host')]; // TypeScript knows this is 'localhost'
```

#### Property Assertion

```typescript
import { assertedProperty } from '@esoh/ts-utils';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

function getConfigValue(key: string) {
  // Using string message
  const value = assertedProperty(config, key, 'Invalid config key');
  // TypeScript knows value is 3000 | 'localhost' | true
  return value;

  // Using Error object
  const anotherValue = assertedProperty(config, key, new Error('Invalid config key'));
  // TypeScript knows anotherValue is 3000 | 'localhost' | true
  return anotherValue;
}

// Type-safe object access with property assertion
const port = assertedProperty(config, 'port'); // TypeScript knows this is 3000
const host = assertedProperty(config, 'host'); // TypeScript knows this is 'localhost'
const debug = assertedProperty(config, 'debug'); // TypeScript knows this is true
```

#### Exhaustive Type Checking

```typescript
import { assertNever } from '@esoh/ts-utils';

type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed!';
    default:
      // TypeScript will error if we forget to handle a case
      return assertNever(status, 'Unhandled status');
  }
}

// With discriminated unions
type Result = 
  | { type: 'success'; data: string }
  | { type: 'error'; message: string };

function handleResult(result: Result) {
  switch (result.type) {
    case 'success':
      return result.data;
    case 'error':
      return result.message;
    default:
      // TypeScript will error if we forget to handle a case
      return assertNever(result, 'Unhandled result type');
  }
}
```

#### Type Assertion

```typescript
import { assertType } from '@esoh/ts-utils';

function processValue(value: unknown) {
  // Using string message
  assertType<string>(value, 'string', 'Value must be a string');
  
  // Using Error object
  assertType<string>(value, 'string', new Error('Invalid value type'));
  
  // TypeScript now knows value is a string
  console.log(value.length);
}
```

#### Type-Safe Object Keys

```typescript
import { objectKeys } from '@esoh/ts-utils';

// With literal types and exact object shape
const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

const configKeys = objectKeys(config); // type is ('port' | 'host' | 'debug')[]

// With regular object and exact shape
const user = {
  name: 'John',
  age: 30
};

const userKeys = objectKeys(user); // type is ('name' | 'age')[]

// Type-safe iteration
for (const key of objectKeys(config)) {
  // TypeScript knows key is 'port' | 'host' | 'debug'
  const value = config[key]; // TypeScript knows the exact type of each value
}

// ⚠️ Note: This function assumes the object has exactly the keys specified in its type.
// If the object might have additional properties not specified in its type,
// use Object.keys() directly:
const dynamicObj = { a: 1, b: 2, c: 3 };
const extraProps = { ...dynamicObj, d: 4, e: 5 };
const allKeys = Object.keys(extraProps); // type is string[]
```

#### Type-Safe Object Property Access

```typescript
import { objectGet } from '@esoh/ts-utils';

// With literal types and exact object shape
const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

// When key is definitely in the object
const port = objectGet(config, 'port'); // type is 3000
const host = objectGet(config, 'host'); // type is 'localhost'

// When key might not be in the object
const maybeValue = objectGet(config, 'unknown' as string); // type is undefined

// With regular object
const user = {
  name: 'John',
  age: 30
};

const name = objectGet(user, 'name'); // type is string
const age = objectGet(user, 'age'); // type is number
const unknown = objectGet(user, 'unknown' as string); // type is undefined

// Type-safe access in functions
function getConfigValue<T extends keyof typeof config>(key: T) {
  return objectGet(config, key); // type is (typeof config)[T]
}
```

## Features

- Strict type checking
- Runtime type assertions
- TypeScript type narrowing
- Custom error messages or Error objects
- Utility types
- Zero dependencies

## License

MIT