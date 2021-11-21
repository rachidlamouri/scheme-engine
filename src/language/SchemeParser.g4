parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: literal EOF;

literal: QUOTE symbolicExpression;

symbolicExpression: list | atom;

list:
  LEFT_SEPARATOR group RIGHT_SEPARATOR
  | LEFT_SEPARATOR RIGHT_SEPARATOR
  ;

group:
  symbolicExpression group
  | symbolicExpression
  ;

atom:
  STRING
  | INTEGER
  ;
