/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * src/as/as/allocateString
 * @param str `~lib/string/String`
 * @returns `~lib/staticarray/StaticArray<u16>`
 */
export declare function allocateString(str: string): ArrayLike<number>;
/**
 * src/as/as/levenshtein
 * @param a `~lib/staticarray/StaticArray<u16>`
 * @param b `~lib/staticarray/StaticArray<u16>`
 * @param aLen `i32`
 * @param bLen `i32`
 * @returns `f64`
 */
export declare function levenshtein(a: ArrayLike<number>, b: ArrayLike<number>, aLen: number, bLen: number): number;
