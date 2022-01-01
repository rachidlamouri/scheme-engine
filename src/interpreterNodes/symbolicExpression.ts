import { List } from './list';
import { Atom } from './atom';
import { Primitive } from './utils';

export type SymbolicExpression = List | Atom<Primitive>;
