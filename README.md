# Scheme Engine

![example workflow](https://github.com/rachidlamouri/scheme-engine/actions/workflows/ci.yaml/badge.svg)

An exercie in building a scheme interpeter while reading [The Little Schemer](https://mitpress.mit.edu/books/little-schemer-fourth-edition). The grammar is made up to satisfy the rules described in the book. The lexer and parser are generated with [antlr4ts](https://www.npmjs.com/package/antlr4ts).

## Environment

Requires Java for grammar compilation, and Node for execution. Developed with [Temurin JDK 17](https://adoptium.net/index.htm) and [Node 16](https://nodejs.org/).

## Setup

```bash
npm install

npm run compile:grammar
```

## Running the Interpreter

```bash
# option 1: run a file
npm run scheme -- -f <filepath>

# option 2: run stdin
<schemeCode> | npm run scheme -- -i

# option 3: run a file whose filename is passed via stdin
<filepath> | npm run scheme -- -i -f

# examples
npm run scheme -- -f ci/example
echo \'turkey | npm run scheme -- -i
echo ci/example | npm run scheme -- -i -f
```

### Supported Features

For examples see [run.test.ts](./src/run.test.ts). For standard library functions see [standardLibrary/](./standardLibrary/).

- literal symbolic expressions
  - string:
    - `'example`
    - `'123`
    - `'-123`
    - `'#t`
    - `'#f`
  - integer:
    - `123`
    - `-123`
  - boolean:
    - `#t`
    - `#f`
  - list:
    - null: `'()`
    - list of strings: `'(a b c '123 '#t '#f)`
    - list of integers: `'(123 -123)`
    - list of booleans: `'(#t #f)`
    - list of lists: `'((a b c) '(d e f))`
    - mixed list: `'(a (b 123) ('#t #t))`
- car
- cdr
- cons
- null?
- atom?
- eq?
- lambda definitions
- lambda executions
- cond
- \+
- \-
- standard library imports
  - list/firsts -> firsts
  - list/insertL -> insertL
  - list/insertR -> insertR
  - list/lat -> lat?
  - list/member -> member?
  - list/multiRember -> multiRember
  - list/multiInsertL -> multiInsertL
  - list/multiInsertR -> multiInsertR
  - list/multiSubst -> multiSubst
  - list/rember -> rember
  - list/subst -> subst
  - logic/or -> or

## Development

```bash
# Watches grammar and typescript files. Recompiles grammars when changed, and reruns tests on all file changes
npm run dev -- --watch

# The engine also accepts a SCHEME_DEBUG=true flag that logs execution info to debug/<current-datetime>
echo \'turkey | (SCHEME_DEBUG=true npm run scheme -- -i)
SCHEME_DEBUG=true npm run dev -- --watch

# removes debug/
npm run clean:debug
```
