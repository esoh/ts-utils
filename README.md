# @esoh/ts-utils

A collection of TypeScript utility functions with strict type safety.

## Installation

```bash
yarn add @esoh/ts-utils
```

## Usage

This package provides type-safe assertion functions that help with runtime type checking while maintaining strict TypeScript type safety.

### Basic Assertion

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

### Undefined Check

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

### Null Check

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

### Nullish Check (null or undefined)

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

### Asserted Value

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

### Exhaustive Type Checking

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

### Type Assertion

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

## Features

- Strict type checking
- Runtime type assertions
- TypeScript type narrowing
- Custom error messages or Error objects
- Zero dependencies

## License

MIT 