
import fs from "fs";
import path from "path";

/**
 * Recursively processes a directory to find files with the target extension.
 * Returns a new object with entries, does not mutate any external state.
 *
 * @param targetDir - The current directory being processed.
 * @param fileExt - The normalized file extension (with leading dot).
 * @param recursive - Whether to process subdirectories recursively.
 * @param joinSymbol - Symbol to join folder names with file name for nested files.
 * @param nestedPrefix - Accumulated folder names for nested files (internal use).
 * @returns Object with found file entries.
 */
function processDirectory(
  targetDir: string,
  fileExt: string,
  recursive: boolean = false,
  joinSymbol: string = "_",
  nestedPrefix: string = ""
): Record<string, string> {
  const entries: Record<string, string> = {};

  // Read all items (files and directories) in the current directory
  const items = fs.readdirSync(targetDir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(targetDir, item.name);

    if (item.isDirectory() && recursive) {
      // Build the nested prefix for subdirectories
      const newNestedPrefix = nestedPrefix
        ? `${nestedPrefix}${joinSymbol}${item.name}`
        : item.name;

      // Recursively get entries from subdirectory and merge into current entries
      const subEntries = processDirectory(itemPath, fileExt, recursive, joinSymbol, newNestedPrefix);
      Object.assign(entries, subEntries);
    }
    else if (item.isFile() && item.name.endsWith(fileExt)) {
      // Extract filename without extension
      const fileNameWithoutExt = path.basename(item.name, fileExt);

      // Construct the key: use nestedPrefix with joinSymbol for nested files, plain name for top-level
      const entryKey = nestedPrefix
        ? `${nestedPrefix}${joinSymbol}${fileNameWithoutExt}`
        : fileNameWithoutExt;

      // Store the absolute path
      entries[entryKey] = path.resolve(itemPath);
    }
  }

  return entries;
}

/**
 * Searches for files with the target extension at the given path.
 *
 * @param pathToFiles - Path to the directory to search in.
 * @param targetExt - Target extension of the files (with or without dot), e.g., ".js", ".html", "js", "html".
 * @param recursive - If true, searches recursively in all subdirectories.
 *                    If false, only searches the top-level directory.
 * @param joinSymbol - Symbol to join folder names with file name for nested files.
 *                     Only used when recursive is true. Defaults to "_".
 * @returns An object where:
 *          - For top-level files: key is the filename without extension (e.g., "one").
 *          - For nested files: key is "folderName{joinSymbol}fileName" or nested path with joinSymbol.
 *          - Value is the absolute path to the file.
 *
 * @example
 * // Search only in the top-level directory (non-recursive)
 * getFilesEntries("src/js", "js");
 * // Result: { "one": "/project/src/js/one.js" }
 *
 * @example
 * // Search recursively with default join symbol "_"
 * getFilesEntries("src/js", "js", true);
 * // Result: {
 * //   "one": "/project/src/js/one.js",
 * //   "foo_two": "/project/src/js/foo/two.js",
 * //   "foo_bar_three": "/project/src/js/foo/bar/three.js"
 * // }
 *
 * @example
 * // Search recursively with custom join symbol "-"
 * getFilesEntries("src/js", "js", true, "-");
 * // Result: {
 * //   "one": "/project/src/js/one.js",
 * //   "foo-two": "/project/src/js/foo/two.js",
 * //   "foo-bar-three": "/project/src/js/foo/bar/three.js"
 * // }
 */
export function getFilesEntries(
  pathToFiles: string,
  targetExt: string,
  recursive: boolean = false,
  joinSymbol: string = "_"
): Record<string, string> {
  // Normalize the extension to always include a leading dot
  const fileExt = targetExt.startsWith(".") ? targetExt : `.${targetExt}`;

  // Resolve the absolute path for consistent path handling
  const resolvedPath = path.resolve(pathToFiles);

  // Check if the provided path exists
  if (!fs.existsSync(resolvedPath)) {
    console.error("No such path found at getFilesEntries:", pathToFiles);
    return {};
  }

  // Get entries from the root directory
  const entries = processDirectory(resolvedPath, fileExt, recursive, joinSymbol);

  // Log a warning if no files were found
  if (Object.keys(entries).length === 0) {
    console.error(`[getFilesEntries]: no files found with ${fileExt} at ${pathToFiles}`);
  }

  return entries;
}