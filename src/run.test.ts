import { expect } from 'earljs';
import chalk from 'chalk';
import { run } from './run';

type MochaConfig = {
  isOnly: boolean;
}

type OutputConfig = string | { error: string };

type RunConfig =
  [isFromBook: boolean, description: string, code: string, expectedOutput: OutputConfig]
  | [isFromBook: boolean, description: string, code: string, expectedOutput: OutputConfig, config: MochaConfig];

const t = true;
const f = false;

const runTest = ([isFromBook, description, code, expectedOutput, config = { isOnly: false }]: RunConfig) => {
  const method = config.isOnly ? it.only : it;
  const isErrorTest = typeof expectedOutput === 'object';
  const outputDescription = isErrorTest
    ? chalk.red(expectedOutput.error)
    : chalk.yellow(expectedOutput)

  const prefix = isFromBook ? '*' : ' ';

  method(`${prefix} ${chalk.cyan(description)}: ${chalk.blue(code)} -> ${outputDescription}`, () => {
    if (isErrorTest) {
      expect(() => run(code)).toThrow(expectedOutput.error);
    } else {
      expect(run(code)).toEqual(expectedOutput);
    }
  });
};

const runSuite = (suiteName: string, tests: RunConfig[], config?: MochaConfig) => {
  const method = config !== undefined && config.isOnly ? describe.only : describe;
  method(suiteName, () => {
    tests.forEach(runTest);
  })
};

process.stdout.write(`${chalk.gray('*')}: denotes test from The Little Schemer`);

describe('run', () => {
  runSuite('literals', [
    [t, 'string', "'atom", 'atom'],
    [t, 'string', "'turkey", 'turkey'],
    [t, 'integer', "'1492", '1492'],
    [f, 'unquoted integer', "1492", '1492'],
    [t, 'single character', "'u", 'u'],
    [t, 'special characters', "'*abc$", '*abc$'],
    [t, 'list', "'(atom)", "(atom)"],
    [t, 'list of atoms', "'(atom turkey or)", "(atom turkey or)"],
    [f, 'nested list', "'((atom))", "((atom))"],
    [t, 'nested list of atoms', "'((atom turkey))", "((atom turkey))"],
    [f, 'mixed nested s-expressions', "'((atom turkey) or)", "((atom turkey) or)"],
    [f, 'mixed nested s-expressions', "'(or (atom turkey))", "(or (atom turkey))"],
    [t, 'empty list', "'()", "()"],
    [t, 'nested empty lists', "'(() () () ())", "(() () () ())"],
  ]);

  runSuite('car', [
    [f, 'list of length 1', "(car '(a))", 'a'],
    [f, 'list of  length 2', "(car '(a b))", 'a'],
    [t, 'list of  length 3', "(car '(a b c))", 'a'],
    [t, 'list starting with list', "(car '((a b c) x y z))", '(a b c)'],
    [t, 'string atom', "(car 'hotdog)", { error: 'Cannot call car on atom "hotdog"' }],
    [t, 'empty list', "(car '())", { error: 'Cannot call car on an empty list' }],
    [t, 'list with mixed s-expression', "(car '(((hotdogs)) (and) (pickle) relish))", '((hotdogs))'],
    [f, 'nested car expressions', "(car (car '((a))))", 'a'],
    [f, 'nested car expressions', "(car (car (car '(((a))))))", 'a'],
    [f, 'nested car expressions', "(car (car '( ((hotdogs)) ((and)) ) ))", '(hotdogs)'],
    [f, 'integer atom', "(car 1234)", { error: 'Cannot call car on atom "1234"' }],
    [f, 'invalid nested car', "(car (car '(a)))", { error: 'Cannot call car on atom "a"' }],
  ]);

  runSuite('cdr', [
    [t, 'list', "(cdr '(a b c))", '(b c)'],
    [t, 'car of list is list', "(cdr '((a b c) x y z))", '(x y z)'],
    [t, 'list with one atom', "(cdr '(hamburger))", '()'],
    [t, 'car of list is list', "(cdr '((x) t r))", '(t r)'],
    [t, 'atom', "(cdr 'hotdogs)", { error: 'Cannot call cdr on atom "hotdogs"'}],
    [t, 'empty list', "(cdr '())", { error: 'Cannot call cdr on an empty list'}],
    [f, 'nested cdr', "(cdr (cdr '(a b c)))", '(c)'],
    [f, 'nested cdr error', "(cdr (cdr '(a)))", { error: 'Cannot call cdr on an empty list'}],
    [t, 'nested car and cdr', "(car (cdr '((b) (x y) ((c))) ))", '(x y)'],
    [t, 'nested cdr', "(cdr (cdr '((b) (x y) ((c))) ))", '(((c)))'],
    [t, 'nested cdr and car', "(cdr (car '(a (b (c)) d) ))", { error: 'Cannot call cdr on atom "a"' }],
  ]);

  runSuite('cons', [
    [t, 'atom and list', "(cons 'peanut '(butter and jelly))", '(peanut butter and jelly)'],
    [t, 'list and list', "(cons '(banana and) '(peanut butter and jelly))", '((banana and) peanut butter and jelly)'],
    [t, 'list and list', "(cons '((help) this) '(is very ((hard) to learn)) )", '(((help) this) is very ((hard) to learn))'],
    [t, 'list and empty list', "(cons '(a b (c)) '() )", '((a b (c)))'],
    [t, 'atom and empty list', "(cons 'a '() )", '(a)'],
    [t, 'list and atom', "(cons '((abcd)) 'b )", { error: 'The second parameter to cons must be a list. Received: "b"' }],
    [t, 'atom and atom', "(cons 'a 'b )", { error: 'The second parameter to cons must be a list. Received: "b"' }],
    [f, 'one parameter', "(cons 'a)", { error: 'cons requires two parameters. Received one: "a"' }],
    [t, 'cons of car', "(cons 'a (car '((b) c d) ))", '(a b)'],
    [t, 'cons of cdr', "(cons 'a (cdr '((b) c d) ))", '(a c d)'],
  ]);

  runSuite('null?', [
    [t, 'empty list', "(null? '())", 'true'],
    [t, 'non empty list', "(null? '(a b c))", 'false'],
    [t, 'atom', "(null? 'a)", { error: 'Cannot call null? on atom "a"'}],
    [f, 'nested null?', "(null? (null? '()))", { error: 'Cannot call null? on a boolean' }],
    [f, 'null? and car', "(null? (car '(a b c)))", { error: 'Cannot call null? on atom "a"' }],
    [f, 'car and null?', "(car (null? '(a b c)))", { error: 'Cannot call car on a boolean' }],
    [f, 'null? and cdr', "(null? (cdr '(a b c)))", 'false'],
    [f, 'cdr and null?', "(cdr (null? '(a b c)))", { error: 'Cannot call cdr on a boolean' }],
    [f, 'null? and cons', "(null? (cons 'a '()))", 'false'],
    [f, 'cons and null?', "(cons (null? '(a b c)) '())", '(false)'],
    [f, 'cons and null?', "(cons 'a (null? '()))", { error: 'The second parameter to cons must be a list. Received: "true"' }],
  ]);
});
