import { assertOneOf, tsAssertIsEqual } from './index';

// Test with string enum array
const StringEnum = ['a', 'b', 'c'] as const;
type StringEnum = typeof StringEnum[number];

// Test successful assertion
{
  const value = 'a' as string;
  assertOneOf(value, StringEnum);
  tsAssertIsEqual<typeof value, StringEnum>();
}

// Test with number enum array
const NumberEnum = [1, 2, 3] as const;
type NumberEnum = typeof NumberEnum[number];

// Test successful assertion
{
  const value = 1 as number;
  assertOneOf(value, NumberEnum);
  tsAssertIsEqual<typeof value, NumberEnum>();
}

// Test with mixed type array
const MixedEnum = ['a', 1, 'b', 2] as const;
type MixedEnum = typeof MixedEnum[number];

// Test successful assertion with string
{
  const value = 'a' as string | number;
  assertOneOf(value, MixedEnum);
  tsAssertIsEqual<typeof value, MixedEnum>();
}

// Test successful assertion with number
{
  const value = 1 as string | number;
  assertOneOf(value, MixedEnum);
  tsAssertIsEqual<typeof value, MixedEnum>();
}

// Test with readonly array
const ReadonlyEnum = ['x', 'y', 'z'] as const;
type ReadonlyEnum = typeof ReadonlyEnum[number];

// Test successful assertion
{
  const value = 'x' as string;
  assertOneOf(value, ReadonlyEnum);
  tsAssertIsEqual<typeof value, ReadonlyEnum>();
}

// Test with empty array
const EmptyEnum = [] as const;
type EmptyEnum = typeof EmptyEnum[number];

// Test successful assertion (though this would throw at runtime)
{
  const value = '' as never;
  assertOneOf(value, EmptyEnum);
  tsAssertIsEqual<typeof value, EmptyEnum>();
}

// Test with single value array
const SingleEnum = ['single'] as const;
type SingleEnum = typeof SingleEnum[number];

// Test successful assertion
{
  const value = 'single' as string;
  assertOneOf(value, SingleEnum);
  tsAssertIsEqual<typeof value, SingleEnum>();
}

// Test with custom error message
{
  const value = 'a' as string;
  assertOneOf(value, StringEnum, 'Custom error message');
  tsAssertIsEqual<typeof value, StringEnum>();
}

// Test with Error object
{
  const value = 'a' as string;
  assertOneOf(value, StringEnum, new Error('Custom error'));
  tsAssertIsEqual<typeof value, StringEnum>();
} 