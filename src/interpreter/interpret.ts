import { AbstractParseTreeVisitor } from 'antlr4ts/tree';
import { InputContext } from '../language/compiled/SchemeParser';
import { SchemeParserVisitor } from '../language/compiled/SchemeParserVisitor';
import { parseInputContext } from './input';
import { Expression } from './expression';

class Interpreter extends AbstractParseTreeVisitor<string> implements SchemeParserVisitor<string> {
  defaultResult(): string {
    return '';
  }

  visitInput(inputContext: InputContext): string {
    const symbolicExpressions = parseInputContext(inputContext);
    return symbolicExpressions
      .map((symbolicExpression) => symbolicExpression.evaluate().toString())
      .join('\n');
  }
}

const interpreter = new Interpreter();

export const interpret = (rootAstNode: InputContext): string => {
  const result = interpreter.visit(rootAstNode);
  return result;
};
