import { ListContext } from '../language/compiled/SchemeParser';
import { SymbolicExpressionGroup } from './symbolicExpressionGroup';
import { buildParseParentContext, InterpretedResult } from './utils';

export class List {
  static parseParentContext = buildParseParentContext<List, ListContext, 'list'>(List, 'list');

  protected symbolicExpressionGroup: SymbolicExpressionGroup | null;

  constructor(listContext: ListContext) {
    this.symbolicExpressionGroup = SymbolicExpressionGroup.parseParentContext(listContext);
  }

  isNotEmpty(): this is { symbolicExpressionGroup: SymbolicExpressionGroup }  {
    return this.symbolicExpressionGroup !== null;
  }

  toResult(): InterpretedResult {
    const groupText = this.isNotEmpty() ? this.symbolicExpressionGroup.toResult() : '';
    return `(${groupText})`;
  }
}
