import { ValueOf } from "./types";
import { createError } from "./utils";

/**
 * Type-safe version of Object.keys that preserves literal types
 * @param obj - The object to get keys from
 * @returns An array of the object's keys with their literal types preserved
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2 } as const;
 * const keys = exactObjKeys(obj); // type is ('a' | 'b')[]
 * ```
 * @note This function assumes the object has exactly the keys specified in its type.
 * If the object might have additional properties not specified in its type,
 * use Object.keys() directly.
 */
export function exactObjKeys<T extends object>(obj: T): Array<keyof T> {
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
 * const value1 = exactObjGet(obj1, 'a'); // type is 1
 * 
 * // With literal object and wide key
 * const obj2 = { a: 1, b: 2 } as const;
 * const value2 = exactObjGet(obj2, 'a' as string); // type is 1 | 2 | undefined
 * 
 * // With wide object
 * const obj3: Record<string, number> = { a: 1, b: 2 };
 * const value3 = exactObjGet(obj3, 'a'); // type is number | undefined
 * ```
 */
export function exactObjGet<T extends object, K extends string | number | symbol>(
  obj: T,
  key: K
) {
  return (key in obj ? obj[key as unknown as keyof T] : undefined) as unknown as 
    "T" extends AreKeysLiteral<T> 
      ? (K extends keyof T ? T[K] : (keyof T extends K ? (T[keyof T] | undefined) : undefined))
      : (K extends keyof T ? (T[K] | undefined) : undefined);
}

/**
 * Type-safe assertion function that checks if a value is a key of an object type
 * @param obj - The object to check against
 * @param key - The key to check
 * @param messageOrError - Optional error message or Error object
 * @returns The key if it exists in the object
 * @throws {Error} If the key is not a valid key of the object
 */
export function assertedExactObjKeyOf<T extends object, KeyT extends string | number | symbol>(
  obj: T,
  key: KeyT,
  messageOrError?: string | Error
): T extends unknown ? (KeyT & keyof T) : keyof T;
export function assertedExactObjKeyOf<T extends object, KeyT extends unknown>(
  obj: T,
  key: KeyT,
  messageOrError?: string | Error
): T extends unknown ? keyof T : keyof T;
export function assertedExactObjKeyOf<T extends object>(
  obj: T,
  key: unknown,
  messageOrError?: string | Error
): keyof T {
  if (typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'symbol') {
    throw createError(messageOrError, `Key "${String(key)}" is not a valid key of the object`);
  }
  if (!(key in obj)) {
    throw createError(messageOrError, `Key "${String(key)}" is not a valid key of the object`);
  }
  return key as keyof T;
}

// need to distribute unions - hence the T extends unknown
type MatchingValues<T extends object, KeyT extends (string | number | symbol) | unknown> = unknown extends KeyT ? T[keyof T] : (T extends unknown
  ? ValueOf<{
      [K in keyof T as K extends KeyT ? K : never]: T[K];
    }>
  : never);

/**
 * Type-safe assertion function that checks if a key exists in an object and returns its value
 * @param obj - The object to check against
 * @param key - The key to check
 * @param messageOrError - Optional error message or Error object
 * @returns The value at the key if it exists in the object
 * @throws {Error} If the key is not a valid key of the object
 */
export function assertedExactObjProperty<T extends object, KeyT extends string | number | symbol>(
  obj: T,
  key: KeyT,
  messageOrError?: string | Error
): KeyT extends unknown ? (KeyT extends keyof T ? T[KeyT] : MatchingValues<T, KeyT>) : never;
export function assertedExactObjProperty<T extends object, KeyT extends unknown>(
  obj: T,
  key: KeyT,
  messageOrError?: string | Error
): T extends unknown ? T[keyof T] : never;
export function assertedExactObjProperty<T extends object, KeyT extends keyof T | unknown>(
  obj: T,
  key: KeyT,
  messageOrError?: string | Error
) {
  const validKey = assertedExactObjKeyOf(obj, key, messageOrError);
  return obj[validKey] as KeyT extends unknown ? (KeyT extends keyof T ? T[KeyT] : MatchingValues<T, KeyT>) : never;
}