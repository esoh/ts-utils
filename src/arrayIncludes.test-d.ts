import { arrayIncludes, tsAssertIsEqual } from "./";

{
    const colors = ['red', 'blue', 'green'] as const;
    const color = 'red' as string;

    if (arrayIncludes(colors, color)) {
        // color is now narrowed to 'red' | 'blue' | 'green'
        console.log(color);
        tsAssertIsEqual<typeof color, 'red' | 'blue' | 'green'>();
    }
}