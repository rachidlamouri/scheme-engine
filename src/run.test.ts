import { expect } from 'earljs';
import chalk from 'chalk';
import { run } from './run';

type MochaConfig = {
  isOnly: boolean;
}

type RunConfig =
  [description: string, code: string, expectedOutput: string]
  | [description: string, code: string, expectedOutput: string, config: MochaConfig];

describe('run', () => {
  const tests: RunConfig[] = [
    ['string', "'atom", 'atom'],
    ['string', "'turkey", 'turkey'],
    ['integer', "'1492", '1492'],
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
    ['car of list length 1', '(car (a))', 'a'],
    ['car of list length 2', '(car (a b))', 'a'],
    ['car of list length 3', '(car (a b c))', 'a'],
    ['car of lst starting with list', '(car ((a b c) x y z))', '(a b c)'],
    ['car of list with mixed s-expression', '(car (((hotdogs)) (and) (pickle) relish))', '((hotdogs))'],
  ];

  tests.forEach(([description, code, expectedOutput, config = { isOnly: false }]) => {
    const method = config.isOnly ? it.only : it;
    method(`${chalk.cyan(description)}: ${chalk.blue(code)} -> ${chalk.yellow(expectedOutput)}`, () => {
      expect(run(code)).toEqual(expectedOutput);
    });
  });
});
