import { ListContext } from '../language/compiled/SchemeParser';
import { SymbolicExpressionGroup } from './symbolicExpressionGroup';
import { buildParseParentContext, InterpretedResult } from './utils';

export class List {
  static parseParentContext = buildParseParentContext<List, ListContext, 'list'>(List, 'list');

  protected symbolicExpressionGroup: SymbolicExpressionGroup | null;

  constructor(listContext: ListContext) {
    this.symbolicExpressionGroup = SymbolicExpressionGroup.parseParentContext(listContext);
  }

  first() {
    return this.symbolicExpressionGroup?.first() ?? null;
  }

  toResult(): InterpretedResult {
    const groupText = this.symbolicExpressionGroup?.toResult() ?? '';
    return `(${groupText})`;
  }
}
