lexer grammar SchemeLexer;

QUOTE: '\'';

IMPORT: 'import';

DEFINE: 'define';

LAMBDA: 'lambda';

COND: 'cond';

ELSE: 'else';

BOOLEAN: '#t' | '#f';

INTEGER: '0' | '-'?'1'..'9'+ '0'..'9'*;

STRING: ('A'..'z' | '0'..'9' | '*' | '$' | '?')+;

IMPORT_PATH: STRING ('/' STRING)+;

LEFT_SEPARATOR: '(';

RIGHT_SEPARATOR: ')';

WS: [ \n] -> skip;
