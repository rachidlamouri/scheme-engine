import { AbstractParseTreeVisitor } from 'antlr4ts/tree';
import { InputContext } from '../language/compiled/SchemeParser';
import { SchemeParserVisitor } from '../language/compiled/SchemeParserVisitor';
import { Input } from './input';
import { Literal } from './literal';
import { InterpretedResult } from './utils';

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(inputContext: InputContext): string {
    const node = Input.parse(inputContext);
    return node instanceof Literal ? node.toResult() : node.evaluate();
  }
}

export const interpreter = new Interpreter();
