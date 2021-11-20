grammar Scheme;

WS: [\n] -> skip;

STRING: '\'' 'a'..'z'+;

input: STRING EOF;
