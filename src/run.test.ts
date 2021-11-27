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

describe('run', () => {
  const tests: RunConfig[] = [
    [t, 'string', "'atom", 'atom'],
    [t, 'string', "'turkey", 'turkey'],
    [t, 'integer', "'1492", '1492'],
    [f, 'unquoted integer', "1492", '1492'],
    [t, 'single character', "'u", 'u'],
    [t, 'special characters', "'*abc$", '*abc$'],
    [t, 'list', "'(atom)", "(atom)"],
    [t, 'list of atoms', "'(atom turkey or)", "(atom turkey or)"],
    [f,'nested list', "'((atom))", "((atom))"],
    [t, 'nested list of atoms', "'((atom turkey))", "((atom turkey))"],
    [f, 'mixed nested s-expressions', "'((atom turkey) or)", "((atom turkey) or)"],
    [f, 'mixed nested s-expressions', "'(or (atom turkey))", "(or (atom turkey))"],
    [t, 'empty list', "'()", "()"],
    [t, 'nested empty lists', "'(() () () ())", "(() () () ())"],
    [f, 'car of list length 1', "(car '(a))", 'a'],
    [f, 'car of list length 2', "(car '(a b))", 'a'],
    [t, 'car of list length 3', "(car '(a b c))", 'a'],
    [t, 'car of list starting with list', "(car '((a b c) x y z))", '(a b c)'],
    [t, 'car of string atom', "(car 'hotdog)", { error: 'Cannot get the car of atom "hotdog"' }],
    [t, 'car of empty list', "(car '())", { error: 'Cannot get the car of an empty list' }],
    [t, 'car of list with mixed s-expression', "(car '(((hotdogs)) (and) (pickle) relish))", '((hotdogs))'],
    [f, 'nested car expressions', "(car (car '((a))))", 'a'],
    [f, 'nested car expressions', "(car (car (car '(((a))))))", 'a'],
    [f, 'nested car expressions', "(car (car '( ((hotdogs)) ((and)) ) ))", '(hotdogs)'],
    [f, 'car of integer atom', "(car 1234)", { error: 'Cannot get the car of atom "1234"' }],
    [f, 'invalid nested car', "(car (car '(a)))", { error: 'Cannot get the car of returned atom "a"' }],
    [t, 'cdr', "(cdr '(a b c))", '(b c)'],
    [t, 'cdr', "(cdr '((a b c) x y z))", '(x y z)'],
    [t, 'cdr', "(cdr '(hamburger))", '()'],
    [t, 'cdr', "(cdr '((x) t r))", '(t r)'],
    [t, 'cdr', "(cdr 'hotdogs)", { error: 'Cannot get the cdr of atom "hotdogs"'}],
    [t, 'cdr', "(cdr '())", { error: 'Cannot get the cdr of an empty list'}],
    [f, 'nested cdr', "(cdr (cdr '(a b c)))", '(c)'],
    [f, 'nested cdr error', "(cdr (cdr '(a)))", { error: 'Cannot get the cdr of the returned empty list'}],
    [t, 'nested car and cdr', "(car (cdr '((b) (x y) ((c))) ))", '(x y)'],
    [t, 'nested cdr', "(cdr (cdr '((b) (x y) ((c))) ))", '(((c)))'],
    [t, 'nested cdr and car', "(cdr (car '(a (b (c)) d) ))", { error: 'Cannot get the cdr of returned atom "a"' }],
  ];

  process.stdout.write(`${chalk.gray('*')}: denotes test from The Little Schemer`);

  tests.forEach(([isFromBook, description, code, expectedOutput, config = { isOnly: false }]) => {
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
  });
});
