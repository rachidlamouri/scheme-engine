import fs from 'fs';
import { ImportDeclarationGroupContext } from '../language/compiled/SchemeParser';
import { refineImportPathGroup } from './importPathGroup';

export class ImportDeclaration {
  constructor(private importPath: string) {}

  get filePath() {
    // From root of project
    return `standardLibrary/${this.importPath}`
  }

  loadCode() {
    if (!fs.existsSync(this.filePath)) {
      throw Error(`Standard library "${this.filePath}" does not exist`);
    }

    return fs.readFileSync(this.filePath, 'utf8');
  }
}

export const refineImportDeclarationGroupContext = (importDeclarationGroupContext: ImportDeclarationGroupContext): ImportDeclaration[] => (
  refineImportPathGroup(importDeclarationGroupContext.importPathGroup())
    .map((importPath) => new ImportDeclaration(importPath))
);
