parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: LITERAL EOF;
