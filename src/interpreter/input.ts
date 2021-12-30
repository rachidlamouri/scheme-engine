import { InputContext } from '../language/compiled/SchemeParser';
import { Evaluable } from './evaluable';
import { refineEvaluableGroupContext } from './evaluableGroup';
import { ImportDeclaration, refineImportDeclarationGroupContext } from './importDeclarationGroup';

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
