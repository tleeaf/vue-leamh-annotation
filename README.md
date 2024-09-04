# Léamh Annotation Editor

Léamh Annotation Editor is a tool for annotating Léamh texts. It allows users to create and edit Léamh annotations in a simple and intuitive interface. 

## Features

- Create and edit Léamh annotations in a simple and intuitive interface.
- Import and export Léamh annotations in JSON format.
- Word-by-word and chunk-by-chunk annotation modes.
- Word-by-word annotation mode allows you to highlight similar words and easily copy and paste fields from one instance of a word to another.
- Progress is saved in the browser's local storage so you can easily continue where you left off.
- Check a summary of the annotation progress for the text.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
