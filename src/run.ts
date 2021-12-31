import { tokenize } from './tokenize';
import { parse } from './parse';
import { Evaluable } from './interpreterNodes/evaluable';
import { interpret, InterpretedResult } from './interpret';

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
  const result = interpret(evaluables);
  return result;
}
