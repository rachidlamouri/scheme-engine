parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: evaluableGroup EOF;

evaluableGroup:
  evaluable evaluableGroup
  | evaluable
  ;

evaluable: callExpression | lambdaReferenceDefinition | referenceAtom | literal;

callExpression:
  LEFT_SEPARATOR referenceAtom evaluableGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR referenceAtom RIGHT_SEPARATOR
  ;

lambdaReferenceDefinition: LEFT_SEPARATOR DEFINE referenceAtom lambdaDefinition RIGHT_SEPARATOR;

lambdaDefinition:
  LEFT_SEPARATOR LAMBDA LEFT_SEPARATOR referenceAtomGroup RIGHT_SEPARATOR evaluable RIGHT_SEPARATOR
  | LEFT_SEPARATOR LAMBDA LEFT_SEPARATOR RIGHT_SEPARATOR evaluable RIGHT_SEPARATOR
  ;

literal: (QUOTE symbolicExpression) | integerAtom ;

symbolicExpression: list | atom;

list:
  LEFT_SEPARATOR symbolicExpressionGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR RIGHT_SEPARATOR
  ;

symbolicExpressionGroup:
  symbolicExpression symbolicExpressionGroup
  | symbolicExpression
  ;

atom:
  stringAtom
  | integerAtom
  ;

stringAtom: STRING;

integerAtom: INTEGER;

referenceAtomGroup:
  referenceAtom referenceAtomGroup
  | referenceAtom
  ;

referenceAtom: STRING;
