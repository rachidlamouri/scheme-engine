parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: evaluableGroup EOF;

evaluableGroup:
  evaluable evaluableGroup
  | evaluable
  ;

evaluable: expression | literal;

expression: LEFT_SEPARATOR KEYWORD evaluableGroup RIGHT_SEPARATOR;

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
