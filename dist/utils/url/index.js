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
export function getFileNameFromUrl(url) {
  try {
    // Use the URL API to safely parse and extract the pathname
    const pathname = new URL(url).pathname;
    // Get the last segment after the last "/"
    const baseName = pathname.substring(pathname.lastIndexOf('/') + 1);
    // Warn if the filename could not be determined
    if (!baseName) {
      console.warn(`[getFileNameFromUrl]: Could not extract file name from URL: ${url}`);
    }
    return baseName;
  } catch {
    // Handle invalid URLs or unexpected input
    console.warn(`[getFileNameFromUrl]: Invalid URL provided: ${url}`);
    return '';
  }
}
export const getAbsPath = (rel, baseUrl) => {
  try {
    // If rel is already an absolute URL
    return new URL(rel).toString();
  } catch {
    // If rel is relative
    return new URL(rel, baseUrl).toString();
  }
};
//# sourceMappingURL=index.js.map
