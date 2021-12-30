import { ImportPathContext } from '../language/compiled/SchemeParser';

export const refineImportPath = (importPathContext: ImportPathContext): string => (
  importPathContext.IMPORT_PATH().text
);
