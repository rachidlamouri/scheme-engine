import { tokenize } from './tokenize';
import { parse } from './parse';
import { Evaluable } from './interpreterNodes/evaluable';
import { interpret, InterpretedResult } from './interpret';
import { ExecutionContext } from './interpreterNodes/executionContext';

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

  const executionContext = new ExecutionContext();
  executionContext.log(code);
  executionContext.logNewline();

  let result: InterpretedResult | null = null;
  let error: unknown;
  try {
    result = interpret(executionContext, evaluables)
  } catch (e) {
    executionContext.log(`Error: ${e instanceof Error ? e.message : '?'}`);
    error = e;
  }

  executionContext.dumpTableToLog();
  executionContext.writeLog();

  if (result === null) {
    throw error;
  }

  return result;
}
