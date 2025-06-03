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
 * Type-safe version of Object.keys that preserves literal types
 * @param obj - The object to get keys from
 * @returns An array of the object's keys with their literal types preserved
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2 } as const;
 * const keys = objectKeys(obj); // type is ('a' | 'b')[]
 * ```
 * @note This function assumes the object has exactly the keys specified in its type.
 * If the object might have additional properties not specified in its type,
 * use Object.keys() directly.
 */
export function objectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Type utility that checks if all keys in an object type are literal types.
 * Returns "T" if all keys are literal types, "F" otherwise.
 * 
 * @example
 * ```typescript
 * type A = AreKeysLiteral<{ a: 1, b: 2 }>; // "T"
 * type B = AreKeysLiteral<Record<string, number>>; // "F"
 * type C = AreKeysLiteral<{ [key: string]: number }>; // "F"
 * ```
 */
type AreKeysLiteral<T> = keyof T extends string | number | symbol
  ? string extends keyof T
    ? "F"
    : number extends keyof T
      ? "F"
      : symbol extends keyof T
        ? "F"
        : "T"
  : "F";

/**
 * Type-safe version of object property access that preserves literal types and handles both literal and wide key types.
 * 
 * When the object has literal keys and the key is a literal type:
 * - Returns the exact value type if the key exists
 * - Returns undefined if the key doesn't exist
 * 
 * When the object has wide keys or the key is a wide type:
 * - Returns the union of all possible value types or undefined
 * 
 * @param obj - The object to get the property from
 * @param key - The key to access
 * @returns The value at the key if it exists, undefined otherwise
 * @example
 * ```typescript
 * // With literal object and literal key
 * const obj1 = { a: 1, b: 2 } as const;
 * const value1 = objectGet(obj1, 'a'); // type is 1
 * 
 * // With literal object and wide key
 * const obj2 = { a: 1, b: 2 } as const;
 * const value2 = objectGet(obj2, 'a' as string); // type is 1 | 2 | undefined
 * 
 * // With wide object
 * const obj3: Record<string, number> = { a: 1, b: 2 };
 * const value3 = objectGet(obj3, 'a'); // type is number | undefined
 * ```
 */
export function objectGet<T extends object, K extends string | number | symbol>(
  obj: T,
  key: K
) {
  return (key in obj ? obj[key as unknown as keyof T] : undefined) as unknown as 
    "T" extends AreKeysLiteral<T> 
      ? (K extends keyof T ? T[K] : (keyof T extends K ? T[keyof T] | undefined : undefined))
      : (K extends keyof T ? T[K] | undefined : undefined);
}

/**
 * If A and B are the same type, return TrueValueT, otherwise return FalseValueT.
 */
type IfEquals<A, B, TrueValueT, FalseValueT> = (<
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

// Re-export type utilities
export * from './types'; 