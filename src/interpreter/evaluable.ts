import { Literal, parseLiteralParentContext } from './literal';
import { Expression } from './expression';
import { EvaluableContext } from '../language/compiled/SchemeParser';

export type Evaluable = Expression | Literal;

export const parseEvaluableParentContext = <
  TChildContext extends EvaluableContext | undefined
>(parentContext: Record<'evaluable', () => TChildContext>): TChildContext extends EvaluableContext ? Evaluable : null => {
  const evaluableContext = parentContext.evaluable();

  return (
    evaluableContext !== undefined
      ? Expression.parseParentContext(evaluableContext) ?? parseLiteralParentContext(evaluableContext)!
      : null
  ) as any;
};
