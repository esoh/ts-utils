import { assertedExactObjKeyOf, tsAssertIsEqual } from './index';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

{
    const key = 'port' as const;
    const value = assertedExactObjKeyOf(config, key);
    tsAssertIsEqual<typeof value, 'port'>();
}

{
    const key: string = 'port';
    const value = assertedExactObjKeyOf(config, key);
    tsAssertIsEqual<typeof value, 'port' | 'host' | 'debug'>();
}

{
    const key = Math.random() > 0.5 ? 'port' : 'host';
    const value = assertedExactObjKeyOf(config, key);
    tsAssertIsEqual<typeof value, 'port' | 'host'>();
}

{
    const key: unknown = 'port';
    const value = assertedExactObjKeyOf(config, key);
    tsAssertIsEqual<typeof value, 'port' | 'host' | 'debug'>();
}

const config2 = Math.random() > 0.5 ? config : {
    apple: 'red',
} as const;

{
    const key = 'apple' as const;
    const value = assertedExactObjKeyOf(config2, key);
    tsAssertIsEqual<typeof value, 'apple'>();
}

{
    const key: unknown = 'apple';
    const value = assertedExactObjKeyOf(config2, key);
    tsAssertIsEqual<typeof value, 'apple' | 'port' | 'host' | 'debug'>();
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
    const value = assertedExactObjKeyOf(myObject, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, never>();
}