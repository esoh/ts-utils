import { assertedOneOf, tsAssertIsEqual } from './index';

// Test with string enum array
const StringEnum = ['a', 'b', 'c'] as const;
type StringEnum = typeof StringEnum[number];

// Test successful assertion
{
  const value = 'a' as string;
  const result = assertedOneOf(value, StringEnum);
  tsAssertIsEqual<typeof result, StringEnum>();
}

// Test with number enum array
const NumberEnum = [1, 2, 3] as const;
type NumberEnum = typeof NumberEnum[number];

// Test successful assertion
{
  const value = 1 as number;
  const result = assertedOneOf(value, NumberEnum);
  tsAssertIsEqual<typeof result, NumberEnum>();
}

// Test with mixed type array
const MixedEnum = ['a', 1, 'b', 2] as const;
type MixedEnum = typeof MixedEnum[number];

// Test successful assertion with string
{
  const value = 'a' as string | number;
  const result = assertedOneOf(value, MixedEnum);
  tsAssertIsEqual<typeof result, MixedEnum>();
}

// Test successful assertion with number
{
  const value = 1 as string | number;
  const result = assertedOneOf(value, MixedEnum);
  tsAssertIsEqual<typeof result, MixedEnum>();
}

// Test with readonly array
const ReadonlyEnum = ['x', 'y', 'z'] as const;
type ReadonlyEnum = typeof ReadonlyEnum[number];

// Test successful assertion
{
  const value = 'x' as string;
  const result = assertedOneOf(value, ReadonlyEnum);
  tsAssertIsEqual<typeof result, ReadonlyEnum>();
}

// Test with empty array
const EmptyEnum = [] as const;
type EmptyEnum = typeof EmptyEnum[number];

// Test successful assertion (though this would throw at runtime)
{
  const value = '' as never;
  const result = assertedOneOf(value, EmptyEnum);
  tsAssertIsEqual<typeof result, EmptyEnum>();
}

// Test with single value array
const SingleEnum = ['single'] as const;
type SingleEnum = typeof SingleEnum[number];

// Test successful assertion
{
  const value = 'single' as string;
  const result = assertedOneOf(value, SingleEnum);
  tsAssertIsEqual<typeof result, SingleEnum>();
}

// Test with custom error message
{
  const value = 'a' as string;
  const result = assertedOneOf(value, StringEnum, 'Custom error message');
  tsAssertIsEqual<typeof result, StringEnum>();
}

// Test with Error object
{
  const value = 'a' as string;
  const result = assertedOneOf(value, StringEnum, new Error('Custom error'));
  tsAssertIsEqual<typeof result, StringEnum>();
} 