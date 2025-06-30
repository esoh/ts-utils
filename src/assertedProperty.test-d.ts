import { assertedProperty, tsAssertIsEqual } from './index';

const config = {
  port: 3000,
  host: 'localhost',
  debug: true
} as const;

{
    const key = 'port' as const;
    const value = assertedProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000>();
}

{
    const key: string = 'port';
    const value = assertedProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000 | 'localhost' | true>();
}

{
    const key = Math.random() > 0.5 ? 'port' : 'host';
    const value = assertedProperty(config, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 3000 | 'localhost'>();
}

const config2 = Math.random() > 0.5 ? config : {
    apple: 'red',
} as const;

{
    const key = 'apple' as const;
    const value = assertedProperty(config2, key, 'Invalid config key');
    tsAssertIsEqual<typeof value, 'red'>();
}