// TODO: figure out why we need to do this (btw it wasn't necessary one commit ago):
// import modules that have circular dependencies first
import './symbolicExpression';
import './evaluable';

export { Evaluable } from './evaluableClass';
export { executionContext } from './executionContext';
export { refineInputContext as refineRootAstNode } from './input';
export { interpret } from './interpret';
