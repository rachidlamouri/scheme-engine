import { AbstractParseTreeVisitor, TerminalNode } from 'antlr4ts/tree';
import { InputContext } from './language/compiled/SchemeParser';
import { SchemeVisitor } from './language/compiled/SchemeVisitor';

export type InterpretedResult = string;

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeVisitor<InterpretedResult> {
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
