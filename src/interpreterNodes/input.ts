import { Evaluable } from './evaluable';
import { ImportDeclaration } from './importDeclaration';

export type Input = {
  importDeclarations: ImportDeclaration[];
  evaluables: Evaluable[],
};
