import { LambdaReferenceDefinition } from '../interpreterNodes/lambdaReferenceDefinition';
import { LambdaReferenceDefinitionContext } from '../language/compiled/SchemeParser';
import { refineReferenceAtomContext } from './refineAtomContext';
import { refineLambdaDefinitionContext } from './refineLambdaContext';

export const refineLambdaReferenceDefinitionContext = (lambdaReferenceDefintionContext: LambdaReferenceDefinitionContext): LambdaReferenceDefinition => (
  new LambdaReferenceDefinition(
    refineReferenceAtomContext(lambdaReferenceDefintionContext.referenceAtom()),
    refineLambdaDefinitionContext(lambdaReferenceDefintionContext.lambdaDefinition())
  )
);
