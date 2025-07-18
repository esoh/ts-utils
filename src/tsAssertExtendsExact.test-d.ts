import { tsAssertExtendsExact } from "./ts-assertions";

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

const obj = { a: 1, b: 2 };
tsAssertExtendsExact<typeof obj, { a: number; b: number }>(); // GOOD

const obj2 = { a: 1, b: 2 };
// @ts-expect-error - obj2 has extra property b, expected { a: number }
tsAssertExtendsExact<typeof obj2, { a: number }>(); // Error: obj2 has extra property b, expected { a: number }

const obj3 = { a: 1 };
// @ts-expect-error - obj3 is missing property b, expected { a: number; b: number }
tsAssertExtendsExact<typeof obj3, { a: number; b: number }>(); // Error: obj3 is missing property b

const obj4 = { a: 1, b: { c: 3, d: 4} };
tsAssertExtendsExact<typeof obj4, { a: number; b: { c: number; d: number } }>(); // GOOD
// @ts-expect-error - obj4 has extra property d, expected { a: number; b: { c: number } }
tsAssertExtendsExact<typeof obj4, { a: number; b: { c: number } }>(); // GOOD

const obj5 = { a: 'hello'}
// @ts-expect-error - obj5 has extra property b, expected { a: number }
tsAssertExtendsExact<typeof obj5, { a: number }>();

const obj6 = { a: 1, b: { c: 3 }} as const;
tsAssertExtendsExact<typeof obj6, { a: number; b: { c: number } | { d: string } }>();

const obj7 = { a: 1, b: { c: 2 }} as const;
tsAssertExtendsExact<typeof obj7, { a: number; b: { c: 2 | 3 } }>();

const obj8 = { a: 1, b: { c: 4 }} as const;
// @ts-expect-error - obj8 has extra property c, expected { a: number; b: { c: 2 | 3 } }
tsAssertExtendsExact<typeof obj8, { a: number; b: { c: 2 | 3 } }>();
