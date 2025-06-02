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