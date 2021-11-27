import { SymbolicExpressionContext, SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { ParentContext } from './utils';

type ChildSymbolicExpressionGroupContext = SymbolicExpressionGroupContext | undefined;

type SymbolicExpressionGroupParentContext<TChildContext> =
  [TChildContext] extends [SymbolicExpressionGroupContext]
    ? ParentContext<'symbolicExpressionGroup', SymbolicExpressionGroupContext>
    : ParentContext<'symbolicExpressionGroup', SymbolicExpressionGroupContext | undefined>

type ParsedSymbolicExpressionGroup<TChildContext extends ChildSymbolicExpressionGroupContext> =
  [TChildContext] extends [SymbolicExpressionGroupContext]
    ? SymbolicExpressionGroup
    : SymbolicExpressionGroup | null

export class SymbolicExpressionGroup {
  static parseParentContext = <
    TChildContext extends ChildSymbolicExpressionGroupContext
  >(parentContext: SymbolicExpressionGroupParentContext<TChildContext>): ParsedSymbolicExpressionGroup<TChildContext> => {
    const expressionContext = parentContext.symbolicExpressionGroup();

    if (expressionContext !== undefined) {
      return new SymbolicExpressionGroup(expressionContext);
    }

    return null as ParsedSymbolicExpressionGroup<TChildContext>;
  }

  private symbolicExpression: SymbolicExpression;
  private symbolicExpressionGroup: SymbolicExpressionGroup | null;

  constructor(symbolicExpressionGroupContext: SymbolicExpressionGroupContext) {
    this.symbolicExpression = parseSymbolicExpressionParentContext<SymbolicExpressionContext>(symbolicExpressionGroupContext);
    this.symbolicExpressionGroup = SymbolicExpressionGroup.parseParentContext(symbolicExpressionGroupContext);
  }

  first(): SymbolicExpression {
    return this.symbolicExpression;
  }

  toArray(): SymbolicExpression[] {
    if (this.symbolicExpressionGroup) {
      return [this.symbolicExpression, ...this.symbolicExpressionGroup.toArray()];
    }

    return [this.symbolicExpression];
  }

  toString(): string {
    const symbolicExpressionResult = this.symbolicExpression.toString();

    if (this.symbolicExpressionGroup) {
      return `${symbolicExpressionResult} ${this.symbolicExpressionGroup.toString()}`;
    }

    return symbolicExpressionResult;
  }
}
