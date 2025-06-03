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