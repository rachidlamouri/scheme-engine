type InterpreterNodeClass<TInterpreterNode, TChildContext> = { new (childContext: TChildContext): TInterpreterNode };

export const buildParseParentContext = <
  TInterpreterNode,
  TChildContext,
  TChildContextName extends string
>(InterpreterNode: InterpreterNodeClass<TInterpreterNode, TChildContext>, childContextName: TChildContextName) => {
  const parseParentContext = <
    TTChildContext extends TChildContext | undefined
  >(parentContext: Record<TChildContextName, () => TTChildContext>): (TTChildContext extends TChildContext ? TInterpreterNode : TInterpreterNode | null) => {
    const childContext = parentContext[childContextName]();

    return (
      childContext === undefined
        ? null
        : new InterpreterNode(childContext as TChildContext)
    ) as any;
  };

  return parseParentContext;
};
