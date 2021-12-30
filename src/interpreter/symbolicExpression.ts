import { SymbolicExpressionContext } from '../language/compiled/SchemeParser';
import { List, refineListContext } from './list';
import { Atom, refineAtomContext } from './atom';
import { UnreachableError } from './utils';

export type SymbolicExpression = List | Atom;

export const isSymbolicExpression = (arg: any): arg is SymbolicExpression => arg instanceof List || arg instanceof Atom;

export const refineSymbolicExpressionContext = (symbolicExpressionContext: SymbolicExpressionContext): SymbolicExpression => {
  const listContext = symbolicExpressionContext.list();
  const atomContext = symbolicExpressionContext.atom();

  if (listContext !== undefined && atomContext === undefined) {
    return refineListContext(listContext);
  } else if (listContext === undefined && atomContext !== undefined) {
    return refineAtomContext(atomContext);
  }

  throw new UnreachableError();
};
