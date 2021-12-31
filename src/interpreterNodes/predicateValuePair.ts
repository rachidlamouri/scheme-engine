import { CallExpression } from './callExpression';
import { Evaluable } from './evaluable';

export class PredicateValuePair {
  constructor(private predicate: CallExpression, private evaluable: Evaluable) {}

  evaluatePredicate(): Evaluable {
    return this.predicate.evaluate();
  }

  evaluateValue(): Evaluable {
    return this.evaluable.evaluate();
  }
}
