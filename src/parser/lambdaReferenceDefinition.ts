import { LambdaReferenceDefinition } from '../interpreterNodes/lambdaReferenceDefinition';
import { LambdaReferenceDefinitionContext } from '../language/compiled/SchemeParser';
import { refineReferenceAtomContext } from './atom';
import { refineLambdaDefinitionContext } from './lambda';

export const refineLambdaReferenceDefinitionContext = (lambdaReferenceDefintionContext: LambdaReferenceDefinitionContext): LambdaReferenceDefinition => (
  new LambdaReferenceDefinition(
    refineReferenceAtomContext(lambdaReferenceDefintionContext.referenceAtom()),
    refineLambdaDefinitionContext(lambdaReferenceDefintionContext.lambdaDefinition())
  )
);
