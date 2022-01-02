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

evaluable: callExpression | lambdaReferenceDefinition | referenceAtom | literal;

callExpression:
  LEFT_SEPARATOR referenceAtom evaluableGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR referenceAtom RIGHT_SEPARATOR
  | LEFT_SEPARATOR conditionExpression RIGHT_SEPARATOR
  ;

conditionExpression: COND conditionValuePairGroup elseExpression;

conditionValuePairGroup:
  conditionValuePair conditionValuePairGroup
  | conditionValuePair
  ;

conditionValuePair: LEFT_SEPARATOR (callExpression | booleanAtom | referenceAtom) evaluable RIGHT_SEPARATOR;

elseExpression: LEFT_SEPARATOR ELSE evaluable RIGHT_SEPARATOR;

lambdaReferenceDefinition: LEFT_SEPARATOR DEFINE referenceAtom lambdaDefinition RIGHT_SEPARATOR;

lambdaDefinition:
  LEFT_SEPARATOR LAMBDA LEFT_SEPARATOR referenceAtomGroup RIGHT_SEPARATOR evaluable RIGHT_SEPARATOR
  | LEFT_SEPARATOR LAMBDA LEFT_SEPARATOR RIGHT_SEPARATOR evaluable RIGHT_SEPARATOR
  ;

literal: (QUOTE symbolicExpression) | integerAtom | booleanAtom ;

symbolicExpression: list | atom;

list:
  LEFT_SEPARATOR symbolicExpressionGroup RIGHT_SEPARATOR
  | LEFT_SEPARATOR RIGHT_SEPARATOR
  ;

symbolicExpressionGroup:
  symbolicExpression symbolicExpressionGroup
  | symbolicExpression
  ;

atom:
  stringAtom
  | integerAtom
  | booleanAtom
  ;

stringAtom: STRING;

integerAtom: INTEGER;

booleanAtom: BOOLEAN;

referenceAtomGroup:
  referenceAtom referenceAtomGroup
  | referenceAtom
  ;

referenceAtom: STRING;
