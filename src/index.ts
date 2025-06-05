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
 * Type-safe assertion function that checks if a value is of a specific type
 * @param value - The value to check
 * @param type - The type to check against
 * @param messageOrError - Optional error message or Error object
 * @throws {Error} If the value is not of the specified type
 */
export function assertType<T>(value: unknown, type: string, messageOrError?: string | Error): asserts value is T {
  const actualType = typeof value;
  if (actualType !== type) {
    throw createError(messageOrError, `Expected type ${type}, got ${actualType}`);
  }
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

// Re-export type utilities
export * from './types';

// Re-export object utilities
export * from './object';