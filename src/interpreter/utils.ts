export type ParentContext<Key extends string, ChildContext> = Record<Key, () => ChildContext>;

type InterpreterNodeClass<TInterpreterNode, TChildContext> = { new (childContext: TChildContext): TInterpreterNode };

type TTParentContext<
  TChildContext,
  TTChildContext extends TChildContext | undefined,
  TChildContextName extends string
> = [TTChildContext] extends [TChildContext]
  ? ParentContext<TChildContextName, TChildContext>
  : ParentContext<TChildContextName, TChildContext | undefined>

type TTParsedInterpreterNode<
  TInterpreterNode,
  TChildContext,
  TTChildContext extends TChildContext | undefined
> = [TTChildContext] extends [TChildContext]
  ? TInterpreterNode
  : TInterpreterNode | null

export const buildParseParentContext = <
  TInterpreterNode,
  TChildContext,
  TChildContextName extends string,
>(
  InterpreterNode: InterpreterNodeClass<TInterpreterNode, TChildContext>,
  childContextName: TChildContextName,
) => {
  const parseParentContext = <
    TTChildContext extends TChildContext | undefined
  >(
    parentContext: TTParentContext<TChildContext, TTChildContext, TChildContextName>
  ): TTParsedInterpreterNode<TInterpreterNode, TChildContext, TTChildContext> => {
    const childContext = parentContext[childContextName]();

    if (childContext === undefined) {
      return null as TTParsedInterpreterNode<TInterpreterNode, TChildContext, TTChildContext>;
    }

    return new InterpreterNode(childContext) as TTParsedInterpreterNode<TInterpreterNode, TChildContext, TTChildContext>;
  };

  return parseParentContext;
}
