# Scheme Engine

An exercie in building a scheme interpeter while reading [The Little Schemer](https://mitpress.mit.edu/books/little-schemer-fourth-edition). The grammar is made up to satisfy the rules described in the book. The lexer and parser are generated with [antlr4ts](https://www.npmjs.com/package/antlr4ts).

## Setup

```bash
npm install

npm run compile:grammar

npm run compile:ts
```

## Running the Interpreter

```bash
# option 1
npm run scheme -- -f <filepath>

# option 2
<schemeCode> | npm run scheme -- -i

# option 3
<filepath> | npm run scheme -- -i -f

# example
echo "'turkey" | npm run scheme -- -i # 'turkey
```

### Supported Features

- echo string literals
- echo integer literals

## Development

### Grammar

```bash
# Run any time src/language/Scheme.g4 changes
npm run compile:grammar
```

### Interpreter

```bash
npm test -- --watch
```
