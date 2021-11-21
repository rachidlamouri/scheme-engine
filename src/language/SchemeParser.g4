parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: literal EOF;

literal: QUOTE symbolicExpression;

symbolicExpression: LIST | ATOM;
