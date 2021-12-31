lexer grammar SchemeLexer;

QUOTE: '\'';

IMPORT: 'import';

DEFINE: 'define';

LAMBDA: 'lambda';

COND: 'cond';

ELSE: 'else';

BOOLEAN: '#t' | '#f';

STRING: ('A'..'z' | '*' | '$' | '?')+;

IMPORT_PATH: (STRING | '/')+;

INTEGER: '1'..'9'+ '0'..'9'*;

LEFT_SEPARATOR: '(';

RIGHT_SEPARATOR: ')';

WS: [ \n] -> skip;
