import { ExpressionContext } from '../language/compiled/SchemeParser';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { SymbolicExpression } from './symbolicExpression';
import { isAtom } from './atom';
import { buildParseParentContext } from './utils';

export class Expression {
  static parseParentContext = buildParseParentContext<Expression, ExpressionContext, 'expression'>(Expression, 'expression');

  private evaluable: Evaluable;

  constructor(expresssionContext: ExpressionContext) {
    this.evaluable = parseEvaluableParentContext(expresssionContext);
  }

  evaluate(): SymbolicExpression {
    if (isAtom(this.evaluable)) {
      throw Error(`Cannot get the car of atom "${this.evaluable.toResult()}"`);
    }

    const operand = (this.evaluable instanceof Expression)
      ? this.evaluable.evaluate()
      : this.evaluable;

    if (isAtom(operand)) {
      throw Error(`Cannot get the car of returned atom "${operand.toResult()}"`);
    }

    const result = operand.first();
    if (result === null) {
      throw Error(`Cannot get the car of an empty list "${this.evaluable.toResult()}"`);
    }

    return result;
  }

  toResult(): string {
    return this.evaluable.toResult();
  }
}
