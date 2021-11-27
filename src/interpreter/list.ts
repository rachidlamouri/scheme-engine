import { ListContext } from '../language/compiled/SchemeParser';
import { SymbolicExpression } from './symbolicExpression';
import { SymbolicExpressionGroup } from './symbolicExpressionGroup';
import { ParentContext } from './utils';

type ChildListContext = ListContext | undefined;

type ListParentContext<TChildContext extends ChildListContext> =
  [TChildContext] extends [ListContext]
    ? ParentContext<'list', ListContext>
    : ParentContext<'list', ListContext | undefined>;

type ParsedListContext<TChildContext extends ChildListContext> =
  [TChildContext] extends [ListContext]
    ? List
    : List | null;
export class List {
  static parseParentContext = <
    TChildContext extends ChildListContext
  >(parentContext: ListParentContext<TChildContext>): ParsedListContext<TChildContext> => {
    const listContext = parentContext.list();

    if (listContext !== undefined) {
      const symbolicExpressionGroup = SymbolicExpressionGroup.parseParentContext(listContext);
      return new List(symbolicExpressionGroup?.toArray() ?? []);
    }

    return null as ParsedListContext<TChildContext>;
  };

  constructor(private contents: SymbolicExpression[]) {}

  car() {
    return this.contents[0];
  }

  isEmpty() {
    return this.contents.length === 0;
  }

  toString(): string {
    const contentsText = this.contents.map((item) => item.toString()).join(' ');
    return `(${contentsText})`;
  }
}
