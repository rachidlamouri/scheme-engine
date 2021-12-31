import { List } from './list';
import { Atom } from './atom';
import { Primitive } from './utils';

export type SymbolicExpression = List | Atom<Primitive>;

export const isSymbolicExpression = (arg: any): arg is SymbolicExpression => arg instanceof List || arg instanceof Atom;
