import { exactObjGet, assertedExactObjProperty, tsAssertIsEqual} from './index';

{
    const obj: Record<string, number> = { a: 1, b: 2 };
    const zValue = exactObjGet(obj, 'z');
    const aValue = exactObjGet(obj, 'a');
    const aValueAsserted = assertedExactObjProperty(obj, 'a');
    // Test type assertions for Record type
    tsAssertIsEqual<typeof zValue, number | undefined>();
    tsAssertIsEqual<typeof aValue, number | undefined>();
    tsAssertIsEqual<typeof aValueAsserted, number>();
}

{
    // Test exactObjGet with const assertion (narrow type)
    const obj2 = { a: 1, b: 2 } as const;
    const obj2ZValue = exactObjGet(obj2, 'z');
    const obj2AValue = exactObjGet(obj2, 'a');
    const obj2BValue = exactObjGet(obj2, 'b');

    // Test type assertions for const assertion
    tsAssertIsEqual<typeof obj2ZValue, undefined>();
    tsAssertIsEqual<typeof obj2AValue, 1>();
    tsAssertIsEqual<typeof obj2BValue, 2>();
}

{
    // With literal object and wide key
    const obj3 = { a: 1, b: 2 } as const;
    const value3 = exactObjGet(obj3, 'a' as string); // type is 1 | 2 | undefined
    tsAssertIsEqual<typeof value3, 1 | 2 | undefined>();
}


{
    const obj = Math.random() > 0.5 ? { a: 1, b: 2 } as const : { b: 1, c: 2} as const;
    const value = exactObjGet(obj, 'a');
    tsAssertIsEqual<typeof value, 1 | undefined>();
    const value2 = exactObjGet(obj, 'b');
    tsAssertIsEqual<typeof value2, 1 | 2>();
    const value3 = exactObjGet(obj, 'c');
    tsAssertIsEqual<typeof value3, 2 | undefined>();
}