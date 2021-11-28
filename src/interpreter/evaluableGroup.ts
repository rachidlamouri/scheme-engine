import { EvaluableGroupContext, EvaluableContext } from '../language/compiled/SchemeParser';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { SymbolicExpression, isSymbolicExpression } from './symbolicExpression';
import { buildParseGroupParentContext } from './utils';

const parseParentContext = buildParseGroupParentContext<
  Evaluable,
  EvaluableContext,
  typeof parseEvaluableParentContext,
  'evaluableGroup',
  EvaluableGroupContext
>(
  parseEvaluableParentContext,
  'evaluableGroup',
);

type EvaluableParentContext = Parameters<typeof parseParentContext>[0];

export const parseEvaluableGroupParentContext = (parentContext: EvaluableParentContext): SymbolicExpression[] => parseParentContext(parentContext).map((evaluable) => (
  isSymbolicExpression(evaluable)
    ? evaluable
    : evaluable.evaluate()
));
