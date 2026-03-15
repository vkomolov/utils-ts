/**
 * Extracts the file name (basename) from a given URL string.
 *
 * @example
 * getFileNameFromUrl("https://example.com/images/photo.png");
 * // → "photo.png"
 *
 * @example
 * getFileNameFromUrl("https://example.com/path/to/file.mp4?token=abc");
 * // → "file.mp4"
 *
 * @param url - The full URL of the file.
 * @returns The file name extracted from the URL, or an empty string if extraction fails.
 */
export declare function getFileNameFromUrl(url: string): string;
export declare const getAbsPath: (rel: string, baseUrl: string) => string;
//# sourceMappingURL=index.d.ts.map