import { AbstractParseTreeVisitor, TerminalNode } from 'antlr4ts/tree';
import { InputContext } from './language/compiled/SchemeParser';
import { SchemeParserVisitor } from './language/compiled/SchemeParserVisitor';

export type InterpretedResult = string;

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(context: InputContext) {
    return this.visitString(context.STRING());
  }

  visitString (node: TerminalNode) {
    return node.text;
  }
}

export const interpreter = new Interpreter();
