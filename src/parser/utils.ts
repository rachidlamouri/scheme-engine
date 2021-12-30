import { ParserRuleContext } from 'antlr4ts';

export class UnhandledContextError extends Error {
  constructor(context: ParserRuleContext) {
    super(`Unhandled "${context.constructor.name}" with children [${context.children?.map((c) => c.constructor.name).join(', ')}]`);
  }
}

type ContextRefiner<TContext extends ParserRuleContext, T> = (context: TContext) => T;

export type NormalizedGroupContext<
  TElementContext extends ParserRuleContext,
  TGroupContext extends ParserRuleContext
> = {
  elementContext: TElementContext;
  groupContext: TGroupContext | undefined;
};

type GroupContextNormalizer<
  TElementContext extends ParserRuleContext,
  TGroupContext extends ParserRuleContext
> = (groupContext: TGroupContext) => NormalizedGroupContext<TElementContext, TGroupContext>

export const buildRefineGroupContext = <
  TElementContext extends ParserRuleContext,
  TGroupContext extends ParserRuleContext,
  TElementNode,
>(
  normalizeGroupContext: GroupContextNormalizer<TElementContext, TGroupContext>,
  refineElementContext: ContextRefiner<TElementContext, TElementNode>
) => {
  const refineGroupContext = (groupContext: TGroupContext): TElementNode[] => {
    const normalizedGroupContext = normalizeGroupContext(groupContext);
    const firstNode = refineElementContext(normalizedGroupContext.elementContext);
    const otherNodes = normalizedGroupContext.groupContext !== undefined
      ? refineGroupContext(normalizedGroupContext.groupContext)
      : []

    return [firstNode, ...otherNodes];
  }

  return refineGroupContext;
}
