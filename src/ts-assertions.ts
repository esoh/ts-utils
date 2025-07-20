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
  ..._args: T extends unknown ? IfEquals<T, {}, [], never> : never
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

type IsExtends<CandidateT, ExpectedT, TrueT, FalseT> =
  CandidateT extends ExpectedT ? TrueT : FalseT;

  type ZeroIfHasZero<T> = 0 extends T ? 0 : T;
type OneIfHasOne<T> = 1 extends T ? 1 : T;
type OneIfNever<T> = [T] extends [never] ? 1 : T;

type NoExtraProps<ActualTMaybeUnion, ExpectedTMaybeUnion> =
  // Every ActualT element needs an exact match in ExpectedT.
  ZeroIfHasZero<
    ActualTMaybeUnion extends infer ActualT
      ? ActualT extends object
        ? // now we're expanding the union of ExpectedT to see if any of the
          // elements of ExpectedT are an exact match for the current ActualT
          // element. we only need one match. so if any union element is 1, we
          // can return 1.
          OneIfHasOne<
            ExpectedTMaybeUnion extends infer ExpectedT
              ? ExpectedT extends object
                ? // maybe they are both arrays?
                  ActualT extends readonly unknown[]
                  ? ExpectedT extends readonly unknown[]
                    ? NoExtraProps<ActualT[number], ExpectedT[number]>
                    : 0 // `ActualT` is an array but `ExpectedT` is not
                  : // ActualT is not an array
                    // we'll check that there are no extra keys.
                    Exclude<keyof ActualT, keyof ExpectedT> extends never
                    ? // ActualT is at least a partial type of ExpectedT.
                      // we can iterate through the keys of ExpectedT and
                      // make sure ActualT[key] satisfies ExpectedT[key].
                      // If any properties fail the satisfy we return 0.
                      ZeroIfHasZero<
                        OneIfNever<
                          // returns never if no properties, returns a
                          // union of 0 or 1 otherwise
                          {
                            // iterate through every key in ExpectedT
                            [K in keyof ExpectedT]: K extends keyof ActualT
                              ? // if K is optional on ActualT but
                                // required on ExpectedT, this should be
                                // rejected.
                                //
                                // if K is optional on ActualT AND on
                                // ExpectedT, we should check that the
                                // types match.
                                //
                                // if K is required on ActualT but
                                // is optonal on ExpectedT, we should
                                // check that the types match.
                                //
                                // if K is required on ActualT AND on
                                // ExpectedT, we should check the types
                                // match.
                                Record<string, never> extends Pick<ActualT, K>
                                ? Record<string, never> extends Pick<
                                    ExpectedT,
                                    K
                                  >
                                  ? NoExtraProps<ActualT[K], ExpectedT[K]>
                                  : 0
                                : NoExtraProps<ActualT[K], ExpectedT[K]>
                              : // just because K is in ExpectedT
                                // doesn't mean ActualT needs it,
                                // in the case that K is optional.
                                Record<string, never> extends Pick<ExpectedT, K>
                                ? 1
                                : 0;
                          }[keyof ExpectedT]
                        >
                      >
                    : 0 // ActualT has extra keys when compared to ExpectedT
                : 0 // ExpectedT doesn't extend object but ActualT does - this one is not a match.
              : never // shouldn't really happen - ExpectedTMaybeUnion extends infer ExpectedT should work
          >
        : // ActualT is not an object.
          ActualT extends ExpectedTMaybeUnion
          ? 1
          : 0
      : never // shouldn't really happen - ActualT extends infer ActualT should work
  >;
type IfExtraProps<ActualT, ExpectedT, TrueT, FalseT> = 1 extends NoExtraProps<
  ActualT,
  ExpectedT
>
  ? FalseT
  : TrueT;

type IfExtendsWithoutExtraProps<
  CandidateT,
  ExpectedT,
  TrueT,
  FalseBcNotExtendsT = never,
  FalseBcExtraPropsT = never,
> = IfExtraProps<
  CandidateT,
  ExpectedT,
  FalseBcExtraPropsT,
  IsExtends<CandidateT, ExpectedT, TrueT, FalseBcNotExtendsT>
>;

/**
 * This function is used to enforce that the object passed in both extends
 * ExpectedT and has no extra properties compared to the exepcted type
 * ExpectedT.
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * tsAssertExtendsExact<typeof obj, { a: number; b: number }>(); // GOOD
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * tsAssertExtendsExact<typeof obj, { a: number }>(); // Error: obj2 has extra property b
 * @example
 * const obj = { a: 1 };
 * tsAssertExtendsExact<typeof obj, { a: number; b: number }>(); // Error: obj2 is missing property b
 */
export function tsAssertExtendsExact<CandidateT, ExpectedT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: IfExtendsWithoutExtraProps<
    CandidateT,
    ExpectedT,
    [],
    ['CandidateT does not extend ExpectedT'],
    ['CandidateT has extra properties when compared to ExpectedT']
  >
) {
  return;
}

type IfExtends<A, B, TrueValueT = "T", FalseValueT = "F"> = A extends B ? TrueValueT : FalseValueT;

export function tsAssertExtends<CandidateT, ExpectedT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: IfExtends< CandidateT, ExpectedT, [], ['CandidateT does not extend ExpectedT']>
) {
  return;
}