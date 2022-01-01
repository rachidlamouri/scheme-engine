import { expect } from 'earljs';
import chalk from 'chalk';
import { run } from './run';
import { Evaluable } from './interpreterNodes/evaluable';
import { BooleanAtom, IntegerAtom, ReferenceAtom, StringAtom } from './interpreterNodes/atom';
import { List } from './interpreterNodes/list';

type MochaConfig = {
  isOnly?: boolean;
  isSkipped?: never;
} | {
  isOnly?: never;
  isSkipped?: boolean;
}

class ExpectedError {
  constructor(public readonly message: string) {}
}

// "expectedEvaluables" is used to verify the data types of the output when necessary
type RunConfig =
  | [isFromBook: boolean, description: string, code: string, expectedOutput: ExpectedError, expectedEvaluables?: null]
  | [isFromBook: boolean, description: string, code: string, expectedOutput: ExpectedError, expectedEvaluables?: null, config?: MochaConfig]
  | [isFromBook: boolean, description: string, code: string, expectedOutput: string, expectedEvaluables?: Evaluable[] | null]
  | [isFromBook: boolean, description: string, code: string, expectedOutput: string, expectedEvaluables?: Evaluable[] | null, config?: MochaConfig];

const t = true;
const f = false;

const runTest = ([isFromBook, description, code, expectedOutput, expectedEvaluables = null, config = { isOnly: false }]: RunConfig) => {
  const method = config.isOnly ? it.only : it;
  const prefix = isFromBook ? '*' : ' ';

  let outputDescription: string;
  let evaluateResult: () => void;

  if (expectedOutput instanceof ExpectedError) {
    outputDescription = chalk.red(expectedOutput.message)

    evaluateResult = () => {
      expect(() => run(code)).toThrow(expectedOutput.message);
    };
  } else {
    outputDescription =
      chalk.yellow(expectedOutput)
        .split('\n')
        .join(chalk.cyan('\\n'));

    evaluateResult = () => {
      const result = run(code);

      expect(result.serialize()).toEqual(expectedOutput);

      if (expectedEvaluables !== null) {
        expect(result.evaluables).toEqual(expectedEvaluables);
      }
    };
  }

  method(`${prefix} ${chalk.cyan(description)}: ${chalk.blue(code)} -> ${outputDescription}`, evaluateResult);
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

type SuiteSetup = {
  prependCode: string;
}

const runSuiteWithSetup = (suiteName: string, setup: SuiteSetup, tests: RunConfig[], config?: MochaConfig) => {
  tests.forEach((testConfig) => {
    const codeTupleIndex = 2;
    const code = testConfig[codeTupleIndex];
    testConfig[codeTupleIndex] = `${setup.prependCode} ${code}`;

    runTest(testConfig);
  });

  runSuite(suiteName, tests, config);
}

process.stdout.write(`${chalk.gray('*')}: denotes test from The Little Schemer`);

describe('run', () => {
  runSuite('literals', [
    [t, 'string', "'atom", 'atom', [new StringAtom('atom')]],
    [t, 'string', "'turkey", 'turkey'],
    [f, 'uppercase string', "'TURKEY", 'TURKEY'],
    [t, 'integer', "'1492", '1492', [new IntegerAtom(1492)]],
    [f, 'unquoted integer', "1492", '1492', [new IntegerAtom(1492)]],
    [t, 'single character', "'u", 'u'],
    [t, 'special characters', "'*abc$", '*abc$'],
    [t, 'list', "'(atom)", '(atom)', [new List([new StringAtom('atom')])]],
    [t, 'list of atoms', "'(atom turkey or)", '(atom turkey or)'],
    [f, 'nested list', "'((atom))", '((atom))'],
    [t, 'nested list of atoms', "'((atom turkey))", '((atom turkey))'],
    [f, 'mixed nested s-expressions', "'((atom turkey) or)", '((atom turkey) or)'],
    [f, 'mixed nested s-expressions', "'(or (atom turkey))", '(or (atom turkey))'],
    [t, 'empty list', "'()", '()'],
    [t, 'nested empty lists', "'(() () () ())", '(() () () ())'],
    [f, 'true', '#t', '#t', [new BooleanAtom(true)]],
    [f, 'false', '#f', '#f', [new BooleanAtom(false)]],
    [f, 'list of booleans', "'(#t #f)", '(#t #f)', [
      new List([
        new BooleanAtom(true),
        new BooleanAtom(false),
      ]),
    ]],
  ]);

  runSuite('car', [
    [f, 'list of length 1', "(car '(a))", 'a'],
    [f, 'list of  length 2', "(car '(a b))", 'a'],
    [t, 'list of  length 3', "(car '(a b c))", 'a'],
    [t, 'list starting with list', "(car '((a b c) x y z))", '(a b c)'],
    [t, 'string atom', "(car 'hotdog)", new ExpectedError('Parameter 0 of car cannot be an atom')],
    [t, 'empty list', "(car '())", new ExpectedError('Parameter 0 of car cannot be an empty list')],
    [t, 'list with mixed s-expression', "(car '(((hotdogs)) (and) (pickle) relish))", '((hotdogs))'],
    [f, 'nested car expressions', "(car (car '((a))))", 'a'],
    [f, 'nested car expressions', "(car (car (car '(((a))))))", 'a'],
    [f, 'nested car expressions', "(car (car '( ((hotdogs)) ((and)) ) ))", '(hotdogs)'],
    [f, 'integer atom', "(car 1234)", new ExpectedError('Parameter 0 of car cannot be an atom')],
    [f, 'invalid nested car', "(car (car '(a)))", new ExpectedError('Parameter 0 of car cannot be an atom')],
    [f, 'wrong number of parameters', "(car '(a) '(a))", new ExpectedError('car requires 1 parameter(s), but received 2')],
  ]);

  runSuite('cdr', [
    [t, 'list', "(cdr '(a b c))", '(b c)'],
    [t, 'car of list is list', "(cdr '((a b c) x y z))", '(x y z)'],
    [t, 'list with one atom', "(cdr '(hamburger))", '()'],
    [t, 'car of list is list', "(cdr '((x) t r))", '(t r)'],
    [t, 'atom', "(cdr 'hotdogs)", new ExpectedError('Parameter 0 of cdr cannot be an atom')],
    [t, 'empty list', "(cdr '())", new ExpectedError('Parameter 0 of cdr cannot be an empty list')],
    [f, 'nested cdr', "(cdr (cdr '(a b c)))", '(c)'],
    [f, 'nested cdr error', "(cdr (cdr '(a)))", new ExpectedError('Parameter 0 of cdr cannot be an empty list')],
    [t, 'nested car and cdr', "(car (cdr '((b) (x y) ((c))) ))", '(x y)'],
    [t, 'nested cdr', "(cdr (cdr '((b) (x y) ((c))) ))", '(((c)))'],
    [t, 'nested cdr and car', "(cdr (car '(a (b (c)) d) ))", new ExpectedError('Parameter 0 of cdr cannot be an atom')],
  ]);

  runSuite('cons', [
    [t, 'atom and list', "(cons 'peanut '(butter and jelly))", '(peanut butter and jelly)'],
    [t, 'list and list', "(cons '(banana and) '(peanut butter and jelly))", '((banana and) peanut butter and jelly)'],
    [t, 'list and list', "(cons '((help) this) '(is very ((hard) to learn)) )", '(((help) this) is very ((hard) to learn))'],
    [t, 'list and empty list', "(cons '(a b (c)) '() )", '((a b (c)))'],
    [t, 'atom and empty list', "(cons 'a '() )", '(a)'],
    [t, 'list and atom', "(cons '((abcd)) 'b )", new ExpectedError('Parameter 1 of cons cannot be an atom')],
    [t, 'atom and atom', "(cons 'a 'b )", new ExpectedError('Parameter 1 of cons cannot be an atom')],
    [f, 'one parameter', "(cons 'a)", new ExpectedError('cons requires 2 parameter(s), but received 1')],
    [t, 'cons of car', "(cons 'a (car '((b) c d) ))", '(a b)'],
    [t, 'cons of cdr', "(cons 'a (cdr '((b) c d) ))", '(a c d)'],
  ]);

  runSuite('null?', [
    [t, 'empty list', "(null? '())", '#t', [new BooleanAtom(true)]],
    [t, 'non empty list', "(null? '(a b c))", '#f', [new BooleanAtom(false)]],
    [t, 'atom', "(null? 'a)", new ExpectedError('Parameter 0 of null? cannot be an atom')],
    [f, 'nested null?', "(null? (null? '()))", new ExpectedError('Parameter 0 of null? cannot be an atom')],
    [f, 'null? and car', "(null? (car '(a b c)))", new ExpectedError('Parameter 0 of null? cannot be an atom')],
    [f, 'car and null?', "(car (null? '(a b c)))", new ExpectedError('Parameter 0 of car cannot be an atom')],
    [f, 'null? and cdr', "(null? (cdr '(a b c)))", '#f'],
    [f, 'cdr and null?', "(cdr (null? '(a b c)))", new ExpectedError('Parameter 0 of cdr cannot be an atom')],
    [f, 'null? and cons', "(null? (cons 'a '()))", '#f'],
    [f, 'cons and null?', "(cons (null? '(a b c)) '())", '(#f)'],
    [f, 'cons and null?', "(cons 'a (null? '()))", new ExpectedError('Parameter 1 of cons cannot be an atom')],
  ]);

  runSuite('atom?', [
    [t, 'atom', "(atom? 'Harry)", '#t', [new BooleanAtom(true)]],
    [f, 'integer atom', "(atom? 1234)", '#t', [new BooleanAtom(true)]],
    [t, 'list', "(atom? '(Harry had a heap of apples))", '#f', [new BooleanAtom(false)]],
    [f, 'empty list', "(atom? '())", '#f'],
    [t, 'atom? and car', "(atom? (car '(Harry had a heap of apples) ))", '#t'],
    [t, 'atom? and cdr', "(atom? (cdr '(Harry had a heap of apples) ))", '#f'],
    [t, 'atom? and cdr', "(atom? (cdr '(Harry) ))", '#f'],
    [t, 'atom?, car and cdr', "(atom? (car (cdr '(swing low sweet cherry oat) )))", '#t'],
    [t, 'atom?, car and cdr', "(atom? (car (cdr '(swing (low sweet) cherry oat) )))", '#f'],
    [f, 'nested atom?', "(atom? (atom? '()))", '#t'],
  ]);

  runSuite('eq?', [
    [t, 'atoms', "(eq? 'Harry 'Harry)", '#t'],
    [t, 'atoms', "(eq? 'margarine 'butter)", '#f'],
    [t, 'lists', "(eq? '() '(strawberry))", new ExpectedError('Parameter 0 of eq? cannot be a list')],
    [f, 'lists', "(eq? '() '())", new ExpectedError('Parameter 0 of eq? cannot be a list')],
    [f, 'lists', "(eq? '(strawberry) '(strawberry))", new ExpectedError('Parameter 0 of eq? cannot be a list')],
    [f, 'numbers', "(eq? 6 6)", new ExpectedError('Parameter 0 of eq? cannot be an integer atom')],
    [f, 'number and string', "(eq? 'a 6)", new ExpectedError('Parameter 1 of eq? cannot be an integer atom')],
    [f, 'one parameter', "(eq? 'a)", new ExpectedError('eq? requires 2 parameter(s), but received 1')],
    [t, 'eq? and car', "(eq? (car '(Mary had a little lamb chop)) 'Mary)", '#t'],
    [t, 'eq? and cdr', "(eq? (cdr '(soured milk)) 'milk)", new ExpectedError('Parameter 0 of eq? cannot be a list')],
    [t, 'eq?, car and cdr', "(eq? (car '(beans beans we need jelly beans)) (car (cdr '(beans beans we need jelly beans))))", '#t'],
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
      '#t',
      '#f',
      '#t',
    ].join('\n')],
  ]);

  runSuite('lambda definitions', [
    [f, 'basic definition', "(define myLambda (lambda () 'atom))", '&myLambda', [new ReferenceAtom('myLambda')]],
    [f, 'definition with one argument', '(define echoLiteral (lambda (a) a))', '&echoLiteral'],
    [f, 'definition with multiple arguments', '(define echoLiterals (lambda (a b) (cons a b)))', '&echoLiterals'],
    [f, 'repeated references', "(define abc (lambda () 'a)) (define abc (lambda () 'b))", new ExpectedError('Reference "abc" already exists')],
  ]);

  runSuite('lambda executions', [
    [f, 'basic execution', "(define myLambda (lambda () 'atom)) (myLambda)", '&myLambda\natom'],
    [f, 'execution with one argument', "(define echoLiteral (lambda (a) a)) (echoLiteral 'turkey)", '&echoLiteral\nturkey'],
    [f, 'execution with multiple arguments', "(define echoLiterals (lambda (a b) (cons a b))) (echoLiterals 'I '(like cookies))", '&echoLiterals\n(I like cookies)'],
    [f, 'execution with invalid number of arguments', "(define echoLiterals (lambda (a b) (cons a b))) (echoLiterals 'a)", new ExpectedError('echoLiterals requires 2 parameter(s), but received 1')],
    [f, 'invalid reference', "(abc)", new ExpectedError('Invalid reference "abc"')],
    [f, 'invalid execution', "(define invokeInvalid (lambda (abc) (abc))) (invokeInvalid 'a)", new ExpectedError('"abc" is not callable')],
    [f, 'recursive lambda', "(define iterate (lambda (l) (cond ((null? l) 'done) (else (iterate (cdr l)))))) (iterate '(a b))", '&iterate\ndone'],
    [f, 'same lambda multiple times', "(define echo (lambda (l) l)) (echo 'a) (echo 'b)", '&echo\na\nb'],
    [f, 'independent similarly named references', "(define echoA (lambda (l) l)) (define echoB (lambda (l) l)) (echoA 'a) (echoB '())", '&echoA\n&echoB\na\n()']
  ]);

  runSuite('variable scope', [
    [f, 'outside of current stack frame (fnB calls fnA)', "(define fnA (lambda (a) a)) (define fnB (lambda (b) (fnA b))) (fnB 'c)", '&fnA\n&fnB\nc', null],
    [f, 'outside of closure (a is not in fnB)', "(define fnA (lambda (a) a)) (define fnB (lambda (b) (cons a b))) (fnB '(d))", new ExpectedError('Invalid reference "a"')],
    [f, 'outside of closure (fnA cannot access fnB)', "(define fnA (lambda (a) (fnB a))) (define fnB (lambda (b) b)) (fnA 'c)", new ExpectedError('Invalid reference "fnB"')],
    [f, 'same reference key in different stack frame (two fnA keys)', "(define fnA (lambda (a) a)) (define fnB (lambda (fnA) (car fnA))) (fnB '(c))", '&fnA\n&fnB\nc'],
  ]);

  runSuite('import', [
    [f, 'single import', "(import importExamples/exampleA)", '&exampleA'],
    [f, 'single import and execute', "(import importExamples/exampleA) (exampleA '(a b c))", '&exampleA\na'],
    [f, 'multiple import', "(import importExamples/exampleA importExamples/exampleB)", '&exampleA\n&exampleB'],
    [f, 'multiple import and execute', "(import importExamples/exampleA importExamples/exampleB) (exampleA (exampleB '(a b c)))", '&exampleA\n&exampleB\nb'],
    [f, 'invalid import', "(import importExamples/exampleABC)", new ExpectedError('Standard library "standardLibrary/importExamples/exampleABC" does not exist')],
  ]);

  runSuite('cond', [
    [f, 'one predicate that stops at if', "(cond ((null? '()) 'a) (else 'b))", 'a'],
    [f, 'one predicate that reaches else', "(cond ((null? '(1 2 3)) 'a) (else 'b))", 'b'],
    [f, 'multiple predicates that stop at if', "(cond ((null? '()) 'a) ((atom? '()) 'b) (else 'c))", 'a'],
    [f, 'multiple predicates that stop at elseif', "(cond ((null? '(1 2 3)) 'a) ((atom? '1) 'b) (else 'c))", 'b'],
    [f, 'multiple predicates that stop at else', "(cond ((null? '(1 2 3)) 'a) ((atom? '()) 'b) ((eq? 'x 'y) 'c) (else 'd))", 'd'],
    [f, 'invalid predicate', "(cond ((null? '(1 2 3)) 'a) ((car '(1 2 3)) 'b) (else 'c))", new ExpectedError('cond condition 1 did not return a boolean')],
  ]);

  runSuiteWithSetup('lat?', {
    prependCode: '(import lat/lat)',
  }, [
    [t, 'list with only atoms', "(lat? '(Jack Sprat could eat no chicken fat))", '&lat?\n#t'],
    [t, 'list with a list', "(lat? '((Jack) Sprat could eat no chicken fat))", '&lat?\n#f'],
    [t, 'list with a list', "(lat? '(Jack (Sprat could) eat no chicken fat))", '&lat?\n#f'],
    [t, 'empty list', "(lat? '())", '&lat?\n#t'],
    [f, 'list with one atom', "(lat? '(a))", '&lat?\n#t'],
    [f, 'list with one list', "(lat? '((a)))", '&lat?\n#f'],
    [t, 'list with only atoms', "(lat? '(bacon and eggs))", '&lat?\n#t'],
  ]);
});
