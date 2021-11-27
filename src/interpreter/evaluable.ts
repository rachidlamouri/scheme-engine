import { Literal, parseLiteralParentContext } from './literal';
import { Expression } from './expression';
import { EvaluableContext } from '../language/compiled/SchemeParser';
import { ParentContext } from './utils';

export type Evaluable = Expression | Literal;

type ChildEvaluableContext = EvaluableContext | undefined;

type EvaluableParentContext<TChildContext> =
  [TChildContext] extends [EvaluableContext]
    ? ParentContext<'evaluable', EvaluableContext>
    : ParentContext<'evaluable', EvaluableContext | undefined>

type ParsedEvaluable<TChildContext extends ChildEvaluableContext> =
  [TChildContext] extends [EvaluableContext]
    ? Evaluable
    : Evaluable | null

export const parseEvaluableParentContext = <
  TChildContext extends ChildEvaluableContext
>(parentContext: EvaluableParentContext<TChildContext>): ParsedEvaluable<TChildContext> => {
  const evaluableContext = parentContext.evaluable();

  if (evaluableContext !== undefined) {
    return Expression.parseParentContext(evaluableContext)
      ?? parseLiteralParentContext(evaluableContext) as ParsedEvaluable<TChildContext>;
  }

  return null as ParsedEvaluable<TChildContext>
};
