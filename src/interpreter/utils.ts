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

type InterpreterNodeClass<TInterpreterNode, TChildContext> = { new (childContext: TChildContext): TInterpreterNode };

export const buildParseParentContext = <
  TInterpreterNode,
  TChildContext,
  TChildContextName extends string,
>(
  InterpreterNode: InterpreterNodeClass<TInterpreterNode, TChildContext>,
  childContextName: TChildContextName,
) => {
  type TTParentContext<TTChildContext extends TChildContext | undefined> =
    [TTChildContext] extends [TChildContext]
      ? ParentContext<TChildContextName, TChildContext>
      : ParentContext<TChildContextName, TChildContext | undefined>

  type TTParsedInterpreterNode<TTChildContext extends TChildContext | undefined> =
    [TTChildContext] extends [TChildContext]
      ? TInterpreterNode
      : TInterpreterNode | null

  const parseParentContext = <
    TTChildContext extends TChildContext | undefined
  >(
    parentContext: TTParentContext<TTChildContext>
  ): TTParsedInterpreterNode<TTChildContext> => {
    const childContext = parentContext[childContextName]();

    if (childContext === undefined) {
      return null as TTParsedInterpreterNode<TTChildContext>;
    }

    return new InterpreterNode(childContext) as TTParsedInterpreterNode<TTChildContext>;
  };

  return parseParentContext;
}
