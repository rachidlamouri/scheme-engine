parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

atom:
  STRING
  | NUMBER
  ;

input: atom EOF;
