export type ParentContext<Key extends string, ChildContext> = Record<Key, () => ChildContext>;

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
