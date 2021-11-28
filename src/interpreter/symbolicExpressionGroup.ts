import { SymbolicExpressionContext, SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { buildParseGroupParentContext } from './utils';

export const parseSymbolicExpressionGroupParentContext = buildParseGroupParentContext<
  SymbolicExpression,
  SymbolicExpressionContext,
  typeof parseSymbolicExpressionParentContext,
  'symbolicExpressionGroup',
  SymbolicExpressionGroupContext
>(
  parseSymbolicExpressionParentContext,
  'symbolicExpressionGroup'
);
