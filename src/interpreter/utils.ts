export type ParentContext<Key extends string, ChildContext> = Record<Key, () => ChildContext>;
