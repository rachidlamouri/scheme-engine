import { Atom, BooleanAtom, IntegerAtom, ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';
import { Closure, ExecutionContext } from './executionContext';
import { List } from './list';
import { PredicateValuePair } from './predicateValuePair';
import { SymbolicExpression } from './symbolicExpression';
import { Primitive } from './utils';

export enum BuiltInFunctionName {
  CAR = 'car',
  CDR = 'cdr',
  CONS = 'cons',
  IS_NULL = 'null?',
  IS_ATOM = 'atom?',
  IS_EQUAL = 'eq?',
  COND = 'cond',
};

type AtomValidationConfig = boolean | { allowsNonIntegers: true, allowsIntegers: false };

type ValidationConfig =
  | {
    allowsAtoms: AtomValidationConfig;
    allowsLists: false;
    allowsEmptyLists: false;
  }
  | {
    allowsAtoms: AtomValidationConfig;
    allowsLists: true;
    allowsEmptyLists: boolean;
  }

export abstract class CallExpression extends Evaluable {
  constructor(
    protected functionName: string,
    protected unevaluatedParameters: Evaluable[],
  ) {
    super();
  }

  abstract evaluate(executionContext: ExecutionContext): Evaluable;

  protected evaluateParameters(executionContext: ExecutionContext, parameterValidations: ValidationConfig[]): Evaluable[] {
    const expectedParameterCount = parameterValidations.length;
    if (this.unevaluatedParameters.length !== expectedParameterCount) {
      throw Error(`${this.functionName} requires ${expectedParameterCount} parameter(s), but received ${this.unevaluatedParameters.length}`)
    }

    const evaluatedParameters = this.unevaluatedParameters.map((parameter) => parameter.evaluate(executionContext));

    parameterValidations.forEach((validationConfig, index) => {
      const parameter = evaluatedParameters[index];

      const disallowsAllAtoms = validationConfig.allowsAtoms === false;
      const allowsIntegerAtoms = validationConfig.allowsAtoms === true || (typeof validationConfig.allowsAtoms !== 'boolean' && validationConfig.allowsAtoms.allowsIntegers);

      if (disallowsAllAtoms && parameter instanceof Atom) {
        throw Error(`Parameter ${index} of ${this.functionName} cannot be an atom`);
      }

      if (!allowsIntegerAtoms && parameter instanceof IntegerAtom) {
        throw Error(`Parameter ${index} of ${this.functionName} cannot be an integer atom`);
      }

      if (!validationConfig.allowsLists && parameter instanceof List) {
        throw Error(`Parameter ${index} of ${this.functionName} cannot be a list`);
      }

      if (!validationConfig.allowsEmptyLists && parameter instanceof List && parameter.isEmpty()) {
        throw Error(`Parameter ${index} of ${this.functionName} cannot be an empty list`);
      }
    })

    return evaluatedParameters;
  }

  serialize(): string {
    throw Error('Not implemented');
  }
}

abstract class OneParameterExpression<T extends SymbolicExpression> extends CallExpression {
  constructor(
    functionName: BuiltInFunctionName,
    unevaluatedParameters: Evaluable[],
    private validationConfig: ValidationConfig,
  ) {
    super(functionName, unevaluatedParameters);
  }

  protected evaluateParameter(executionContext: ExecutionContext): T {
    const [parameter] = super.evaluateParameters(executionContext, [this.validationConfig]);
    return parameter as T;
  }
}

export class CarExpression extends OneParameterExpression<List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.CAR, unevaluatedParameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: false,
    });
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const parameter = super.evaluateParameter(executionContext);
    return parameter.car();
  }
}

export class CdrExpression extends OneParameterExpression<List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.CDR, unevaluatedParameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: false,
    });
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const parameter = super.evaluateParameter(executionContext);
    return parameter.cdr();
  }
}

export class IsNullExpression extends OneParameterExpression<List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.IS_NULL, unevaluatedParameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: true,
    });
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const parameter = super.evaluateParameter(executionContext);
    return parameter.isNull();
  }
}

export class IsAtomExpression extends OneParameterExpression<SymbolicExpression> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.IS_ATOM, unevaluatedParameters, {
      allowsAtoms: true,
      allowsLists: true,
      allowsEmptyLists: true,
    });
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const parameter = super.evaluateParameter(executionContext);
    return parameter.isAtom();
  }
}

abstract class TwoParameterExpression<T0 extends SymbolicExpression, T1 extends SymbolicExpression> extends CallExpression {
  constructor(
    functionName: BuiltInFunctionName,
    unevaluatedParameters: Evaluable[],
    private validationConfig0: ValidationConfig,
    private validationConfig1: ValidationConfig,
  ) {
    super(functionName, unevaluatedParameters);
  }

  protected evaluateParameters(executionContext: ExecutionContext): [T0, T1] {
    return super.evaluateParameters(executionContext, [this.validationConfig0, this.validationConfig1]) as [T0, T1];
  }
}

export class ConsExpression extends TwoParameterExpression<SymbolicExpression, List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(
      BuiltInFunctionName.CONS,
      unevaluatedParameters,
      {
        allowsAtoms: true,
        allowsLists: true,
        allowsEmptyLists: true,
      },
      {
        allowsAtoms: false,
        allowsLists: true,
        allowsEmptyLists: true,
      },
    );
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const [parameter0, parameter1] = this.evaluateParameters(executionContext);
    return parameter1.cons(parameter0);
  }
}

export class IsEqualExpression extends TwoParameterExpression<Atom<Primitive>, Atom<Primitive>> {
  constructor(unevaluatedParameters: Evaluable[]) {
    const validationConfig: ValidationConfig = {
      allowsAtoms: {
        allowsNonIntegers: true,
        allowsIntegers: false,
      },
      allowsLists: false,
      allowsEmptyLists: false,
    };

    super(
      BuiltInFunctionName.IS_EQUAL,
      unevaluatedParameters,
      validationConfig,
      validationConfig
    );
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const [parameter0, parameter1] = this.evaluateParameters(executionContext);
    return new BooleanAtom(parameter0.value === parameter1.value);
  }
}

export class ReferenceCallExpression extends CallExpression {
  constructor(private functionReference: ReferenceAtom, unevaluatedParameters: Evaluable[]) {
    super(
      functionReference.key,
      unevaluatedParameters,
    )
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const unknownValue = this.functionReference.evaluate(executionContext);
    if (!(unknownValue instanceof Closure)) {
      throw Error(`"${this.functionReference.key}" is not callable`)
    }

    const closure = unknownValue;
    const validationConfigs: ValidationConfig[] = closure.lambda.parameterReferences.map(() => ({
      allowsAtoms: true,
      allowsLists: true,
      allowsEmptyLists: true,
    }))
    const parameters = this.evaluateParameters(executionContext, validationConfigs);

    return closure.evaluate(executionContext, parameters);
  }
}

export class ConditionExpression extends CallExpression {
  constructor(private predicateValuePairs: PredicateValuePair[], private elseEvaluable: Evaluable) {
    super(BuiltInFunctionName.COND, []);
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    const pair = this.predicateValuePairs.find((nextPair, index): boolean => {
      const conditionalValue = nextPair.evaluatePredicate(executionContext);

      if (!(conditionalValue instanceof BooleanAtom)) {
        throw Error(`cond condition ${index} did not return a boolean`);
      }

      return conditionalValue.value;
    })

    if (pair !== undefined) {
      return pair.evaluateValue(executionContext);
    }

    executionContext.log('Evaluating: Else');
    return this.elseEvaluable.evaluate(executionContext);
  }
}
