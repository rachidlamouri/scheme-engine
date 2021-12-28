import { ListContext } from '../language/compiled/SchemeParser';
import { SymbolicExpression } from './symbolicExpression';
import { parseSymbolicExpressionGroupParentContext } from './symbolicExpressionGroup';
import { BooleanAtom } from './atom';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

export class List {
  static parseParentContext = <
    TChildContext extends OptionalChildContext<ListContext>
  >(parentContext: NodeParentContext<ListContext, TChildContext, 'list'>): ParsedNode<List, ListContext, TChildContext> => {
    const listContext = parentContext.list();

    if (listContext !== undefined) {
      const contents = parseSymbolicExpressionGroupParentContext(listContext)
      return new List(contents);
    }

    return null as ParsedNode<List, ListContext, TChildContext>;
  };

  constructor(private contents: SymbolicExpression[]) {}

  car(): SymbolicExpression {
    return this.contents[0];
  }

  cdr(): List {
    return new List(this.contents.slice(1));
  }

  cons(symbolicExpression: SymbolicExpression): List {
    return new List([symbolicExpression, ...this.contents]);
  }

  evaluate(): SymbolicExpression {
    return this;
  }

  isAtom() {
    return new BooleanAtom(false);
  }

  isEmpty() {
    return this.contents.length === 0;
  }

  isNull() {
    return new BooleanAtom(this.isEmpty());
  }

  toString(): string {
    const contentsText = this.contents.map((item) => item.toString()).join(' ');
    return `(${contentsText})`;
  }
}
