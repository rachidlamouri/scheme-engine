import { Literal, parseLiteralParentContext } from './literal';
import { CallExpression } from './callExpression';
import { EvaluableContext } from '../language/compiled/SchemeParser';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

export type Evaluable = CallExpression | Literal;

export const parseEvaluableParentContext = <
  TChildContext extends OptionalChildContext<EvaluableContext>
>(parentContext: NodeParentContext<EvaluableContext, TChildContext, 'evaluable'>): ParsedNode<Evaluable, EvaluableContext, TChildContext> => {
  const evaluableContext = parentContext.evaluable();

  if (evaluableContext !== undefined) {
    return CallExpression.parseParentContext(evaluableContext)
      ?? parseLiteralParentContext(evaluableContext) as ParsedNode<Evaluable, EvaluableContext, TChildContext>;
  }

  return null as ParsedNode<Evaluable, EvaluableContext, TChildContext>;
};
