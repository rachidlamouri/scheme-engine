import { ExpressionContext } from '../language/compiled/SchemeParser';
import { AtomGroup } from './atomGroup';
import { buildParseParentContext, InterpretedResult } from './utils';

export class Expression {
  static parseParentContext = buildParseParentContext<Expression, ExpressionContext, 'expression'>(Expression, 'expression');

  private atomGroup: AtomGroup;

  constructor(expresssionContext: ExpressionContext) {
    this.atomGroup = AtomGroup.parseParentContext(expresssionContext);
  }

  evaluate(): InterpretedResult {
    return this.atomGroup.firstAtom().toResult();
  }
}
