export declare function isSafeObject(value: unknown): value is Record<string, unknown>;
/**
 * Creates a shallow copy of an object with specific keys removed.
 *
 * Useful when you want to preserve most of an object’s properties,
 * but explicitly exclude a known set of keys — for example, to prevent
 * overriding critical props or styles.
 *
 * This function is especially handy when working with `style` objects in React,
 * where certain properties (like `position`, `width`, etc.) must be protected.
 *
 * @template T - The type of the source object.
 * @template K - The keys to exclude from the result.
 *
 * @param obj - The original object to copy.
 * @param keys - An array of keys to omit from the result.
 *
 * @returns A new object with the specified keys removed.
 */
export declare function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K>;
//# sourceMappingURL=index.d.ts.map
