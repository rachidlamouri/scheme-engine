import { StringAtomContext } from '../language/compiled/SchemeParser';
import { buildParseParentContext, InterpretedResult } from './utils';

export class StringAtom {
  static parseParentContext = buildParseParentContext<StringAtom, StringAtomContext, 'stringAtom'>(StringAtom, 'stringAtom');

  constructor (private stringAtomContext: StringAtomContext) {}

  toResult(): InterpretedResult {
    return this.stringAtomContext.text;
  }
}
