lexer grammar SchemeLexer;

fragment QUOTE: '\'';

fragment NUMBER: '1'..'9'+ '0'..'9'*;

fragment STRING: ('a'..'z' | '*' | '$')+;

fragment ATOM:
  NUMBER
  | STRING
  ;

fragment LIST: '(' ATOM (' ' ATOM)* ')';

fragment QUOTED_LITERAL: QUOTE (ATOM | LIST);

LITERAL: QUOTED_LITERAL | NUMBER;

WS: [\n] -> skip;
