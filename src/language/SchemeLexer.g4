lexer grammar SchemeLexer;

ATOM:
  INTEGER
  | STRING
  ;

LIST: LEFT_SEPARATOR (ATOM | LIST) (' ' (ATOM | LIST))* RIGHT_SEPARATOR;

fragment INTEGER: '1'..'9'+ '0'..'9'*;

fragment STRING: ('a'..'z' | '*' | '$')+;

fragment LEFT_SEPARATOR: '(';

fragment RIGHT_SEPARATOR: ')';

QUOTE: '\'';

WS: [\n] -> skip;
