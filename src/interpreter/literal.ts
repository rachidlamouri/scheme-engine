import { LiteralContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { buildParseParentContext, InterpretedResult } from './utils';

export class Literal {
  static parseParentContext = buildParseParentContext<Literal, LiteralContext, 'literal'>(Literal, 'literal');

  private symbolicExpression: SymbolicExpression;

  constructor(literalContext: LiteralContext) {
    this.symbolicExpression = parseSymbolicExpressionParentContext(literalContext);
  }

  toResult(): InterpretedResult {
    return this.symbolicExpression.toResult();
  }
}
