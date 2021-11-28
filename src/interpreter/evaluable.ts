import { Literal, parseLiteralParentContext } from './literal';
import { Expression } from './expression';
import { EvaluableContext } from '../language/compiled/SchemeParser';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

export type Evaluable = Expression | Literal;

export const parseEvaluableParentContext = <
  TChildContext extends OptionalChildContext<EvaluableContext>
>(parentContext: NodeParentContext<EvaluableContext, TChildContext, 'evaluable'>): ParsedNode<Evaluable, EvaluableContext, TChildContext> => {
  const evaluableContext = parentContext.evaluable();

  if (evaluableContext !== undefined) {
    return Expression.parseParentContext(evaluableContext)
      ?? parseLiteralParentContext(evaluableContext) as ParsedNode<Evaluable, EvaluableContext, TChildContext>;
  }

  return null as ParsedNode<Evaluable, EvaluableContext, TChildContext>;
};
