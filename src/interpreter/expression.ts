import { ExpressionContext } from '../language/compiled/SchemeParser';
import { Atom, BooleanAtom, IntegerAtom } from './atom';
import { parseEvaluableGroupParentContext } from './evaluableGroup';
import { List } from './list';
import { SymbolicExpression } from './symbolicExpression';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

enum BuiltInFunctionName {
  CAR = 'car',
  CDR = 'cdr',
  CONS = 'cons',
  IS_NULL = 'null?',
  IS_ATOM = 'atom?',
  IS_EQUAL = 'eq?',
};
type OneParameterFunctionName = BuiltInFunctionName.CAR | BuiltInFunctionName.CDR | BuiltInFunctionName.IS_NULL | BuiltInFunctionName.IS_ATOM;
type TwoParameterFunctionName = BuiltInFunctionName.CONS | BuiltInFunctionName.IS_EQUAL;

export abstract class Expression {
  static parseParentContext = <
    TChildContext extends OptionalChildContext<ExpressionContext>
  >(parentContext: NodeParentContext<ExpressionContext, TChildContext, 'expression'>): ParsedNode<Expression, ExpressionContext, TChildContext> => {
    const expressionContext = parentContext.expression();

    if (expressionContext !== undefined) {
      const functionName = expressionContext.KEYWORD().text;
      const parameters = parseEvaluableGroupParentContext(expressionContext);

      return functionName === BuiltInFunctionName.CONS || functionName === BuiltInFunctionName.IS_EQUAL
        ? new TwoParameterExpression(functionName, parameters)
        : new OneParameterExpression(functionName as OneParameterFunctionName, parameters);
    }

    return null as ParsedNode<Expression, ExpressionContext, TChildContext>;
  };

  constructor(
    protected functionName: BuiltInFunctionName,
    protected parameters: SymbolicExpression[],
  ) {}

  abstract evaluate(): SymbolicExpression;
}

class OneParameterExpression extends Expression {
  private parameter: SymbolicExpression;

  constructor(
    protected functionName: OneParameterFunctionName,
    parameters: SymbolicExpression[],
  ) {
    super(functionName, parameters);

    this.parameter = parameters[0];
  }

  evaluate(): SymbolicExpression {
    if (this.functionName === BuiltInFunctionName.IS_ATOM) {
      return this.parameter.isAtom();
    }

    if (this.parameter instanceof BooleanAtom) {
      throw Error(`Cannot call ${this.functionName} on a boolean`);
    }

    if (this.parameter instanceof Atom) {
      throw Error(`Cannot call ${this.functionName} on atom "${this.parameter.toString()}"`);
    }

    if ([BuiltInFunctionName.CAR, BuiltInFunctionName.CDR].includes(this.functionName) && this.parameter.isEmpty()) {
      throw Error(`Cannot call ${this.functionName} on an empty list`);
    }

    switch (this.functionName) {
      case BuiltInFunctionName.CAR:
          return this.parameter.car();
      case BuiltInFunctionName.CDR:
          return this.parameter.cdr();
      case BuiltInFunctionName.IS_NULL:
          return this.parameter.isNull();
    }
  }
}

class TwoParameterExpression extends Expression {
  constructor(protected functionName: TwoParameterFunctionName, parameters: SymbolicExpression[]) {
    super(BuiltInFunctionName.CONS, parameters);
  }

  evaluate(): SymbolicExpression {
    if (this.parameters.length < 2) {
      throw Error(`${this.functionName} requires two parameters. Received one: "${this.parameters[0].toString()}"`);
    }

    if (this.functionName === BuiltInFunctionName.IS_EQUAL) {
      const [parameter0, parameter1] = this.parameters;

      if (parameter0 instanceof IntegerAtom || parameter1 instanceof IntegerAtom) {
        throw Error(`Cannot call ${this.functionName} on integer literal`);
      }

      return new BooleanAtom(!(parameter0 instanceof List) && !(parameter1 instanceof List) && parameter0.value === parameter1.value);
    }

    const [firstParameter, secondParameter] = this.parameters;

    if (!(secondParameter instanceof List)) {
      throw Error(`The second parameter to cons must be a list. Received: "${secondParameter.toString()}"`)
    }

    return secondParameter.cons(firstParameter);
  }
}
