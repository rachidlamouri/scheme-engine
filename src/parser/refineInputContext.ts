import { Input } from '../interpreterNodes/input';
import { InputContext } from '../language/compiled/SchemeParser';
import { refineEvaluableGroupContext } from './refineEvaluableContext';
import { refineImportDeclarationGroupContext } from './refineImportDeclarationGroupContext';

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
