import { tokenize } from './tokenize';
import { parse } from './parse';
import { Evaluable } from './interpreterNodes/evaluable';
import { interpret, InterpretedResult } from './interpret';
import { globalExecutionContext } from './interpreterNodes/executionContext';

const tokenizeAndParse = (code: string): Evaluable[] => {
  const tokens = tokenize(code);
  const rootInterpreterNode = parse(tokens);

  const importedEvaluables =
    rootInterpreterNode.importDeclarations
      .map((importDeclaration) => importDeclaration.loadCode())
      .flatMap((importedCode) => tokenizeAndParse(importedCode));

  return [
    ...importedEvaluables,
    ...rootInterpreterNode.evaluables,
  ];
}

export const run = (code: string): InterpretedResult => {
  const evaluables = tokenizeAndParse(code);

  globalExecutionContext.reset();
  globalExecutionContext.log(code);
  globalExecutionContext.logNewline();

  let result: InterpretedResult | null = null;
  let error: unknown;
  try {
    result = interpret(evaluables)
  } catch (e) {
    globalExecutionContext.log('Error!');
    error = e;
  }

  globalExecutionContext.dumpTableToLog();
  globalExecutionContext.writeLog();

  if (result === null) {
    throw error;
  }

  return result;
}
