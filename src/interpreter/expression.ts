import { EvaluableContext, ExpressionContext } from '../language/compiled/SchemeParser';
import { Atom } from './atom';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { SymbolicExpression } from './symbolicExpression';
import { buildParseParentContext, ParentContext } from './utils';

type BuiltInFunction = 'car' | 'cdr';

export class Expression {
  static parseParentContext = buildParseParentContext<Expression, ExpressionContext, 'expression'>(Expression, 'expression');

  private evaluable: Evaluable;
  private functionName: BuiltInFunction;

  constructor(expresssionContext: ExpressionContext) {
    this.evaluable = parseEvaluableParentContext<EvaluableContext>(expresssionContext);
    this.functionName = expresssionContext.KEYWORD().text as BuiltInFunction;
  }

  evaluate(): SymbolicExpression {
    if (this.evaluable instanceof Atom) {
      throw Error(`Cannot get the ${this.functionName} of atom "${this.evaluable.toString()}"`);
    }

    const operand = (this.evaluable instanceof Expression)
      ? this.evaluable.evaluate()
      : this.evaluable;

    if (operand instanceof Atom) {
      throw Error(`Cannot get the ${this.functionName} of returned atom "${operand.toString()}"`);
    }

    if (operand.isEmpty()) {
      if (this.evaluable instanceof Expression) {
        throw Error(`Cannot get the cdr of the returned empty list`);
      }

      throw Error(`Cannot get the ${this.functionName} of an empty list`);
    }

    return this.functionName === 'car'
      ? operand.car()
      : operand.cdr();
  }

  toString(): string {
    return this.evaluable.toString();
  }
}
