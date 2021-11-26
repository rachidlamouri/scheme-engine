import { IntegerAtomContext } from '../language/compiled/SchemeParser';
import { buildParseParentContext } from './utils';

export class IntegerAtom {
  static parseParentContext = buildParseParentContext<IntegerAtom, IntegerAtomContext, 'integerAtom'>(IntegerAtom, 'integerAtom');

  constructor (private integerAtomContext: IntegerAtomContext) {}

  toResult(): string {
    return this.integerAtomContext.text;
  }
}
