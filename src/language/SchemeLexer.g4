lexer grammar SchemeLexer;

QUOTE: '\'';

CAR: 'car';

STRING: ('a'..'z' | '*' | '$')+;

INTEGER: '1'..'9'+ '0'..'9'*;

LEFT_SEPARATOR: '(';

RIGHT_SEPARATOR: ')';

WS: [ \n] -> skip;
