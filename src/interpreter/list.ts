import { ListContext } from '../language/compiled/SchemeParser';
import { SymbolicExpressionGroup } from './symbolicExpressionGroup';
import { ParentContext } from './utils';

type ChildListContext = ListContext | undefined;

type ListParentContext<TChildContext> =
  [TChildContext] extends [ListContext]
    ? ParentContext<'list', ListContext>
    : ParentContext<'list', ListContext | undefined>

type ParsedList<TChildContext extends ChildListContext> =
  [TChildContext] extends [ListContext]
    ? List
    : List | null

export class List {
  static parseParentContext = <
    TChildContext extends ChildListContext
  >(parentContext: ListParentContext<TChildContext>): ParsedList<TChildContext> => {
    const listContext = parentContext.list();

    if (listContext !== undefined) {
      return new List(listContext);
    }

    return null as ParsedList<TChildContext>;
  }

  protected symbolicExpressionGroup: SymbolicExpressionGroup | null;

  constructor(listContext: ListContext) {
    this.symbolicExpressionGroup = SymbolicExpressionGroup.parseParentContext(listContext);
  }

  first() {
    return this.symbolicExpressionGroup?.first() ?? null;
  }

  toString(): string {
    const groupText = this.symbolicExpressionGroup?.toString() ?? '';
    return `(${groupText})`;
  }
}
