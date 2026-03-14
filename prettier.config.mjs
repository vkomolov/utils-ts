export default {
	semi: false, // no semicolons (modern JS style)
	singleQuote: true, // use single quotes
	trailingComma: "es5", // trailing commas where valid in ES5
	tabWidth: 2, // indentation width
	printWidth: 90, // wrap lines longer than N characters
	arrowParens: "always", // always include parens: (x) => x
	bracketSpacing: true, // spaces in object literals
	endOfLine: "lf", // normalize line endings for cross-platform
	quoteProps: "as-needed",

	overrides: [
		{
			files: "*.json",
			options: {
				printWidth: 200
			}
		}
	]
}

