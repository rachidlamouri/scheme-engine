import { IntegerAtomContext } from '../language/compiled/SchemeParser';
import { buildParseParentContext, InterpretedResult } from './utils';

export class IntegerAtom {
  static parseParentContext = buildParseParentContext<IntegerAtom, IntegerAtomContext, 'integerAtom'>(IntegerAtom, 'integerAtom');

  constructor (private integerAtomContext: IntegerAtomContext) {}

  toResult(): InterpretedResult {
    return this.integerAtomContext.text;
  }
}