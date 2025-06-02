/**
 * Utility type that extracts the type of values from an object type
 * @example
 * ```typescript
 * type Colors = { red: 'red'; blue: 'blue'; green: 'green' };
 * type Color = ValueOf<Colors>; // 'red' | 'blue' | 'green'
 * ```
 */
export type ValueOf<T> = T[keyof T]; 