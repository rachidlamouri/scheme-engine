import { AbstractParseTreeVisitor } from 'antlr4ts/tree';
import { InputContext } from '../language/compiled/SchemeParser';
import { SchemeParserVisitor } from '../language/compiled/SchemeParserVisitor';
import { parseInputContext } from './input';
import { Expression } from './expression';
import { InterpretedResult } from './utils';

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(inputContext: InputContext): string {
    const input = parseInputContext(inputContext);
    return (input instanceof Expression) ? (input.evaluate()?.toResult() ?? '') : input.toResult();
  }
}

export const interpreter = new Interpreter();
