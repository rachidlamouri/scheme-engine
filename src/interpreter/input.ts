import { InputContext } from '../language/compiled/SchemeParser';
import { Literal } from './literal';
import { Expression } from './expression';

export class Input {
  static parse(inputContext: InputContext): Literal | Expression {
    return Literal.parseParentContext(inputContext) ?? Expression.parseParentContext(inputContext)!;
  }
}
