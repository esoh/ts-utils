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

#### Expand

Expands an object type to show all its properties in a more readable format. This is useful for both regular objects and intersection types.

```typescript
import { Expand } from '@esoh/ts-utils';

// With regular objects
type User = { name: string; age: number };
type ExpandedUser = Expand<User>; // { name: string; age: number }

// With intersection types
type Complex = { a: string } & { b: number };
type Simple = Expand<Complex>; // { a: string; b: number }
```

#### ExpandRecursively

Same as Expand but works recursively on nested objects and their intersection types.

```typescript
import { ExpandRecursively } from '@esoh/ts-utils';

// With regular objects
type User = { name: string; age: number };
type RecursiveUser = ExpandRecursively<User>; // { name: string; age: number }

// With nested objects and intersections
type ComplexType = {
  user: { name: string } & { age: number };
  settings: { theme: 'light' | 'dark' } & { language: string };
};

type Expanded = ExpandRecursively<ComplexType>;
// {
//   user: { name: string; age: number };
//   settings: { theme: 'light' | 'dark'; language: string };
// }
```

#### OmitPropertiesWhereValueExtendsType

Utility type that omits properties from an object type where the value extends a given type.

```typescript
import { OmitPropertiesWhereValueExtendsType } from '@esoh/ts-utils';

type Config = {
  name: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Remove all Date properties
type WithoutDates = OmitPropertiesWhereValueExtendsType<Config, Date>;
// { name: string; age: number; isActive: boolean }

// Remove all string properties
type WithoutStrings = OmitPropertiesWhereValueExtendsType<Config, string>;
// { age: number; isActive: boolean; createdAt: Date; updatedAt: Date }

// Remove all boolean properties
type WithoutBooleans = OmitPropertiesWhereValueExtendsType<Config, boolean>;
// { name: string; age: number; createdAt: Date; updatedAt: Date }

// Works with union types too
type MixedConfig = {
  name: string | null;
  age: number | undefined;
  isActive: boolean;
  createdAt: string | null;
};

// Remove properties that extend string | null
type WithoutStringOrNull = OmitPropertiesWhereValueExtendsType<MixedConfig, string | null>;
// { age: number | undefined; isActive: boolean }
```

#### RequiredKeys

Utility type that makes specified keys required in an object type.

```typescript
import { RequiredKeys } from '@esoh/ts-utils';

type User = {
  name: string;
  email?: string;
  age?: number;
};

// Make email and age required
type UserWithRequiredFields = RequiredKeys<User, 'email' | 'age'>;
// { name: string; email: string; age: number; }

// Make only email required
type UserWithRequiredEmail = RequiredKeys<User, 'email'>;
// { name: string; email: string; age?: number; }

// Works with any object type
type Config = {
  port?: number;
  host?: string;
  debug?: boolean;
};

// Make all fields required
type RequiredConfig = RequiredKeys<Config, 'port' | 'host' | 'debug'>;
// { port: number; host: string; debug: boolean; }
```

### Assertion Functions

#### Basic Assertion

```typescript
import { assert, assertCondition } from '@esoh/ts-utils';

function processUser(user: unknown) {
  // Using assert
  assert(user && typeof user === 'object', 'User must be an object');
  
  // Or using assertCondition (they are aliases)
  assertCondition(user && typeof user === 'object', 'User must be an object');
  
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
import { assertedExactObjKeyOf } from '@esoh/ts-utils';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

function getConfigValue(key: string) {
  // Using string message
  const validKey = assertedExactObjKeyOf(config, key, 'Invalid config key');
  // TypeScript knows validKey is 'port' | 'host' | 'debug'
  return config[validKey];

  // Using Error object
  const anotherKey = assertedExactObjKeyOf(config, key, new Error('Invalid config key'));
  // TypeScript knows anotherKey is 'port' | 'host' | 'debug'
  return config[anotherKey];
}

// Type-safe object access
const port = config[assertedExactObjKeyOf(config, 'port')]; // TypeScript knows this is 3000
const host = config[assertedExactObjKeyOf(config, 'host')]; // TypeScript knows this is 'localhost'

// ⚠️ IMPORTANT: assertedExactObjKeyOf should ONLY be used with exactly typed objects
// Here's an example of what NOT to do:

type MyObject = {apple: 'red'}
const myObject = {
    apple: 'red',
    blueberry: 'blue',
} as MyObject;

// Because myObject is not exactly typed, this won't work correctly.
// assertedExactObjKeyOf should only be used on exactly typed objects without any other properties.
const key = 'blueberry' as const;
const value = assertedExactObjKeyOf(myObject, key, 'Invalid config key');
// TypeScript will infer the type as 'never' because 'blueberry' is not in the original type
```

#### Property Assertion

```typescript
import { assertedExactObjProperty } from '@esoh/ts-utils';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

function getConfigValue(key: string) {
  // Using string message
  const value = assertedExactObjProperty(config, key, 'Invalid config key');
  // TypeScript knows value is 3000 | 'localhost' | true
  return value;

  // Using Error object
  const anotherValue = assertedExactObjProperty(config, key, new Error('Invalid config key'));
  // TypeScript knows anotherValue is 3000 | 'localhost' | true
  return anotherValue;
}

// Type-safe object access with property assertion
const port = assertedExactObjProperty(config, 'port'); // TypeScript knows this is 3000
const host = assertedExactObjProperty(config, 'host'); // TypeScript knows this is 'localhost'
const debug = assertedExactObjProperty(config, 'debug'); // TypeScript knows this is true

// ⚠️ IMPORTANT: assertedExactObjProperty should ONLY be used with exactly typed objects
// Here's an example of what NOT to do:

type MyObject = {apple: 'red'}
const myObject = {
    apple: 'red',
    blueberry: 'blue',
} as MyObject;

// Because myObject is not exactly typed, this won't work correctly.
// assertedExactObjProperty should only be used on exactly typed objects without any other properties.
const key = 'blueberry' as const;
const value = assertedExactObjProperty(myObject, key, 'Invalid config key');
// TypeScript will infer the type as 'never' because 'blueberry' is not in the original type
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
import { 
  assertString, assertNumber, assertBoolean, assertObject, assertArray, assertFunction, assertDate,
  assertedString, assertedNumber, assertedBoolean, assertedObject, assertedArray, assertedFunction, assertedDate
} from '@esoh/ts-utils';

function processData(data: unknown) {
  // Using assertion functions (void return)
  assertString(data.name, 'Name must be a string');
  assertNumber(data.age, 'Age must be a number');
  assertBoolean(data.isActive, 'isActive must be a boolean');
  assertObject(data.settings, 'Settings must be an object');
  assertArray(data.tags, 'Tags must be an array');
  assertFunction(data.handler, 'Handler must be a function');
  assertDate(data.createdAt, 'createdAt must be a Date');
  
  // TypeScript now knows the types are correct
  console.log(data.name.toUpperCase());     // ✅ TypeScript knows this is a string
  console.log(data.age.toFixed(2));         // ✅ TypeScript knows this is a number
  console.log(data.isActive ? 'Yes' : 'No'); // ✅ TypeScript knows this is a boolean
  console.log(Object.keys(data.settings));  // ✅ TypeScript knows this is an object
  console.log(data.tags.length);            // ✅ TypeScript knows this is an array
  data.handler();                           // ✅ TypeScript knows this is a function
  console.log(data.createdAt.toISOString()); // ✅ TypeScript knows this is a Date
}

function processDataWithReturn(data: unknown) {
  // Using asserted functions (return the value)
  const name = assertedString(data.name, 'Name must be a string');
  const age = assertedNumber(data.age, 'Age must be a number');
  const isActive = assertedBoolean(data.isActive, 'isActive must be a boolean');
  const settings = assertedObject(data.settings, 'Settings must be an object');
  const tags = assertedArray(data.tags, 'Tags must be an array');
  const handler = assertedFunction(data.handler, 'Handler must be a function');
  const createdAt = assertedDate(data.createdAt, 'createdAt must be a Date');
  
  // Can be used in expressions
  const upperName = assertedString(data.name, 'Name required').toUpperCase();
  const formattedAge = assertedNumber(data.age, 'Age required').toFixed(2);
  const tagCount = assertedArray(data.tags, 'Tags required').length;
  const isoDate = assertedDate(data.createdAt, 'Date required').toISOString();
  
  return { name, age, isActive, settings, tags, handler, createdAt };
}

// Works with unknown data from external sources
function validateApiResponse(response: unknown) {
  assertObject(response, 'Response must be an object');
  
  const data = response as { user?: unknown; config?: unknown };
  
  if (data.user) {
    const user = assertedObject(data.user, 'User must be an object');
    const userName = assertedString(user.name, 'User name must be a string');
    const userAge = assertedNumber(user.age, 'User age must be a number');
    const userCreatedAt = assertedDate(user.createdAt, 'User createdAt must be a Date');
    
    return { userName, userAge, userCreatedAt };
  }
  
  return null;
}
```

#### Type-Safe Object Keys

```typescript
import { exactObjKeys } from '@esoh/ts-utils';

// With literal types and exact object shape
const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

const configKeys = exactObjKeys(config); // type is ('port' | 'host' | 'debug')[]

// With regular object and exact shape
const user = {
  name: 'John',
  age: 30
};

const userKeys = exactObjKeys(user); // type is ('name' | 'age')[]

// Type-safe iteration
for (const key of exactObjKeys(config)) {
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
import { exactObjGet } from '@esoh/ts-utils';

// With literal object and literal key
const obj1 = { a: 1, b: 2 } as const;
const value1 = exactObjGet(obj1, 'a'); // type is 1

// With literal object and wide key
const obj2 = { a: 1, b: 2 } as const;
const value2 = exactObjGet(obj2, 'a' as string); // type is 1 | 2 | undefined

// With wide object
const obj3: Record<string, number> = { a: 1, b: 2 };
const value3 = exactObjGet(obj3, 'a'); // type is number | undefined

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

#### Empty Object Assertion

The `tsAssertEmptyObj` function is a type-level assertion that ensures an object type is empty (has no properties). This is particularly useful for **destructuring completeness checks** to ensure all properties from an upstream object have been explicitly handled.

```typescript
import { tsAssertEmptyObj } from '@esoh/ts-utils';

// Destructuring completeness check - ensures all properties are explicitly handled
const { id, name, email, ..._rest } = userResponse;
tsAssertEmptyObj<typeof _rest>(); // OK if _rest is empty, error if userResponse has unhandled properties

// API response validation - catch upstream changes
const { status, data, ..._rest } = apiResponse;
tsAssertEmptyObj<typeof _rest>(); // Fails if API adds new properties

// Configuration object validation
const { port, host, debug, ..._rest } = config;
tsAssertEmptyObj<typeof _rest>(); // Ensures all config options are handled

// Event payload validation
const { type, payload, timestamp, ..._rest } = event;
tsAssertEmptyObj<typeof _rest>(); // Ensures all event properties are processed
```

**Error Examples:**

```typescript
// ❌ This will error if upstream object has additional properties
const user = { id: 1, name: 'John', email: 'john@example.com', age: 30 };
const { id, name, ..._rest } = user;
tsAssertEmptyObj<typeof _rest>(); // Error: _rest has properties 'email' | 'age'

// ✅ This works when all properties are handled
const user = { id: 1, name: 'John' };
const { id, name, ..._rest } = user;
tsAssertEmptyObj<typeof _rest>(); // OK: _rest is empty
```

This function is particularly useful for:
- **Defensive programming** - Catching breaking changes in external APIs
- **Exhaustive destructuring** - Ensuring all properties are explicitly handled
- **API evolution** - Failing fast when upstream interfaces change
- **Documentation** - Showing intent to handle all properties
- **Type safety** - Preventing runtime errors from missed properties

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

#### Array Includes

Type-safe version of `Array.prototype.includes` that narrows down the type when checking if an array includes a value.

```typescript
import { arrayIncludes } from '@esoh/ts-utils';

// With const arrays
const colors = ['red', 'blue', 'green'] as const;
const color = 'red' as string;

if (arrayIncludes(colors, color)) {
  // Inside this block, TypeScript knows that color is one of: 'red' | 'blue' | 'green'
  console.log(color);
}

// With regular arrays
const numbers = [1, 2, 3] as const;
const num = 1 as number;

if (arrayIncludes(numbers, num)) {
  // Inside this block, TypeScript knows that num is a number
  console.log(num);
}

// With union types
type Status = 'pending' | 'active' | 'inactive';
const statuses: Status[] = ['pending', 'active'];
const status = 'pending';

if (arrayIncludes(statuses, status)) {
  // Inside this block, TypeScript knows that status is a Status
  console.log(status);
}
```

The function is particularly useful when you need to narrow down the type of a value based on its presence in an array. It's more type-safe than the built-in `Array.prototype.includes` because it properly narrows the type of the checked value.

#### JSON Types

Type-safe JSON value types that match the JSON specification (RFC 7159).

```typescript
import { JsonPrimitive, JsonValue, JsonObject, JsonArray } from '@esoh/ts-utils';

// JsonPrimitive covers the basic JSON types
const primitive: JsonPrimitive = null; // OK
const primitive2: JsonPrimitive = "hello"; // OK
const primitive3: JsonPrimitive = 42; // OK
const primitive4: JsonPrimitive = true; // OK

// JsonValue covers all valid JSON values
const value: JsonValue = { key: "value" }; // OK
const value2: JsonValue = [1, "hello", null]; // OK
const value3: JsonValue = "simple string"; // OK

// JsonObject for JSON objects
const obj: JsonObject = {
  string: "value",
  number: 42,
  boolean: true,
  null: null,
  array: [1, 2, 3],
  nested: { key: "value" }
}; // OK

// JsonArray for JSON arrays
const arr: JsonArray = [
  "string",
  42,
  true,
  null,
  { key: "value" },
  [1, 2, 3]
]; // OK

// TypeScript will error for non-JSON values
const invalid: JsonValue = undefined; // Error: undefined is not a valid JSON value
const invalid2: JsonValue = new Date(); // Error: Date is not a valid JSON value
const invalid3: JsonValue = () => {}; // Error: Function is not a valid JSON value
```

These types are useful for:
- API responses that must be JSON-serializable
- Configuration files that need to be stored as JSON
- Ensuring data structures can be safely serialized
- Type-safe JSON parsing and validation

## Features

- Strict type checking
- Runtime type assertions
- TypeScript type narrowing
- Custom error messages or Error objects
- Utility types
- Zero dependencies