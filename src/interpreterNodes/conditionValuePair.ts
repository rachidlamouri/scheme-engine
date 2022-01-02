import { BooleanAtom, ReferenceAtom } from './atom';
import { CallExpression } from './callExpression';
import { Evaluable } from './evaluable';
import { ExecutionContext } from './executionContext';

export type Condition = CallExpression | ReferenceAtom | BooleanAtom;

export class ConditionValuePair {
  constructor(private condition: Condition, private evaluable: Evaluable) {}

  evaluateCondition(executionContext: ExecutionContext): Evaluable {
    executionContext.log(`Evaluating: ${this.constructor.name}`);
    return this.condition.evaluate(executionContext);
  }

  evaluateValue(executionContext: ExecutionContext): Evaluable {
    executionContext.log(`Evaluating: ${this.constructor.name} value`);
    return this.evaluable.evaluate(executionContext);
  }
}
