import { Lambda } from '../interpreterNodes/lambda';
import { LambdaDefinitionContext } from '../language/compiled/SchemeParser';
import { refineReferenceLiteralGroupContext } from './refineAtomContext';
import { refineEvaluableContext } from './refineEvaluableContext';

export const refineLambdaDefinitionContext = (lambdaDefinitionContext: LambdaDefinitionContext): Lambda => {
  const referenceAtomGroupContext = lambdaDefinitionContext.referenceLiteralGroup();

  const parameterReferences = referenceAtomGroupContext !== undefined ? refineReferenceLiteralGroupContext(referenceAtomGroupContext): [];
  const body = refineEvaluableContext(lambdaDefinitionContext.evaluable());

  return new Lambda(parameterReferences, body);
}
