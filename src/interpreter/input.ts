import { InputContext } from '../language/compiled/SchemeParser';
import { Literal, parseLiteralParentContext } from './literal';
import { Expression } from './expression';

export class Input {
  static parse(inputContext: InputContext): Literal | Expression {
    return parseLiteralParentContext(inputContext) ?? Expression.parseParentContext(inputContext)!;
  }
}
