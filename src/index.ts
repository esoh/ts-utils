import { IfEquals } from "./types";

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
 * Type-level assertion that ensures an object type is empty (has no properties).
 * This is useful for compile-time checks to ensure all properties have been handled.
 * 
 * ⚠️ **Important**: The empty object type `{}` is a union of all object types in TypeScript.
 * This function should be used carefully if not using for destructuring completeness checks.
 * For destructuring, it works perfectly to ensure all properties are handled.
 * 
 * @example
 * ```typescript
 * // Destructuring completeness check - ensures all properties are explicitly handled
 * const { id, name, email, ..._rest } = userResponse;
 * tsAssertEmptyObj<typeof _rest>(); // OK if _rest is empty, error if userResponse has unhandled properties
 * 
 * // API response validation - catch upstream changes
 * const { status, data, ..._rest } = apiResponse;
 * tsAssertEmptyObj<typeof _rest>(); // Fails if API adds new properties
 * 
 * // Configuration object validation
 * const { port, host, debug, ..._rest } = config;
 * tsAssertEmptyObj<typeof _rest>(); // Ensures all config options are handled
 * 
 * // Event payload validation
 * const { type, payload, timestamp, ..._rest } = event;
 * tsAssertEmptyObj<typeof _rest>(); // Ensures all event properties are processed
 * ```
 * 
 * @example
 * ```typescript
 * // ❌ This will error if upstream object has additional properties
 * const user = { id: 1, name: 'John', email: 'john@example.com', age: 30 };
 * const { id, name, ..._rest } = user;
 * tsAssertEmptyObj<typeof _rest>(); // Error: _rest has properties 'email' | 'age'
 * 
 * // ✅ This works when all properties are handled
 * const user = { id: 1, name: 'John' };
 * const { id, name, ..._rest } = user;
 * tsAssertEmptyObj<typeof _rest>(); // OK: _rest is empty
 * ```
 * 
 * @template T - The object type to check
 */
export function tsAssertEmptyObj<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: IfEquals<T, {}, [], never>
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

// Re-export assertions
export * from './assertions';