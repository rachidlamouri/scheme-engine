import { Lambda } from '../interpreterNodes/lambda';
import { LambdaDefinitionContext } from '../language/compiled/SchemeParser';
import { refineReferenceAtomGroupContext } from './refineAtomContext';
import { refineEvaluableContext } from './refineEvaluableContext';

export const refineLambdaDefinitionContext = (lambdaDefinitionContext: LambdaDefinitionContext): Lambda => {
  const referenceAtomGroupContext = lambdaDefinitionContext.referenceAtomGroup();

  const parameterReferences = referenceAtomGroupContext !== undefined ? refineReferenceAtomGroupContext(referenceAtomGroupContext): [];
  const body = refineEvaluableContext(lambdaDefinitionContext.evaluable());

  return new Lambda(parameterReferences, body);
}
