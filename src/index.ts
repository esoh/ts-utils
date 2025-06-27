/**
 * Helper function to create an error from a message or Error object
 * @param messageOrError - The error message or Error object
 * @param defaultMessage - The default message to use if messageOrError is not provided
 * @returns An Error object
 */
function createError(messageOrError: string | Error | undefined, defaultMessage: string): Error {
  return messageOrError instanceof Error ? messageOrError : new Error(messageOrError ?? defaultMessage);
}

/**
 * Type-safe assertion function that throws an error if the condition is false
 * @param condition - The condition to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the condition is false
 */
export function assert(condition: unknown, messageOrError?: string | Error): asserts condition {
  if (!condition) {
    throw createError(messageOrError, 'Assertion failed');
  }
}

/**
 * Alias for assert that provides a more specific name to avoid conflicts
 * @param condition - The condition to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the condition is false
 */
export const assertCondition = assert;

/**
 * Type-safe assertion function that checks if a value is not undefined
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is undefined
 */
export function assertDefined<T>(value: T | undefined, messageOrError?: string | Error): asserts value is T {
  if (value === undefined) {
    throw createError(messageOrError, 'Value is undefined');
  }
}

/**
 * Type-safe assertion function that checks if a value is not null
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is null
 */
export function assertNotNull<T>(value: T | null, messageOrError?: string | Error): asserts value is T {
  if (value === null) {
    throw createError(messageOrError, 'Value is null');
  }
}

/**
 * Type-safe assertion function that checks if a value is neither null nor undefined
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is null or undefined
 */
export function assertNotNullish<T>(value: T | null | undefined, messageOrError?: string | Error): asserts value is T {
  if (value === null || value === undefined) {
    throw createError(messageOrError, 'Value is null or undefined');
  }
}

/**
 * Type-safe assertion function that checks if a value is a string
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not a string
 */
export function assertString(value: unknown, messageOrError?: string | Error): asserts value is string {
  if (typeof value !== 'string') {
    throw createError(messageOrError, `Expected string, got ${typeof value}`);
  }
}

/**
 * Type-safe assertion function that checks if a value is a number
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not a number
 */
export function assertNumber(value: unknown, messageOrError?: string | Error): asserts value is number {
  if (typeof value !== 'number') {
    throw createError(messageOrError, `Expected number, got ${typeof value}`);
  }
}

/**
 * Type-safe assertion function that checks if a value is a boolean
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not a boolean
 */
export function assertBoolean(value: unknown, messageOrError?: string | Error): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw createError(messageOrError, `Expected boolean, got ${typeof value}`);
  }
}

/**
 * Type-safe assertion function that checks if a value is an object (and not null)
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not an object
 */
export function assertObject(value: unknown, messageOrError?: string | Error): asserts value is object {
  if (typeof value !== 'object' || value === null) {
    throw createError(messageOrError, `Expected object, got ${typeof value}`);
  }
}

/**
 * Type-safe assertion function that checks if a value is an array
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not an array
 */
export function assertArray(value: unknown, messageOrError?: string | Error): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw createError(messageOrError, `Expected array, got ${typeof value}`);
  }
}

/**
 * Type-safe assertion function that checks if a value is a function
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not a function
 */
export function assertFunction(value: unknown, messageOrError?: string | Error): asserts value is Function {
  if (typeof value !== 'function') {
    throw createError(messageOrError, `Expected function, got ${typeof value}`);
  }
}

/**
 * Type-safe assertion function that returns the value after asserting it's a string
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's a string
 * @throws {Error} If the value is not a string
 */
export function assertedString(value: unknown, messageOrError?: string | Error): string {
  assertString(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that returns the value after asserting it's a number
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's a number
 * @throws {Error} If the value is not a number
 */
export function assertedNumber(value: unknown, messageOrError?: string | Error): number {
  assertNumber(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that returns the value after asserting it's a boolean
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's a boolean
 * @throws {Error} If the value is not a boolean
 */
export function assertedBoolean(value: unknown, messageOrError?: string | Error): boolean {
  assertBoolean(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that returns the value after asserting it's an object
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's an object
 * @throws {Error} If the value is not an object
 */
export function assertedObject(value: unknown, messageOrError?: string | Error): object {
  assertObject(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that returns the value after asserting it's an array
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's an array
 * @throws {Error} If the value is not an array
 */
export function assertedArray(value: unknown, messageOrError?: string | Error): unknown[] {
  assertArray(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that returns the value after asserting it's a function
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's a function
 * @throws {Error} If the value is not a function
 */
export function assertedFunction(value: unknown, messageOrError?: string | Error): Function {
  assertFunction(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that returns the value after asserting it's not nullish
 * @param value - The value to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's not nullish
 * @throws {Error} If the value is null or undefined
 */
export function asserted<T>(value: T | null | undefined, messageOrError?: string | Error): T {
  assertNotNullish(value, messageOrError);
  return value;
}

/**
 * Type-safe assertion function that ensures exhaustive type checking
 * @param value - The value that should never be reached
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If this function is called
 */
export function assertNever(value: never, messageOrError?: string | Error): never {
  throw createError(messageOrError, `Unhandled value: ${JSON.stringify(value)}`);
}

/**
 * Type-safe assertion function that checks if a value is a key of an object type
 * @param obj - The object to check against
 * @param key - The key to check
 * @param messageOrError - Optional error message or Error object
 * @returns The key if it exists in the object
 * @throws {Error} If the key is not a valid key of the object
 */
export function assertedKeyOf<T extends object>(
  obj: T,
  key: string | number | symbol,
  messageOrError?: string | Error
): keyof T {
  if (!(key in obj)) {
    throw createError(messageOrError, `Key "${String(key)}" is not a valid key of the object`);
  }
  return key as keyof T;
}

/**
 * Type-safe assertion function that checks if a key exists in an object and returns its value
 * @param obj - The object to check against
 * @param key - The key to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value at the key if it exists in the object
 * @throws {Error} If the key is not a valid key of the object
 */
export function assertedProperty<T extends object>(
  obj: T,
  key: string | number | symbol,
  messageOrError?: string | Error
): T[keyof T] {
  const validKey = assertedKeyOf(obj, key, messageOrError);
  return obj[validKey];
}

/**
 * If A and B are the same type, return TrueValueT, otherwise return FalseValueT.
 */
type IfEquals<A, B, TrueValueT = "T", FalseValueT = "F"> = (<
  G,
>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
  ? TrueValueT
  : FalseValueT;

/**
 * This function is used to enforce that two types are the same.
 *
 * @example
 * const a = {a: 1, b: 2};
 * const b = {a: 1, b: 2, c: 3};
 * tsAssertIsEqual<typeof a, typeof b>(); // Error: b has extra property c
 *
 * @example
 * const a = {a: 1, b: 2};
 * const b = {a: 1, b: 2};
 * tsAssertIsEqual<typeof a, typeof b>(); // GOOD
 */
export function tsAssertIsEqual<ExpectedT, ActualT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: IfEquals<ExpectedT, ActualT, [], never>
) {
  return;
}

/**
 * Type-level assertion that ensures an array of keys exactly matches all the keys of an object type.
 * This is a compile-time check that helps maintain consistency between object keys and their ordering.
 * 
 * @example
 * ```typescript
 * const config = {
 *   port: 3000,
 *   host: 'localhost',
 *   debug: true
 * } as const;
 * 
 * const orderedKeys = ['port', 'host', 'debug'] as const;
 * tsAssertExhaustiveKeys<typeof config, typeof orderedKeys>(); // OK
 * 
 * // If you add a new key to config but forget to update orderedKeys, TypeScript will error
 * const newConfig = {
 *   port: 3000,
 *   host: 'localhost',
 *   debug: true,
 *   timeout: 5000
 * } as const;
 * tsAssertExhaustiveKeys<typeof newConfig, typeof orderedKeys>(); // Error: 'timeout' is missing from orderedKeys
 * ```
 * 
 * @template T - The type of the object
 * @template K - The type of the keys array
 */
export function tsAssertExhaustiveKeys<T extends object, K extends readonly (keyof T)[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: IfEquals<keyof T, K[number], [], never>
) {
  return;
}

/**
 * Type-safe assertion function that checks if a value is one of the allowed values
 * @param value - The value to check
 * @param allowedValues - The array of allowed values
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not one of the allowed values
 */
export function assertOneOf<T, U extends ReadonlyArray<T>>(
  value: T,
  allowedValues: U,
  messageOrError?: string | Error
): asserts value is U[number] {
  if (!allowedValues.includes(value)) {
    throw createError(
      messageOrError,
      `Value "${String(value)}" is not one of the allowed values: [${allowedValues.map(String).join(', ')}]`
    );
  }
}

/**
 * Type-safe assertion function that returns the value after asserting it's one of the allowed values
 * @param value - The value to check
 * @param allowedValues - The array of allowed values
 * @param messageOrError - Optional error message or Error object
 * @returns The value if it's one of the allowed values
 * @throws {Error} If the value is not one of the allowed values
 */
export function assertedOneOf<T, U extends ReadonlyArray<T>>(
  value: T,
  allowedValues: U,
  messageOrError?: string | Error
): U[number] {
  assertOneOf(value, allowedValues, messageOrError);
  return value;
}

/**
 * Type-safe version of Array.prototype.includes that narrows down the type when checking if an array includes a value.
 * This is useful for type narrowing in TypeScript.
 * 
 * @example
 * ```typescript
 * const colors = ['red', 'blue', 'green'] as const;
 * const color = 'red' as string;
 * 
 * if (arrayIncludes(colors, color)) {
 *   // color is now narrowed to 'red' | 'blue' | 'green'
 *   console.log(color);
 * }
 * ```
 */
export function arrayIncludes<T, U extends T>(
  array: readonly U[],
  value: T
): value is U {
  return array.includes(value as U);
}

// Re-export type utilities
export * from './types';

// Re-export object utilities
export * from './object';