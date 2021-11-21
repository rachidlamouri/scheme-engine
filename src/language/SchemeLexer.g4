lexer grammar SchemeLexer;

ATOM:
  INTEGER
  | STRING
  ;

ATOM_GROUP: ATOM (' ' ATOM)+;

fragment INTEGER: '1'..'9'+ '0'..'9'*;

fragment STRING: ('a'..'z' | '*' | '$')+;

LEFT_SEPARATOR: '(';

RIGHT_SEPARATOR: ')';

QUOTE: '\'';

WS: [\n] -> skip;
