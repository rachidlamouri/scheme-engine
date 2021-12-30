import { SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { refineSymbolicExpressionContext, SymbolicExpression } from './symbolicExpression';

export const refineSymbolicExpressionGroupContext = (symbolicExpressionGroupContext: SymbolicExpressionGroupContext): SymbolicExpression[] => {
  const innerSymbolicExpressionGroupContext = symbolicExpressionGroupContext.symbolicExpressionGroup();

  const firstNode = refineSymbolicExpressionContext(symbolicExpressionGroupContext.symbolicExpression());
  const otherNodes = innerSymbolicExpressionGroupContext !== undefined ? refineSymbolicExpressionGroupContext(innerSymbolicExpressionGroupContext) : []

  return [firstNode, ...otherNodes];
};
