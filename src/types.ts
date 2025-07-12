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

/**
 * Utility type that omits properties from an object type where the value extends a given type
 * @example
 * ```typescript
 * type Config = {
 *   name: string;
 *   age: number;
 *   isActive: boolean;
 *   createdAt: Date;
 *   updatedAt: Date;
 * };
 * 
 * // Remove all Date properties
 * type WithoutDates = OmitPropertiesWhereValueExtendsType<Config, Date>;
 * // { name: string; age: number; isActive: boolean }
 * 
 * // Remove all string properties
 * type WithoutStrings = OmitPropertiesWhereValueExtendsType<Config, string>;
 * // { age: number; isActive: boolean; createdAt: Date; updatedAt: Date }
 * 
 * // Remove all boolean properties
 * type WithoutBooleans = OmitPropertiesWhereValueExtendsType<Config, boolean>;
 * // { name: string; age: number; createdAt: Date; updatedAt: Date }
 * ```
 */
export type OmitPropertiesWhereValueExtendsType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Creates a type with only the properties from T where the value type extends U.
 * This is the complement of OmitPropertiesWhereValueExtendsType.
 * 
 * @example
 * ```ts
 * type TestObject = {
 *   a: string;
 *   b: number;
 *   c: string | number;
 *   d: string | number | boolean;
 * };
 * 
 * type Result = PickPropertiesWhereValueExtendsType<TestObject, string | number>;
 * // Result is equivalent to:
 * // {
 * //   a: string;      // picked because string extends string | number
 * //   b: number;      // picked because number extends string | number
 * //   c: string | number;  // picked because string | number extends string | number
 * //   d: string | number | boolean;  // omitted because it does not extend string | number
 * // }
 * ```
 */
export type PickPropertiesWhereValueExtendsType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Utility type that makes specified keys required in an object type
 * @example
 * ```typescript
 * type User = {
 *   name: string;
 *   email?: string;
 *   age?: number;
 * };
 * 
 * // Make email and age required
 * type UserWithRequiredFields = RequiredKeys<User, 'email' | 'age'>;
 * // { name: string; email: string; age: number; }
 * 
 * // Make only email required
 * type UserWithRequiredEmail = RequiredKeys<User, 'email'>;
 * // { name: string; email: string; age?: number; }
 * ```
 */
export type RequiredKeys<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

/**
 * An empty object is the union of all possible objects.
 * Make sure to use this intentionally and with caution.
 */
export type EmptyObjectUNSAFE = {};