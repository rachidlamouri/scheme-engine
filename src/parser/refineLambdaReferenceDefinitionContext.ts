import { LambdaReferenceDefinition } from '../interpreterNodes/lambdaReferenceDefinition';
import { LambdaReferenceDefinitionContext } from '../language/compiled/SchemeParser';
import { refineReferenceLiteralContext } from './refineAtomContext';
import { refineLambdaDefinitionContext } from './refineLambdaContext';

export const refineLambdaReferenceDefinitionContext = (lambdaReferenceDefintionContext: LambdaReferenceDefinitionContext): LambdaReferenceDefinition => (
  new LambdaReferenceDefinition(
    refineReferenceLiteralContext(lambdaReferenceDefintionContext.referenceLiteral()),
    refineLambdaDefinitionContext(lambdaReferenceDefintionContext.lambdaDefinition())
  )
);
