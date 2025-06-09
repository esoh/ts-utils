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

#### Enum Array Value Check

```typescript
import { assertOneOf } from '@esoh/ts-utils';

// Define an enum array
const Status = ['active', 'inactive', 'pending'] as const;
type Status = typeof Status[number];

function processStatus(status: string) {
  // Using string message
  assertOneOf(status, Status, 'Invalid status value');
  // TypeScript now knows status is of type Status
  // ... rest of your code

  // Using Error object
  assertOneOf(status, Status, new Error('Invalid status value'));
  // TypeScript now knows status is of type Status
  // ... rest of your code
}

// Works with number enums too
const Numbers = [1, 2, 3, 4, 5] as const;
type NumberEnum = typeof Numbers[number];

function processNumber(num: number) {
  assertOneOf(num, Numbers, 'Number must be between 1 and 5');
  // TypeScript now knows num is of type NumberEnum
  // ... rest of your code
}

// You can also use assertedOneOf to get the value back
function processStatusWithReturn(status: string) {
  // Using string message
  const validStatus = assertedOneOf(status, Status, 'Invalid status value');
  // TypeScript knows validStatus is of type Status
  return validStatus;

  // Using Error object
  const anotherStatus = assertedOneOf(status, Status, new Error('Invalid status value'));
  // TypeScript knows anotherStatus is of type Status
  return anotherStatus;
}
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

// With literal object and literal key
const obj1 = { a: 1, b: 2 } as const;
const value1 = objectGet(obj1, 'a'); // type is 1

// With literal object and wide key
const obj2 = { a: 1, b: 2 } as const;
const value2 = objectGet(obj2, 'a' as string); // type is 1 | 2 | undefined

// With wide object
const obj3: Record<string, number> = { a: 1, b: 2 };
const value3 = objectGet(obj3, 'a'); // type is number | undefined

// ⚠️ Note: When using an object with literal keys (like obj1 and obj2 above),
// the function assumes the object will only contain those exact keys and no others.
// If you need to handle objects that might have additional properties,
// use a wide type like Record<string, number> instead.
```

#### Type Equality Assertion

The `tsAssertIsEqual` function is a compile-time type assertion that verifies two types are exactly the same. It's useful for ensuring type safety in your codebase and catching type mismatches early in development.

```typescript
import { tsAssertIsEqual } from '@esoh/ts-utils';

// Basic type equality check
const a = { a: 1, b: 2 };
const b = { a: 1, b: 2 };
tsAssertIsEqual<typeof a, typeof b>(); // OK

// TypeScript will error if types don't match
const c = { a: 1, b: 2, c: 3 };
tsAssertIsEqual<typeof a, typeof c>(); // Error: c has extra property c

// Works with literal types
const obj = { a: 1, b: 2 } as const;
const value = obj.a;
tsAssertIsEqual<typeof value, 1>(); // OK

// Works with union types
const maybeValue: number | undefined = undefined;
tsAssertIsEqual<typeof maybeValue, number | undefined>(); // OK

// Works with function return types
function getValue(): number {
  return 42;
}
tsAssertIsEqual<ReturnType<typeof getValue>, number>(); // OK

// Works with complex types
type ComplexType = {
  a: number;
  b: string;
  c: boolean;
};
const complex: ComplexType = { a: 1, b: '2', c: true };
tsAssertIsEqual<typeof complex, ComplexType>(); // OK

// Catches type mismatches
const wrong: { a: string } = { a: '1' };
tsAssertIsEqual<typeof wrong, ComplexType>(); // Error: types don't match
```

This function is particularly useful for:
- Ensuring API contracts are maintained
- Verifying type transformations
- Testing type utilities
- Catching type mismatches in refactoring
- Documenting expected types in code

Note that this is a compile-time check with no runtime overhead, as the function has no runtime behavior.

#### Exhaustive Keys Assertion

The `tsAssertExhaustiveKeys` function is a type-level assertion that ensures an array of keys exactly matches all the keys of an object type. It's particularly useful when you need to maintain a list of keys and want TypeScript to enforce that any changes to the object's keys must be reflected in the array.

```typescript
import { tsAssertExhaustiveKeys } from '@esoh/ts-utils';

// Example with a configuration object
const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

// Define the keys
const keys = ['port', 'host', 'debug'] as const;

// This will pass type checking because all keys are present
tsAssertExhaustiveKeys<typeof config, typeof keys>();

// If you add a new key to config but forget to update keys, TypeScript will error
const newConfig = {
  port: 3000,
  host: 'localhost',
  debug: true,
  timeout: 5000
} as const;

// This will fail type checking because 'timeout' is missing from keys
tsAssertExhaustiveKeys<typeof newConfig, typeof keys>();

// Works with literal types
const literalConfig = {
  a: 1,
  b: 2,
  c: 3
} as const;

const literalKeys = ['a', 'b', 'c'] as const;
tsAssertExhaustiveKeys<typeof literalConfig, typeof literalKeys>(); // OK
```

This function is particularly useful for:
- Maintaining lists of object keys
- Ensuring configuration objects and their key lists stay in sync
- Catching missing or extra keys during refactoring
- Documenting expected keys in code

Note that this is a compile-time check with no runtime overhead, as the function has no runtime behavior.

## Features

- Strict type checking
- Runtime type assertions
- TypeScript type narrowing
- Custom error messages or Error objects
- Utility types
- Zero dependencies

## License

MIT