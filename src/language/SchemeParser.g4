parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: literal EOF;

literal: QUOTE (list | ATOM);

list: LEFT_SEPARATOR (ATOM | ATOM_GROUP) RIGHT_SEPARATOR;
