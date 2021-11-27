import { ExpressionContext } from '../language/compiled/SchemeParser';
import { Atom } from './atom';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { SymbolicExpression } from './symbolicExpression';
import { buildParseParentContext } from './utils';

export class Expression {
  static parseParentContext = buildParseParentContext<Expression, ExpressionContext, 'expression'>(Expression, 'expression');

  private evaluable: Evaluable;

  constructor(expresssionContext: ExpressionContext) {
    this.evaluable = parseEvaluableParentContext(expresssionContext);
  }

  evaluate(): SymbolicExpression {
    if (this.evaluable instanceof Atom) {
      throw Error(`Cannot get the car of atom "${this.evaluable.toString()}"`);
    }

    const operand = (this.evaluable instanceof Expression)
      ? this.evaluable.evaluate()
      : this.evaluable;

    if (operand instanceof Atom) {
      throw Error(`Cannot get the car of returned atom "${operand.toString()}"`);
    }

    const result = operand.first();
    if (result === null) {
      throw Error(`Cannot get the car of an empty list "${this.evaluable.toString()}"`);
    }

    return result;
  }

  toString(): string {
    return this.evaluable.toString();
  }
}
