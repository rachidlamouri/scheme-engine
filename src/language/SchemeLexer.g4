lexer grammar SchemeLexer;

QUOTE: '\'';

DEFINE: 'define';

LAMBDA: 'lambda';

STRING: ('A'..'z' | '*' | '$' | '?')+;

INTEGER: '1'..'9'+ '0'..'9'*;

LEFT_SEPARATOR: '(';

RIGHT_SEPARATOR: ')';

WS: [ \n] -> skip;
