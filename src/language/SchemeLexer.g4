lexer grammar SchemeLexer;

QUOTE: '\'';

BUILT_IN_FUNCTION: 'car' | 'cdr' | 'cons' | 'null?' | 'atom?' | 'eq?';

STRING: ('A'..'z' | '*' | '$')+;

INTEGER: '1'..'9'+ '0'..'9'*;

LEFT_SEPARATOR: '(';

RIGHT_SEPARATOR: ')';

WS: [ \n] -> skip;
