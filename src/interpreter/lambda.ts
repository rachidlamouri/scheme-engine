import { LambdaDefinitionContext } from '../language/compiled/SchemeParser';
import { StringAtom } from './atom';
import { Evaluable } from './evaluable';

export class Lambda extends Evaluable {
  // TODO: evaluate parameterReferences and the lambda body
  evaluate(): Evaluable {
    return new StringAtom('NOT IMPLEMENTED');
  }
}

export const refineLambdaDefinitionContext = (lambdaDefinitionContext: LambdaDefinitionContext): Lambda => (
  new Lambda()
);
