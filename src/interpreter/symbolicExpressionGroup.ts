import { SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { buildParseParentContext, InterpretedResult } from './utils';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';

export class SymbolicExpressionGroup {
  static parseParentContext = buildParseParentContext<
    SymbolicExpressionGroup,
    SymbolicExpressionGroupContext,
    'symbolicExpressionGroup'
  >(SymbolicExpressionGroup, 'symbolicExpressionGroup');

  private symbolicExpression: SymbolicExpression;
  private symbolicExpressionGroup: SymbolicExpressionGroup | null;

  constructor(symbolicExpressionGroupContext: SymbolicExpressionGroupContext) {
    this.symbolicExpression = parseSymbolicExpressionParentContext(symbolicExpressionGroupContext);
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

  toResult(): InterpretedResult {
    const symbolicExpressionResult = this.symbolicExpression.toResult();

    if (this.symbolicExpressionGroup) {
      return `${symbolicExpressionResult} ${this.symbolicExpressionGroup.toResult()}`;
    }

    return symbolicExpressionResult;
  }
}