import { SymbolicExpressionContext, SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { buildParseParentContext, ParentContext } from './utils';

export class SymbolicExpressionGroup {
  static parseParentContext = buildParseParentContext<
    SymbolicExpressionGroup,
    SymbolicExpressionGroupContext,
    'symbolicExpressionGroup'
  >(SymbolicExpressionGroup, 'symbolicExpressionGroup');

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
