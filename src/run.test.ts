import { expect } from 'earljs';
import { run } from './run';

type MochaConfig = {
  isOnly: boolean;
}

type RunConfig =
  [code: string, expectedOutput: string]
  | [code: string, expectedOutput: string, config: MochaConfig];

describe('run', () => {
  const tests: RunConfig[] = [
    ["'atom", 'atom'],
    ["'turkey", 'turkey'],
    ["'1492", '1492'],
    ["'u", 'u'],
    ["'*abc$", '*abc$'],
    ["'(atom)", "(atom)"],
    ["'(atom turkey or)", "(atom turkey or)"],
    ["'((atom))", "((atom))"],
    ["'((atom turkey))", "((atom turkey))"],
    ["'((atom turkey) or)", "((atom turkey) or)"],
    ["'(or (atom turkey))", "(or (atom turkey))"],
    ["'()", "()"],
    ["'(() () () ())", "(() () () ())"],
    ['(car (a))', 'a'],
    ['(car (a b))', 'a'],
    ['(car (a b c))', 'a'],
  ];

  tests.forEach(([code, expectedOutput, config = { isOnly: false }]) => {
    const method = config.isOnly ? it.only : it;
    method(`${code} -> ${expectedOutput}`, () => {
      expect(run(code)).toEqual(expectedOutput);
    });
  });
});
