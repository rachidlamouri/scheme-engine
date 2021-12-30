import { tokenize } from './tokenize';
import { parse } from './parse';
import { Evaluable, executionContext, interpret, refineRootAstNode } from './interpreter/';

const tokenizeAndParse = (code: string): Evaluable[] => {
  const tokens = tokenize(code);
  const rootAstNode = parse(tokens);
  const refinedRootAstNode = refineRootAstNode(rootAstNode);

  const importedEvaluables =
    refinedRootAstNode.importDeclarations.map((importDeclaration) => importDeclaration.loadCode())
    .flatMap((importedCode) => tokenizeAndParse(importedCode));

  return [
    ...importedEvaluables,
    ...refinedRootAstNode.evaluables,
  ];
}

export const run = (code: string): string => {
  executionContext.reset();
  const evaluables = tokenizeAndParse(code);
  const result = interpret(evaluables);
  return result;
}
