import { ExpressionContext } from '../language/compiled/SchemeParser';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { SymbolicExpression } from './symbolicExpression';
import { List } from './list';
import { isAtom } from './atom';
import { buildParseParentContext, InterpretedResult } from './utils';

export class Expression {
  static parseParentContext = buildParseParentContext<Expression, ExpressionContext, 'expression'>(Expression, 'expression');

  private evaluable: Evaluable;

  constructor(expresssionContext: ExpressionContext) {
    this.evaluable = parseEvaluableParentContext(expresssionContext);
  }

  evaluate(): SymbolicExpression {
    if (this.evaluable instanceof List) {
      return this.evaluable.first()!;
    }

    return ((this.evaluable as Expression).evaluate() as List).first()!;
  }
}
