import { assertedExactObjProperty, tsAssertIsEqual } from './index';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

{
    const key = 'port' as const;
    const value = assertedExactObjProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000>();
}

{
    const key: string = 'port';
    const value = assertedExactObjProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000 | 'localhost' | true>();
}

{
    const key = Math.random() > 0.5 ? 'port' : 'host';
    const value = assertedExactObjProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000 | 'localhost'>();
}

{
    const key: unknown = 'port';
    const value = assertedExactObjProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000 | 'localhost' | true>();
}

const config2 = Math.random() > 0.5 ? config : {
    apple: 'red',
} as const;

{
    const key = 'apple' as const;
    const value = assertedExactObjProperty(config2, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 'red'>();
}

{
    const key: unknown = 'apple';
    const value = assertedExactObjProperty(config2, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 'red' | 3000 | 'localhost' | true>();
}

type MyObject = {apple: 'red'}
const myObject = {
    apple: 'red',
    blueberry: 'blue',
} as MyObject;

// Because myObject is not exactly typed, this won't work correctly.
// assertedExactObjProperty should only be used on exactly typed objects without any other properties.
{
    const key = 'blueberry' as const;
    const value = assertedExactObjProperty(myObject, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, never>();
}