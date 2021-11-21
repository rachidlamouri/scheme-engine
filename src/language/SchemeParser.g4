parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: (literal | expression) EOF;

literal: QUOTE symbolicExpression;

symbolicExpression: list | atom;

expression: LEFT_SEPARATOR CAR LEFT_SEPARATOR atomGroup RIGHT_SEPARATOR RIGHT_SEPARATOR;

list:
  LEFT_SEPARATOR group RIGHT_SEPARATOR
  | LEFT_SEPARATOR RIGHT_SEPARATOR
  ;

group:
  symbolicExpression group
  | symbolicExpression
  ;

atomGroup:
  atom atomGroup
  | atom
  ;

atom:
  STRING
  | INTEGER
  ;
