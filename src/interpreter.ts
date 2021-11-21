import { AbstractParseTreeVisitor } from 'antlr4ts/tree';
import { InputContext, LiteralContext } from './language/compiled/SchemeParser';
import { SchemeParserVisitor } from './language/compiled/SchemeParserVisitor';

export type InterpretedResult = string;

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(context: InputContext) {
    return this.visitLiteral(context.literal());
  }

  visitLiteral(literal: LiteralContext) {
    const value = literal.text;

    if (value.startsWith('\'')) {
      return value.slice(1);
    }

    return value;
  }
}

export const interpreter = new Interpreter();
