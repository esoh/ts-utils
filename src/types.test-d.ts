import { Expand, ExpandRecursively, ValueOf, tsAssertIsEqual } from './index';

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