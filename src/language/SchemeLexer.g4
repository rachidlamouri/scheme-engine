lexer grammar SchemeLexer;

STRING: '\'' 'a'..'z'+;

WS: [\n] -> skip;
