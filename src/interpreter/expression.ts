import { ExpressionContext } from '../language/compiled/SchemeParser';
import { SymbolicExpressionGroup } from './symbolicExpressionGroup';
import { buildParseParentContext, InterpretedResult } from './utils';

export class Expression {
  static parseParentContext = buildParseParentContext<Expression, ExpressionContext, 'expression'>(Expression, 'expression');

  private symbolicExpressionGroup: SymbolicExpressionGroup;

  constructor(expresssionContext: ExpressionContext) {
    this.symbolicExpressionGroup = SymbolicExpressionGroup.parseParentContext(expresssionContext);
  }

  evaluate(): InterpretedResult {
    return this.symbolicExpressionGroup.first().toResult();
  }
}
