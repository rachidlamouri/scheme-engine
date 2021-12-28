import { expect } from 'earljs';
import chalk from 'chalk';
import { run } from './run';

type MochaConfig = {
  isOnly?: boolean;
  isSkipped?: never;
} | {
  isOnly?: never;
  isSkipped?: boolean;
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
  let outputDescription = isErrorTest
    ? chalk.red(expectedOutput.error)
    : chalk.yellow(expectedOutput)
  outputDescription = outputDescription.split('\n').join(chalk.cyan('\\n'));

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
  let method: Mocha.SuiteFunction | Mocha.ExclusiveSuiteFunction | Mocha.PendingSuiteFunction;
  if (config !== undefined && config.isOnly) {
    method = describe.only;
  } else if (config !== undefined && config.isSkipped) {
    method = describe.skip;
  } else {
    method = describe;
  }

  method(suiteName, () => {
    tests.forEach(runTest);
  })
};

process.stdout.write(`${chalk.gray('*')}: denotes test from The Little Schemer`);

describe('run', () => {
  runSuite('literals', [
    [t, 'string', "'atom", 'atom'],
    [t, 'string', "'turkey", 'turkey'],
    [f, 'uppercase string', "'TURKEY", 'TURKEY'],
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
    [t, 'string atom', "(car 'hotdog)", { error: 'Parameter 0 of car cannot be an atom' }],
    [t, 'empty list', "(car '())", { error: 'Parameter 0 of car cannot be an empty list' }],
    [t, 'list with mixed s-expression', "(car '(((hotdogs)) (and) (pickle) relish))", '((hotdogs))'],
    [f, 'nested car expressions', "(car (car '((a))))", 'a'],
    [f, 'nested car expressions', "(car (car (car '(((a))))))", 'a'],
    [f, 'nested car expressions', "(car (car '( ((hotdogs)) ((and)) ) ))", '(hotdogs)'],
    [f, 'integer atom', "(car 1234)", { error: 'Parameter 0 of car cannot be an atom' }],
    [f, 'invalid nested car', "(car (car '(a)))", { error: 'Parameter 0 of car cannot be an atom' }],
    [f, 'wrong number of parameters', "(car '(a) '(a))", { error: 'car requires 1 parameter(s), but received 2'}]
  ]);

  runSuite('cdr', [
    [t, 'list', "(cdr '(a b c))", '(b c)'],
    [t, 'car of list is list', "(cdr '((a b c) x y z))", '(x y z)'],
    [t, 'list with one atom', "(cdr '(hamburger))", '()'],
    [t, 'car of list is list', "(cdr '((x) t r))", '(t r)'],
    [t, 'atom', "(cdr 'hotdogs)", { error: 'Parameter 0 of cdr cannot be an atom'}],
    [t, 'empty list', "(cdr '())", { error: 'Parameter 0 of cdr cannot be an empty list'}],
    [f, 'nested cdr', "(cdr (cdr '(a b c)))", '(c)'],
    [f, 'nested cdr error', "(cdr (cdr '(a)))", { error: 'Parameter 0 of cdr cannot be an empty list'}],
    [t, 'nested car and cdr', "(car (cdr '((b) (x y) ((c))) ))", '(x y)'],
    [t, 'nested cdr', "(cdr (cdr '((b) (x y) ((c))) ))", '(((c)))'],
    [t, 'nested cdr and car', "(cdr (car '(a (b (c)) d) ))", { error: 'Parameter 0 of cdr cannot be an atom' }],
  ]);

  runSuite('cons', [
    [t, 'atom and list', "(cons 'peanut '(butter and jelly))", '(peanut butter and jelly)'],
    [t, 'list and list', "(cons '(banana and) '(peanut butter and jelly))", '((banana and) peanut butter and jelly)'],
    [t, 'list and list', "(cons '((help) this) '(is very ((hard) to learn)) )", '(((help) this) is very ((hard) to learn))'],
    [t, 'list and empty list', "(cons '(a b (c)) '() )", '((a b (c)))'],
    [t, 'atom and empty list', "(cons 'a '() )", '(a)'],
    [t, 'list and atom', "(cons '((abcd)) 'b )", { error: 'Parameter 1 of cons cannot be an atom' }],
    [t, 'atom and atom', "(cons 'a 'b )", { error: 'Parameter 1 of cons cannot be an atom' }],
    [f, 'one parameter', "(cons 'a)", { error: 'cons requires 2 parameter(s), but received 1' }],
    [t, 'cons of car', "(cons 'a (car '((b) c d) ))", '(a b)'],
    [t, 'cons of cdr', "(cons 'a (cdr '((b) c d) ))", '(a c d)'],
  ]);

  runSuite('null?', [
    [t, 'empty list', "(null? '())", 'true'],
    [t, 'non empty list', "(null? '(a b c))", 'false'],
    [t, 'atom', "(null? 'a)", { error: 'Parameter 0 of null? cannot be an atom'}],
    [f, 'nested null?', "(null? (null? '()))", { error: 'Parameter 0 of null? cannot be an atom' }],
    [f, 'null? and car', "(null? (car '(a b c)))", { error: 'Parameter 0 of null? cannot be an atom' }],
    [f, 'car and null?', "(car (null? '(a b c)))", { error: 'Parameter 0 of car cannot be an atom' }],
    [f, 'null? and cdr', "(null? (cdr '(a b c)))", 'false'],
    [f, 'cdr and null?', "(cdr (null? '(a b c)))", { error: 'Parameter 0 of cdr cannot be an atom' }],
    [f, 'null? and cons', "(null? (cons 'a '()))", 'false'],
    [f, 'cons and null?', "(cons (null? '(a b c)) '())", '(false)'],
    [f, 'cons and null?', "(cons 'a (null? '()))", { error: 'Parameter 1 of cons cannot be an atom' }],
  ]);

  runSuite('atom?', [
    [t, 'atom', "(atom? 'Harry)", 'true'],
    [f, 'integer atom', "(atom? 1234)", 'true'],
    [t, 'list', "(atom? '(Harry had a heap of apples))", 'false'],
    [f, 'empty list', "(atom? '())", 'false'],
    [t, 'atom? and car', "(atom? (car '(Harry had a heap of apples) ))", 'true'],
    [t, 'atom? and cdr', "(atom? (cdr '(Harry had a heap of apples) ))", 'false'],
    [t, 'atom? and cdr', "(atom? (cdr '(Harry) ))", 'false'],
    [t, 'atom?, car and cdr', "(atom? (car (cdr '(swing low sweet cherry oat) )))", 'true'],
    [t, 'atom?, car and cdr', "(atom? (car (cdr '(swing (low sweet) cherry oat) )))", 'false'],
    [f, 'nested atom?', "(atom? (atom? '()))", 'true'],
  ]);

  runSuite('eq?', [
    [t, 'atoms', "(eq? 'Harry 'Harry)", 'true'],
    [t, 'atoms', "(eq? 'margarine 'butter)", 'false'],
    [t, 'lists', "(eq? '() '(strawberry))", { error: 'Parameter 0 of eq? cannot be a list' }],
    [f, 'lists', "(eq? '() '())", { error: 'Parameter 0 of eq? cannot be a list' }],
    [f, 'lists', "(eq? '(strawberry) '(strawberry))", { error: 'Parameter 0 of eq? cannot be a list' }],
    [f, 'numbers', "(eq? 6 6)", { error: 'Parameter 0 of eq? cannot be an integer atom' }],
    [f, 'number and string', "(eq? 'a 6)", { error: 'Parameter 1 of eq? cannot be an integer atom' }],
    [f, 'one parameter', "(eq? 'a)", { error: 'eq? requires 2 parameter(s), but received 1' }],
    [t, 'eq? and car', "(eq? (car '(Mary had a little lamb chop)) 'Mary)", 'true'],
    [t, 'eq? and cdr', "(eq? (cdr '(soured milk)) 'milk)", { error: 'Parameter 0 of eq? cannot be a list' }],
    [t, 'eq?, car and cdr', "(eq? (car '(beans beans we need jelly beans)) (car (cdr '(beans beans we need jelly beans))))", 'true'],
  ]);

  runSuite('independent expressions', [
    [f, 'atom literals', "'atom 'turkey", 'atom\nturkey'],
    [f, 'list literals', "'() '(a b c)", '()\n(a b c)'],
    [f, 'expressions', "(car '(a)) (cdr '(a b c))", 'a\n(b c)'],
    [f, 's-expressions', "'atom '() '(a b c) (car '(a)) (cdr '(a b c)) (cons 'a '(b c)) (null? '()) (atom? '()) (eq? 'a 'a)", [
      'atom',
      '()',
      '(a b c)',
      'a',
      '(b c)',
      '(a b c)',
      'true',
      'false',
      'true',
    ].join('\n')],
  ]);
});
