import { Input } from '../interpreterNodes/input';
import { InputContext } from '../language/compiled/SchemeParser';
import { refineEvaluableGroupContext } from './evaluable';
import { refineImportDeclarationGroupContext } from './importDeclarationGroup';

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
