import { expect } from 'earljs';
import { run } from './run';

type RunConfig = [code: string, expectedOutput: string];

describe('run', () => {
  const tests: RunConfig[] = [
    ["'atom", "'atom"],
    ["'turkey", "'turkey"],
  ];

  tests.forEach(([code, expectedOutput]) => {
    it(`runs: ${code}`, () => {
      expect(run(code)).toEqual(expectedOutput);
    });
  });
});
