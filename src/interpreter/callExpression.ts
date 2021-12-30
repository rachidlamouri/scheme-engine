import { CallExpressionContext } from '../language/compiled/SchemeParser';
import { Atom, BooleanAtom, IntegerAtom } from './atom';
import { Evaluable } from './evaluable';
import { refineEvaluableGroupContext } from './evaluableGroup';
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

export abstract class CallExpression extends Evaluable {
  constructor(
    protected functionName: BuiltInFunctionName,
    protected parameters: Evaluable[],
    parameterValidations: ValidationConfig[],
  ) {
    super();

    const expectedParameterCount = parameterValidations.length;
    if (parameters.length !== expectedParameterCount) {
      throw Error(`${functionName} requires ${expectedParameterCount} parameter(s), but received ${parameters.length}`)
    }

    parameterValidations.forEach((validationConfig, index) => {
      const parameter = parameters[index];

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
  }

  abstract evaluate(): Evaluable;
}

abstract class OneParameterExpression<T extends SymbolicExpression> extends CallExpression {
  protected parameter: T;

  constructor(
    functionName: BuiltInFunctionName,
    parameters: Evaluable[],
    validationConfig: ValidationConfig,
  ) {
    super(functionName, parameters, [validationConfig]);

    [this.parameter] = parameters as [T];
  }
}

export class CarExpression extends OneParameterExpression<List> {
  constructor(parameters: Evaluable[]) {
    super(BuiltInFunctionName.CAR, parameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: false,
    });
  }

  evaluate(): Evaluable {
    return this.parameter.car();
  }
}

export class CdrExpression extends OneParameterExpression<List> {
  constructor(parameters: Evaluable[]) {
    super(BuiltInFunctionName.CDR, parameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: false,
    });
  }

  evaluate(): Evaluable {
    return this.parameter.cdr();
  }
}

export class IsNullExpression extends OneParameterExpression<List> {
  constructor(parameters: Evaluable[]) {
    super(BuiltInFunctionName.IS_NULL, parameters, {
      allowsAtoms: false,
      allowsLists: true,
      allowsEmptyLists: true,
    });
  }

  evaluate(): Evaluable {
    return this.parameter.isNull();
  }
}

export class IsAtomExpression extends OneParameterExpression<SymbolicExpression> {
  constructor(parameters: Evaluable[]) {
    super(BuiltInFunctionName.IS_ATOM, parameters, {
      allowsAtoms: true,
      allowsLists: true,
      allowsEmptyLists: true,
    });
  }

  evaluate(): Evaluable {
    return this.parameter.isAtom();
  }
}

abstract class TwoParameterExpression<T0 extends SymbolicExpression, T1 extends SymbolicExpression> extends CallExpression {
  protected parameter0: T0;
  protected parameter1: T1;

  constructor(
    functionName: BuiltInFunctionName,
    parameters: Evaluable[],
    validationConfig0: ValidationConfig,
    validationConfig1: ValidationConfig,
  ) {
    super(functionName, parameters, [validationConfig0, validationConfig1]);

    [this.parameter0, this.parameter1] = parameters as [T0, T1];
  }
}

export class ConsExpression extends TwoParameterExpression<SymbolicExpression, List> {
  constructor(parameters: Evaluable[]) {
    super(
      BuiltInFunctionName.CONS,
      parameters,
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
    return this.parameter1.cons(this.parameter0);
  }
}

export class IsEqualExpression extends TwoParameterExpression<Atom, Atom> {
  constructor(parameters: Evaluable[]) {
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
      parameters,
      validationConfig,
      validationConfig
    );
  }

  evaluate(): Evaluable {
    return new BooleanAtom(this.parameter0.value === this.parameter1.value);
  }
}

export const refineCallExpressionContext = (callExpressionContext: CallExpressionContext): CallExpression => {
  const functionName = callExpressionContext.BUILT_IN_FUNCTION().text;
  const parameterEvaluables = refineEvaluableGroupContext(callExpressionContext.evaluableGroup());
  const parameters = parameterEvaluables.map((evaluable) => evaluable.evaluate());

  switch (functionName) {
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
    default: throw Error(`Expression "${functionName}" is not implemented`)
  }
}
