import { ParserRuleContext } from 'antlr4ts';

export type ParentContext<Key extends string, ChildContext> = Record<Key, () => ChildContext>;

export type OptionalChildContext<TContext extends ParserRuleContext> = TContext | undefined;

export type NodeParentContext<
  TContext extends ParserRuleContext,
  TChildContext extends OptionalChildContext<TContext>,
  TChildContextName extends string
> = [TChildContext] extends [TContext]
  ? ParentContext<TChildContextName, TContext>
  : ParentContext<TChildContextName, OptionalChildContext<TContext>>;

export type ParsedNode<
  TNode,
  TContext extends ParserRuleContext,
  TChildContext extends OptionalChildContext<TContext>,
> = [TChildContext] extends [TContext]
  ? TNode
  : TNode | null;

export type ContextParser<
  TNode,
  TContext extends ParserRuleContext,
  TChildContextName extends string
> = <TChildContext extends OptionalChildContext<TContext>>(parentContext: NodeParentContext<TContext, TChildContext, TChildContextName>) => ParsedNode<TNode, TContext, TChildContext>;

export const buildParseGroupParentContext = <
  TNode,
  TLeftContext extends ParserRuleContext,
  TLeftContextParser extends ContextParser<TNode, TLeftContext, string>,
  TRightContextName extends string,
  TRightContext extends ParserRuleContext & Parameters<TLeftContextParser>[0] & NodeParentContext<TRightContext, OptionalChildContext<TRightContext>, TRightContextName>,
>(
  leftContextParser: TLeftContextParser,
  rightContextName: TRightContextName,
) => {
  const parseGroupParentContext = <
    TChildContext extends OptionalChildContext<TRightContext>
  >(
    parentContext: NodeParentContext<TRightContext, TChildContext, TRightContextName>
  ): TNode[] => {
    const childContext = parentContext[rightContextName]();

    if (childContext === undefined) {
      return [];
    }

    const leftNode = leftContextParser<TLeftContext>(childContext) as TNode;
    const rightNodes = parseGroupParentContext(childContext);

    return [leftNode, ...rightNodes];
  };

  return parseGroupParentContext;
};
