import { expect } from 'earljs';
import chalk from 'chalk';
import { run } from './run';

type MochaConfig = {
  isOnly: boolean;
}

type OutputConfig = string | { error: string };

type RunConfig =
  [description: string, code: string, expectedOutput: OutputConfig]
  | [description: string, code: string, expectedOutput: OutputConfig, config: MochaConfig];

describe('run', () => {
  const tests: RunConfig[] = [
    ['string', "'atom", 'atom'],
    ['string', "'turkey", 'turkey'],
    ['integer', "'1492", '1492'],
    ['unquoted integer', "1492", '1492'],
    ['single character', "'u", 'u'],
    ['special characters', "'*abc$", '*abc$'],
    ['list', "'(atom)", "(atom)"],
    ['list of atoms', "'(atom turkey or)", "(atom turkey or)"],
    ['nested list', "'((atom))", "((atom))"],
    ['nested list of atoms', "'((atom turkey))", "((atom turkey))"],
    ['mixed nested s-expressions', "'((atom turkey) or)", "((atom turkey) or)"],
    ['mixed nested s-expressions', "'(or (atom turkey))", "(or (atom turkey))"],
    ['empty list', "'()", "()"],
    ['nested empty lists', "'(() () () ())", "(() () () ())"],
    ['car of list length 1', "(car '(a))", 'a'],
    ['car of list length 2', "(car '(a b))", 'a'],
    ['car of list length 3', "(car '(a b c))", 'a'],
    ['car of lst starting with list', "(car '((a b c) x y z))", '(a b c)'],
    ['car of string atom', "(car 'a)", { error: 'Cannot get the car of atom "a"' }],
    ['car of empty list', "(car '())", { error: 'Cannot get the car of an empty list' }],
    ['car of list with mixed s-expression', "(car '(((hotdogs)) (and) (pickle) relish))", '((hotdogs))'],
    ['nested car expressions', "(car (car '((a))))", 'a'],
    ['nested car expressions', "(car (car (car '(((a))))))", 'a'],
    ['nested car expressions', "(car (car '( ((hotdogs)) ((and)) ) ))", '(hotdogs)'],
    ['car of integer atom', "(car 1234)", { error: 'Cannot get the car of atom "1234"' }],
    ['invalid nested car', "(car (car '(a)))", { error: 'Cannot get the car of returned atom "a"' }],
    ['cdr', "(cdr '(a b c))", '(b c)'],
    ['cdr', "(cdr '((a b c) x y z))", '(x y z)'],
    ['cdr', "(cdr '(hamburger))", '()'],
    ['cdr', "(cdr '((x) t r))", '(t r)'],
    ['cdr', "(cdr 'hotdogs)", { error: 'Cannot get the cdr of atom "hotdogs"'}],
    ['cdr', "(cdr '())", { error: 'Cannot get the cdr of an empty list'}],
    ['nested cdr', "(cdr (cdr '(a b c)))", '(c)'],
    ['nested cdr error', "(cdr (cdr '(a)))", { error: 'Cannot get the cdr of the returned empty list'}],
  ];

  tests.forEach(([description, code, expectedOutput, config = { isOnly: false }]) => {
    const method = config.isOnly ? it.only : it;
    const isErrorTest = typeof expectedOutput === 'object';
    const outputDescription = isErrorTest
      ? chalk.red(expectedOutput.error)
      : chalk.yellow(expectedOutput)

    method(`${chalk.cyan(description)}: ${chalk.blue(code)} -> ${outputDescription}`, () => {
      if (isErrorTest) {
        expect(() => run(code)).toThrow(expectedOutput.error);
      } else {
        expect(run(code)).toEqual(expectedOutput);
      }
    });
  });
});
