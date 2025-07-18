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

// Re-export typescript assertions
export * from './ts-assertions';