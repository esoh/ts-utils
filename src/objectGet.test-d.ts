import { objectGet, assertedProperty, tsAssertIsEqual} from './index';

const obj: Record<string, number> = { a: 1, b: 2 };
const zValue = objectGet(obj, 'z');
const aValue = objectGet(obj, 'a');
const aValueAsserted = assertedProperty(obj, 'a');
// Test type assertions for Record type
tsAssertIsEqual<typeof zValue, number | undefined>();
tsAssertIsEqual<typeof aValue, number | undefined>();
tsAssertIsEqual<typeof aValueAsserted, number>();

// Test objectGet with const assertion (narrow type)
const obj2 = { a: 1, b: 2 } as const;
const obj2ZValue = objectGet(obj2, 'z');
const obj2AValue = objectGet(obj2, 'a');
const obj2BValue = objectGet(obj2, 'b');

// Test type assertions for const assertion
tsAssertIsEqual<typeof obj2ZValue, undefined>();
tsAssertIsEqual<typeof obj2AValue, 1>();
tsAssertIsEqual<typeof obj2BValue, 2>();

// With literal object and wide key
const obj3 = { a: 1, b: 2 } as const;
const value3 = objectGet(obj3, 'a' as string); // type is 1 | 2 | undefined
tsAssertIsEqual<typeof value3, 1 | 2 | undefined>();