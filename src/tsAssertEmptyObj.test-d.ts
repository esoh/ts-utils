import { tsAssertEmptyObj } from "./ts-assertions";

// base case
tsAssertEmptyObj<{}>();

// object with properties
// @ts-expect-error - should fail
tsAssertEmptyObj<{ a: 1 }>();

// union of objects
tsAssertEmptyObj<{} | {}>();

tsAssertEmptyObj<Omit<{ a: 1 }, "a">>();