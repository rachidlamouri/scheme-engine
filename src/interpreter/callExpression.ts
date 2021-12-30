import { CallExpressionContext } from '../language/compiled/SchemeParser';
import { Atom, BooleanAtom, IntegerAtom, ReferenceAtom, refineReferenceAtomContext } from './atom';
import { Evaluable } from './evaluable';
import { refineEvaluableGroupContext } from './refineEvaluableContext';
import { Lambda } from './lambda';
import { List } from './list';
import { SymbolicExpression } from './symbolicExpression';

enum BuiltInFunctionName {
  CAR = 'car',
  CDR = 'cdr',
  CONS = 'cons',
  IS_NULL = 'null?',
  IS_ATOM = 'atom?',
  IS_EQUAL = 'eq?',
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

abstract class CallExpression extends Evaluable {
  constructor(
    protected functionName: string,
    protected unevaluatedParameters: Evaluable[],
  ) {
    super();
  }

  abstract evaluate(): Evaluable;

  protected evaluateParameters(parameterValidations: ValidationConfig[]): Evaluable[] {
    const expectedParameterCount = parameterValidations.length;
    if (this.unevaluatedParameters.length !== expectedParameterCount) {
      throw Error(`${this.functionName} requires ${expectedParameterCount} parameter(s), but received ${this.unevaluatedParameters.length}`)
    }

    const evaluatedParameters = this.unevaluatedParameters.map((parameter) => parameter.evaluate());

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
}

abstract class OneParameterExpression<T extends SymbolicExpression> extends CallExpression {
  constructor(
    functionName: BuiltInFunctionName,
    unevaluatedParameters: Evaluable[],
    private validationConfig: ValidationConfig,
  ) {
    super(functionName, unevaluatedParameters);
  }

  protected evaluateParameter(): T {
    const [parameter] = super.evaluateParameters([this.validationConfig]);
    return parameter as T;
  }
}

class CarExpression extends OneParameterExpression<List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.CAR, unevaluatedParameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: false,
    });
  }

  evaluate(): Evaluable {
    const parameter = super.evaluateParameter();
    return parameter.car();
  }
}

class CdrExpression extends OneParameterExpression<List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.CDR, unevaluatedParameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: false,
    });
  }

  evaluate(): Evaluable {
    const parameter = super.evaluateParameter();
    return parameter.cdr();
  }
}

class IsNullExpression extends OneParameterExpression<List> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.IS_NULL, unevaluatedParameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: true,
    });
  }

  evaluate(): Evaluable {
    const parameter = super.evaluateParameter();
    return parameter.isNull();
  }
}

class IsAtomExpression extends OneParameterExpression<SymbolicExpression> {
  constructor(unevaluatedParameters: Evaluable[]) {
    super(BuiltInFunctionName.IS_ATOM, unevaluatedParameters, {
      allowsAtoms: true,
      allowsLists: true,
      allowsEmptyLists: true,
    });
  }

  evaluate(): Evaluable {
    const parameter = super.evaluateParameter();
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

  protected evaluateParameters(): [T0, T1] {
    return super.evaluateParameters([this.validationConfig0, this.validationConfig1]) as [T0, T1];
  }
}

class ConsExpression extends TwoParameterExpression<SymbolicExpression, List> {
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

  evaluate(): Evaluable {
    const [parameter0, parameter1] = this.evaluateParameters();
    return parameter1.cons(parameter0);
  }
}

class IsEqualExpression extends TwoParameterExpression<Atom, Atom> {
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

  evaluate(): Evaluable {
    const [parameter0, parameter1] = this.evaluateParameters();
    return new BooleanAtom(parameter0.value === parameter1.value);
  }
}

class ReferenceCallExpression extends CallExpression {
  constructor(private functionReference: ReferenceAtom, unevaluatedParameters: Evaluable[]) {
    super(
      functionReference.name,
      unevaluatedParameters,
    )
  }

  evaluate(): Evaluable {
    const unknownValue = this.functionReference.evaluate();
    if (!(unknownValue instanceof Lambda)) {
      throw Error(`"${this.functionReference.name}" is not callable`)
    }

    const lambda = unknownValue;
    const validationConfigs: ValidationConfig[] = lambda.parameterReferences.map(() => ({
      allowsAtoms: true,
      allowsLists: true,
      allowsEmptyLists: true,
    }))
    const parameters = this.evaluateParameters(validationConfigs);
    return lambda.evaluate(parameters);
  }
}

export const refineCallExpressionContext = (callExpressionContext: CallExpressionContext): CallExpression => {
  const functionReference = refineReferenceAtomContext(callExpressionContext.referenceAtom());
  const evaluableGroupContext = callExpressionContext.evaluableGroup();
  const parameters = evaluableGroupContext !== undefined ? refineEvaluableGroupContext(evaluableGroupContext): [];

  switch (functionReference.name) {
    case BuiltInFunctionName.CAR:
        return new CarExpression(parameters);
    case BuiltInFunctionName.CDR:
      return new CdrExpression(parameters);
    case BuiltInFunctionName.CONS:
      return new ConsExpression(parameters);
    case BuiltInFunctionName.IS_NULL:
      return new IsNullExpression(parameters);
    case BuiltInFunctionName.IS_ATOM:
      return new IsAtomExpression(parameters);
    case BuiltInFunctionName.IS_EQUAL:
      return new IsEqualExpression(parameters);
  }

  return new ReferenceCallExpression(functionReference, parameters);
}
