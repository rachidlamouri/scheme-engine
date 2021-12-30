import { ImportPathContext, ImportPathGroupContext } from '../language/compiled/SchemeParser';
import { refineImportPath } from './importPath';
import { buildRefineGroupContext, NormalizedGroupContext } from './utils';

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
