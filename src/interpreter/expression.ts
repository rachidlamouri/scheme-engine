import { ExpressionContext } from '../language/compiled/SchemeParser';
import { Atom } from './atom';
import { parseEvaluableGroupParentContext } from './evaluableGroup';
import { List } from './list';
import { SymbolicExpression } from './symbolicExpression';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

enum BuiltInFunctionName {
  CAR = 'car',
  CDR = 'cdr',
  CONS = 'cons',
};
type OneParameterFunctionName = BuiltInFunctionName.CAR | BuiltInFunctionName.CDR;

export abstract class Expression {
  static parseParentContext = <
    TChildContext extends OptionalChildContext<ExpressionContext>
  >(parentContext: NodeParentContext<ExpressionContext, TChildContext, 'expression'>): ParsedNode<Expression, ExpressionContext, TChildContext> => {
    const expressionContext = parentContext.expression();

    if (expressionContext !== undefined) {
      const functionName = expressionContext.KEYWORD().text;
      const parameters = parseEvaluableGroupParentContext(expressionContext);

      return functionName === BuiltInFunctionName.CONS
        ? new ConsExpression(parameters)
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
    if (this.parameter instanceof Atom) {
      throw Error(`Cannot get the ${this.functionName} of atom "${this.parameter.toString()}"`);
    }

    if (this.parameter.isEmpty()) {
      throw Error(`Cannot get the ${this.functionName} of an empty list`);
    }

    return this.functionName === BuiltInFunctionName.CAR
      ? this.parameter.car()
      : this.parameter.cdr();
  }
}

class ConsExpression extends Expression {
  constructor(parameters: SymbolicExpression[]) {
    super(BuiltInFunctionName.CONS, parameters);
  }

  evaluate(): SymbolicExpression {
    if (this.parameters.length < 2) {
      throw Error(`cons requires two parameters. Received one: "${this.parameters[0].toString()}"`);
    }

    const [firstParameter, secondParameter] = this.parameters;

    if (!(secondParameter instanceof List)) {
      throw Error(`The second parameter to cons must be a list. Received: "${secondParameter.toString()}"`)
    }

    return secondParameter.cons(firstParameter);
  }
}
