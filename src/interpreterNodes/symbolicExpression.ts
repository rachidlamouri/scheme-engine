import { List } from './list';
import { Atom } from './atom';

export type SymbolicExpression = List | Atom;

export const isSymbolicExpression = (arg: any): arg is SymbolicExpression => arg instanceof List || arg instanceof Atom;
