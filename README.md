## Installation with git

```bash
npm install git+https://github.com/vkomolov/utils-ts.git
```

### Usage example

`import { capitalize, slugify, formatDate } from "utils-ts";`

```console.log(capitalize("hello")); // Hello
console.log(slugify("Hello World!")); // hello-world
console.log(formatDate(new Date())); // 2026-03-13
```

---

### ✅ How to use

1. Clone and install dependencies:

```bash
npm install git+https://github.com/vkomolov/utils-ts.git
npm run build
```

Import functions directly into JS or TS:
`import { capitalize, slugify, formatDate } from "utils-ts";`
• JS-projects with JS takes funcs from dist/index.js
• TS-projects are automatically get types from dist/index.d.ts
