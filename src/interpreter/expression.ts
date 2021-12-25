import { ExpressionContext } from '../language/compiled/SchemeParser';
import { Atom } from './atom';
import { parseEvaluableGroupParentContext } from './evaluableGroup';
import { List } from './list';
import { SchemeBoolean } from './schemeBoolean';
import { SymbolicExpression } from './symbolicExpression';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

enum BuiltInFunctionName {
  CAR = 'car',
  CDR = 'cdr',
  CONS = 'cons',
  IS_NULL = 'null?',
  IS_ATOM = 'atom?',
};
type OneParameterFunctionName = BuiltInFunctionName.CAR | BuiltInFunctionName.CDR | BuiltInFunctionName.IS_NULL | BuiltInFunctionName.IS_ATOM;

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
    if (this.functionName === BuiltInFunctionName.IS_ATOM) {
      return this.parameter.isAtom();
    }

    if (this.parameter instanceof Atom) {
      throw Error(`Cannot call ${this.functionName} on atom "${this.parameter.toString()}"`);
    }

    if (this.parameter instanceof SchemeBoolean) {
      throw Error(`Cannot call ${this.functionName} on a boolean`);
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
