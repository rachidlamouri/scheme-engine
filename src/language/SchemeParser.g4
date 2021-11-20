parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input: STRING EOF;
