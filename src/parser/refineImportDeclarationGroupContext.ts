import { ImportDeclaration } from '../interpreterNodes/importDeclaration';
import { ImportDeclarationGroupContext } from '../language/compiled/SchemeParser';
import { refineImportPathGroup } from './refineImportContext';

export const refineImportDeclarationGroupContext = (importDeclarationGroupContext: ImportDeclarationGroupContext): ImportDeclaration[] => (
  refineImportPathGroup(importDeclarationGroupContext.importPathGroup())
    .map((importPath) => new ImportDeclaration(importPath))
);
