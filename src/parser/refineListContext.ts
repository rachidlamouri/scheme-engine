import { List } from '../interpreterNodes/list';
import { ListContext } from '../language/compiled/SchemeParser';
import { refineLiteralGroupContext } from './refineLiteralContext';

export const refineListContext = (listContext: ListContext): List => {
  const literalGroupContext = listContext.literalGroup();

  return new List(
    literalGroupContext !== undefined
      ? refineLiteralGroupContext(literalGroupContext)
      : []
  );
}
