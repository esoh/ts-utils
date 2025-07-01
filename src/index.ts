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