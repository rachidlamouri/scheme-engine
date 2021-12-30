import { InputContext } from '../language/compiled/SchemeParser';
import { Evaluable } from './evaluable';
import { refineEvaluableGroupContext } from './refineEvaluableContext';
import { ImportDeclaration, refineImportDeclarationGroupContext } from './importDeclaration';

type Input = {
  importDeclarations: ImportDeclaration[];
  evaluables: Evaluable[],
};

export const refineInputContext = (inputContext: InputContext): Input => {
  const importDeclarationGroupContext = inputContext.importDeclarationGroup();
  const evaluableGroupContext = inputContext.evaluableGroup();

  return {
    importDeclarations: importDeclarationGroupContext !== undefined
      ? refineImportDeclarationGroupContext(importDeclarationGroupContext)
      : [],
    evaluables:  evaluableGroupContext !== undefined
      ? refineEvaluableGroupContext(evaluableGroupContext)
      : []
  }
};
