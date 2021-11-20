lexer grammar SchemeLexer;

NUMBER: '1'..'9'+ '0'..'9'*;

STRING: '\'' ('a'..'z' | '*' | '$')+;

WS: [\n] -> skip;
