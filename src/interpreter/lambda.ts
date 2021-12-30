import { LambdaDefinitionContext } from '../language/compiled/SchemeParser';
import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';
import { refineReferenceAtomGroupContext } from './atom';
import { refineEvaluableContext } from './refineEvaluableContext';

export class Lambda extends Evaluable {
  constructor(public readonly parameterReferences: ReferenceAtom[], private body: Evaluable) {
    super();
  }

  evaluate(parameters: Evaluable[]): Evaluable {
    this.parameterReferences.forEach((reference, index) => {
      const value = parameters[index];
      reference.register(value);
    });

    return this.body.evaluate();
  }
}

export const refineLambdaDefinitionContext = (lambdaDefinitionContext: LambdaDefinitionContext): Lambda => {
  const referenceAtomGroupContext = lambdaDefinitionContext.referenceAtomGroup();

  const parameterReferences = referenceAtomGroupContext !== undefined ? refineReferenceAtomGroupContext(referenceAtomGroupContext): [];
  const body = refineEvaluableContext(lambdaDefinitionContext.evaluable());

  return new Lambda(parameterReferences, body);
}
