parser grammar SchemeParser;

options { tokenVocab=SchemeLexer; }

input:
  importDeclarationGroup EOF
  | importDeclarationGroup evaluableGroup EOF
  | evaluableGroup EOF
  ;

importDeclarationGroup: LEFT_SEPARATOR IMPORT importPathGroup RIGHT_SEPARATOR;

importPathGroup:
  importPath importPathGroup
  | importPath
  ;

importPath: IMPORT_PATH;

evaluableGroup:
  evaluable evaluableGroup
  | evaluable
  ;

evaluable: callExpression | lambdaReferenceDefinition | referenceLiteral | explicitLiteral;

callExpression:
  LEFT_SEPARATOR (referenceLiteral | plusLiteral | minusLiteral) evaluableGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR referenceLiteral RIGHT_SEPARATOR
  | LEFT_SEPARATOR conditionExpression RIGHT_SEPARATOR
  ;

conditionExpression: COND conditionValuePairGroup elseExpression;

conditionValuePairGroup:
  conditionValuePair conditionValuePairGroup
  | conditionValuePair
  ;

conditionValuePair: LEFT_SEPARATOR (callExpression | booleanLiteral | referenceLiteral) evaluable RIGHT_SEPARATOR;

elseExpression: LEFT_SEPARATOR ELSE evaluable RIGHT_SEPARATOR;

lambdaReferenceDefinition: LEFT_SEPARATOR DEFINE referenceLiteral lambdaDefinition RIGHT_SEPARATOR;

lambdaDefinition:
  LEFT_SEPARATOR LAMBDA LEFT_SEPARATOR referenceLiteralGroup RIGHT_SEPARATOR evaluable RIGHT_SEPARATOR
  | LEFT_SEPARATOR LAMBDA LEFT_SEPARATOR RIGHT_SEPARATOR evaluable RIGHT_SEPARATOR
  ;

explicitLiteral:
  QUOTE implicitLiteral
  | integerLiteral
  | booleanLiteral
  ;

implicitLiteral:
  list
  | stringLiteral
  | integerLiteral
  | booleanLiteral
  ;

list:
  LEFT_SEPARATOR literalGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR RIGHT_SEPARATOR
  ;

literalGroup:
  literal literalGroup
  | literal
  ;

literal: explicitLiteral | implicitLiteral;

stringLiteral: STRING;

integerLiteral: INTEGER;

booleanLiteral: BOOLEAN;

referenceLiteralGroup:
  referenceLiteral referenceLiteralGroup
  | referenceLiteral
  ;

referenceLiteral: STRING;

plusLiteral: PLUS;

minusLiteral: MINUS;
