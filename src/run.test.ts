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
    ['car of list with mixed s-expression', "(car '(((hotdogs)) (and) (pickle) relish))", '((hotdogs))'],
    ['nested car expressions', "(car (car '((a))))", 'a'],
    ['nested car expressions', "(car (car (car '(((a))))))", 'a'],
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
