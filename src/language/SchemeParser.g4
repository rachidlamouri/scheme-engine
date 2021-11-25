parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: (literal | expression) EOF;

literal: QUOTE symbolicExpression;

symbolicExpression: list | atom;

expression: LEFT_SEPARATOR CAR LEFT_SEPARATOR symbolicExpressionGroup RIGHT_SEPARATOR RIGHT_SEPARATOR;

list:
  LEFT_SEPARATOR symbolicExpressionGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR RIGHT_SEPARATOR
  ;

symbolicExpressionGroup:
  symbolicExpression symbolicExpressionGroup
  | symbolicExpression
  ;

atom:
  STRING
  | INTEGER
  ;
