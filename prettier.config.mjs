export default {
  semi: true, // add semicolons at the end of statements
  singleQuote: true, // use double quotes instead of single quotes
  trailingComma: 'all', // trailing commas wherever allowed (ES5+)
  tabWidth: 2, // override indentation width when useTabs is false
  printWidth: 90, // wrap lines longer than N characters
  arrowParens: 'avoid', // omit parens when possible: x => x
  bracketSpacing: true, // spaces in object literals: { foo: bar }
  endOfLine: 'lf', // lf / crlf / auto (auto = preserve existing)
  overrides: [
    {
      files: '*.json',
      options: { printWidth: 200 }, // keep package.json on one line
    },
  ],

  /* ===== extra QoL rules – uncomment if you like ===== */

  /* quoteProps ---------------------------------------------------- */
  // "as-needed"  – add quotes only when required by JS (default)
  // "consistent" – if at least one key needs quotes, quote all keys
  // "preserve"   – keep whatever the developer wrote (no touch)

  quoteProps: 'as-needed', // quote all or no props in one object (easier diffs), 'consistent'

  // useTabs: true,                    // indent lines with tabs (\t) instead of spaces
  //jsxSingleQuote: false,             // use single quotes in JSX
  // bracketSameLine: false,            // true: put > at end of last line (React-community style)
  // jsxBracketSameLine: false,        // deprecated alias for bracketSameLine

  /* proseWrap ----------------------------------------------------- */
  // "always"  – wrap markdown / JSDoc at printWidth
  // "never"   – keep long lines as-is
  // "preserve"– leave existing wrapping (default)

  // proseWrap: 'preserve',            // how to wrap markdown text: always / never / preserve

  /* htmlWhitespaceSensitivity ------------------------------------ */
  // "css"    – respect CSS white-space rules (default)
  // "strict" – all whitespace is significant (extra spaces kept)
  // "ignore" – collapse any whitespace that Prettier considers extra

  // htmlWhitespaceSensitivity: 'css', // how to treat whitespace in HTML: css / strict / ignore

  /* vueIndentScriptAndStyle -------------------------------------- */
  // false – keep <script>/<style> at column 0 inside .vue (default)
  // true  – indent them one level deeper (same level as <template>)

  // vueIndentScriptAndStyle: false,   // indent <script> & <style> tags in Vue SFC

  /* embeddedLanguageFormatting ----------------------------------- */
  // "auto" – format <style>, <script>, {% %} etc. if parser known (default)
  // "off"  – leave embedded code untouched

  // embeddedLanguageFormatting: 'auto', // format embedded code blocks: auto / off

  /* insertPragma / requirePragma --------------------------------- */
  // insertPragma: false – do NOT add /* @prettier */ at top (default)
  // requirePragma: false– format every file (default)
  // (both accept true for opposite behaviour; no extra enum values)

  // insertPragma: false,              // insert @prettier at top of formatted files

  // requirePragma: false,             // format only files with @prettier pragma

  /* parser ------------------------------------------------------- */
  // "babel"      – JS (ES2018+) via @babel/parser
  // "babel-flow" – JS + Flow syntax
  // "flow"       – pure Flow parser
  // "typescript" – TypeScript
  // "espree"     – JS (ES5-ES8) without JSX
  // "meriyah"    – modern JS alternative
  // "css"        – CSS, SCSS, Less
  // "scss"       – SCSS
  // "less"       – Less
  // "json"       – JSON
  // "json5"      – JSON5
  // "json-stringify" – JSON with stringify semantics
  // "graphql"    – GraphQL SDL
  // "markdown"   – Markdown
  // "mdx"        – MDX
  // "html"       – HTML
  // "vue"        – Vue SFC
  // "angular"    – Angular templates
  // "lwc"        – Lightning Web Components
  // "yaml"       – YAML

  // parser: '',                       // force parser: babel / typescript / espree / etc
};
