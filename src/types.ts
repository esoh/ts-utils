/**
 * Utility type that extracts the type of values from an object type
 * @example
 * ```typescript
 * type Colors = { red: 'red'; blue: 'blue'; green: 'green' };
 * type Color = ValueOf<Colors>; // 'red' | 'blue' | 'green'
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Utility type that expands an object type to show all its properties
 * @example
 * ```typescript
 * type User = { name: string; age: number };
 * type ExpandedUser = Expand<User>; // { name: string; age: number }
 * 
 * // With intersections
 * type Complex = { a: string } & { b: number };
 * type Simple = Expand<Complex>; // { a: string; b: number }
 * ```
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

/**
 * Utility type that recursively expands an object type to show all its properties
 * @example
 * ```typescript
 * type User = { name: string; age: number };
 * type RecursiveUser = ExpandRecursively<User>; // { name: string; age: number }
 * 
 * // With nested objects and intersections
 * type Complex = {
 *   user: { name: string } & { age: number };
 *   settings: { theme: 'light' | 'dark' } & { language: string };
 * };
 * type Expanded = ExpandRecursively<Complex>;
 * // {
 * //   user: { name: string; age: number };
 * //   settings: { theme: 'light' | 'dark'; language: string };
 * // }
 * ```
 */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;