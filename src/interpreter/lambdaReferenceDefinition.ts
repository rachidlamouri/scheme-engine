import { LambdaReferenceDefinitionContext, LambdaDefinitionContext, ReferenceAtomContext } from '../language/compiled/SchemeParser';
import { Lambda, refineLambdaDefinitionContext } from './lambda';
import { ReferenceAtom, refineReferenceAtomContext } from './atom';
import { Evaluable } from './evaluable';

export class LambdaReferenceDefinition implements Evaluable {
  constructor(private reference: ReferenceAtom, private lambda: Lambda) {}

  evaluate(): Evaluable {
    this.reference.register(this.lambda);
    return this.reference;
  }
}

export const refineLambdaReferenceDefinitionContext = (lambdaReferenceDefintionContext: LambdaReferenceDefinitionContext): LambdaReferenceDefinition => (
  new LambdaReferenceDefinition(
    refineReferenceAtomContext(lambdaReferenceDefintionContext.referenceAtom()),
    refineLambdaDefinitionContext(lambdaReferenceDefintionContext.lambdaDefinition())
  )
);
