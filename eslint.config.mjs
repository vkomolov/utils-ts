import js from "@eslint/js"
import globals from "globals"

import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"

import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"

import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default [
	js.configs.recommended,

	{
		files: ["**/*.{js,ts}"],

		languageOptions: {
			parser: tsParser,

			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module"
			},

			globals: {
				...globals.browser,
				...globals.node
			}
		},

		plugins: {
			"@typescript-eslint": tsPlugin,
			import: importPlugin,
			"unused-imports": unusedImports,
			prettier: prettierPlugin
		},

		rules: {
			// TypeScript
			...tsPlugin.configs.recommended.rules,

			// Import hygiene
			"import/order": [
				"warn",
				{
					groups: ["builtin", "external", "internal"],
					"newlines-between": "always"
				}
			],

			// Remove unused imports automatically
			"unused-imports/no-unused-imports": "warn",

			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_"
				}
			],

			// Disable base rule because TS handles it
			"no-unused-vars": "off",

			"import/no-duplicates": "off",
			"import/no-unresolved": "error",
			"@typescript-eslint/consistent-type-imports": "warn",
			//To import TS types via import type { User } from "./types"

			// Prettier integration
			"prettier/prettier": "warn"
		}
	},

	prettierConfig,

	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"build/**",
			".vscode/**",
			".idea/**",
			"docs/**",
			"scripts/**"
		]
	}
]
