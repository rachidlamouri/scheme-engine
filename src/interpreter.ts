import { AbstractParseTreeVisitor, TerminalNode } from 'antlr4ts/tree';
import { AtomContext, InputContext } from './language/compiled/SchemeParser';
import { SchemeParserVisitor } from './language/compiled/SchemeParserVisitor';

export type InterpretedResult = string;

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(context: InputContext) {
    return this.visitAtom(context.atom());
  }

  visitAtom(context: AtomContext) {
    const number = context.NUMBER();
    const string = context.STRING();

    if (number) {
      return number.text;
    }

    return string!.text;
  }
}

export const interpreter = new Interpreter();
