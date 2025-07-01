import { exactObjKeys, tsAssertIsEqual } from './index';

{
    const obj = { a: 1, b: 2 } as const;
    const keys = exactObjKeys(obj);
    tsAssertIsEqual<typeof keys, ('a' | 'b')[]>();
}

{
    const obj = Math.random() > 0.5 ? { a: 1, b: 2 } as const : { b: 1, c: 2} as const;
    const keys = exactObjKeys(obj);
    tsAssertIsEqual<typeof keys, ('a' | 'b' | 'c')[]>();
}