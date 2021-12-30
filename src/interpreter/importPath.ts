import { ImportPathContext, ImportPathGroupContext } from '../language/compiled/SchemeParser';
import { buildRefineGroupContext, NormalizedGroupContext } from './utils';

export const refineImportPath = (importPathContext: ImportPathContext): string => (
  importPathContext.IMPORT_PATH().text
);

export const refineImportPathGroup = buildRefineGroupContext<
  ImportPathContext,
  ImportPathGroupContext,
  string
>(
  (importPathGroupContext: ImportPathGroupContext): NormalizedGroupContext<ImportPathContext, ImportPathGroupContext> => ({
    elementContext: importPathGroupContext.importPath(),
    groupContext: importPathGroupContext.importPathGroup(),
  }),
  refineImportPath,
);
