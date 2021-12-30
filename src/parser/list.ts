import { List } from '../interpreterNodes/list';
import { ListContext } from '../language/compiled/SchemeParser';
import { refineSymbolicExpressionGroupContext } from './symbolicExpression';

export const refineListContext = (listContext: ListContext): List => {
  const symbolicExpressionGroupContext = listContext.symbolicExpressionGroup();

  return new List(
    symbolicExpressionGroupContext !== undefined
      ? refineSymbolicExpressionGroupContext(symbolicExpressionGroupContext)
      : []
  );
}
