import { EvaluableContext, ExpressionContext } from '../language/compiled/SchemeParser';
import { Atom } from './atom';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { SymbolicExpression } from './symbolicExpression';
import { ParentContext } from './utils';

type ChildExpressionContext = ExpressionContext | undefined;

type ExpressionParentContext<TChildContext> =
  [TChildContext] extends [ExpressionContext]
    ? ParentContext<'expression', ExpressionContext>
    : ParentContext<'expression', ExpressionContext | undefined>

type ParsedExpression<TChildContext extends ChildExpressionContext> =
  [TChildContext] extends [ExpressionContext]
    ? Expression
    : Expression | null

export class Expression {
  static parseParentContext = <
    TChildContext extends ChildExpressionContext
  >(parentContext: ExpressionParentContext<TChildContext>): ParsedExpression<TChildContext> => {
    const expressionContext = parentContext.expression();

    if (expressionContext !== undefined) {
      return new Expression(expressionContext);
    }

    return null as ParsedExpression<TChildContext>;
  }

  private evaluable: Evaluable;

  constructor(expresssionContext: ExpressionContext) {
    this.evaluable = parseEvaluableParentContext<EvaluableContext>(expresssionContext);
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
