import { InputContext } from '../language/compiled/SchemeParser';
import { Evaluable } from './evaluableClass';
import { refineEvaluableGroupContext } from './evaluable';
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
