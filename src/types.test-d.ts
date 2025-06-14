import { Expand, ExpandRecursively, ValueOf, OmitPropertiesWhereValueExtendsType, PickPropertiesWhereValueExtendsType, tsAssertIsEqual } from './index';

// Test ValueOf
{
  type Colors = { red: 'red'; blue: 'blue'; green: 'green' };
  type Color = ValueOf<Colors>;
  tsAssertIsEqual<Color, 'red' | 'blue' | 'green'>();
}

// Test Expand
{
  type User = { name: string; age: number };
  type ExpandedUser = Expand<User>;
  tsAssertIsEqual<ExpandedUser, { name: string; age: number }>();

  type Complex = { a: string } & { b: number };
  type Simple = Expand<Complex>;
  tsAssertIsEqual<Simple, { a: string; b: number }>();
}

// Test ExpandRecursively
{
  type User = { name: string; age: number };
  type RecursiveUser = ExpandRecursively<User>;
  tsAssertIsEqual<RecursiveUser, { name: string; age: number }>();

  type Complex = { a: string } & { b: number };
  type Simple = ExpandRecursively<Complex>;
  tsAssertIsEqual<Simple, { a: string; b: number }>();

  type ComplexType = {
    user: { name: string } & { age: number };
    settings: { theme: 'light' | 'dark' } & { language: string };
  };
  
  type Expanded = ExpandRecursively<ComplexType>;
  tsAssertIsEqual<Expanded, {
    user: { name: string; age: number };
    settings: { theme: 'light' | 'dark'; language: string };
  }>();
}

// Test OmitPropertiesWhereValueExtendsType
{
  type Config = {
    name: string;
    age: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  // Remove all Date properties
  type WithoutDates = OmitPropertiesWhereValueExtendsType<Config, Date>;
  tsAssertIsEqual<WithoutDates, {
    name: string;
    age: number;
    isActive: boolean;
  }>();

  // Remove all string properties
  type WithoutStrings = OmitPropertiesWhereValueExtendsType<Config, string>;
  tsAssertIsEqual<WithoutStrings, {
    age: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>();

  // Remove all boolean properties
  type WithoutBooleans = OmitPropertiesWhereValueExtendsType<Config, boolean>;
  tsAssertIsEqual<WithoutBooleans, {
    name: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
  }>();

  // Test with union types
  type MixedConfig = {
    name: string | null;
    age: number | undefined;
    isActive: boolean;
    createdAt: string | null;
  };

  // Remove properties that extend string | null
  type WithoutStringOrNull = OmitPropertiesWhereValueExtendsType<MixedConfig, string | null>;
  tsAssertIsEqual<WithoutStringOrNull, {
    age: number | undefined;
    isActive: boolean;
  }>();
}

// Test with union type
type TestObject = {
  a: string;
  b: number;
  c: string | number;
  d: string | number | boolean;
};

type Result = OmitPropertiesWhereValueExtendsType<TestObject, string | number>;

// Verify that properties extending string | number are omitted
tsAssertIsEqual<Result, {
  d: string | number | boolean;
}>();

// Test with single type
type SingleTypeObject = {
  a: string;
  b: number;
  c: boolean;
};

type SingleTypeResult = OmitPropertiesWhereValueExtendsType<SingleTypeObject, string>;

// Verify that only string property is omitted
tsAssertIsEqual<SingleTypeResult, {
  b: number;
  c: boolean;
}>();

// Test with empty object
type EmptyObject = {};
type EmptyResult = OmitPropertiesWhereValueExtendsType<EmptyObject, string>;
tsAssertIsEqual<EmptyResult, {}>();

// Test with nested object
type NestedObject = {
  a: { x: string; y: number };
  b: { x: string; y: string };
};

type NestedResult = OmitPropertiesWhereValueExtendsType<NestedObject, { x: string }>;
// both a and b are omitted because they extend { x: string }

// Verify that the result is an empty object
tsAssertIsEqual<NestedResult, {}>();

// Test PickPropertiesWhereValueExtendsType with union type
type PickResult = PickPropertiesWhereValueExtendsType<TestObject, string | number>;

// Verify that properties extending string | number are picked
tsAssertIsEqual<PickResult, {
  a: string;
  b: number;
  c: string | number;
}>();

// Test with single type
type PickSingleTypeResult = PickPropertiesWhereValueExtendsType<SingleTypeObject, string>;

// Verify that only string property is picked
tsAssertIsEqual<PickSingleTypeResult, {
  a: string;
}>();

// Test with empty object
type PickEmptyResult = PickPropertiesWhereValueExtendsType<EmptyObject, string>;
tsAssertIsEqual<PickEmptyResult, {}>();

// Test with nested object
type PickNestedResult = PickPropertiesWhereValueExtendsType<NestedObject, { x: string }>;

// Verify that both a and b are picked because they extend { x: string }
tsAssertIsEqual<PickNestedResult, {
  a: { x: string; y: number };
  b: { x: string; y: string };
}>(); 