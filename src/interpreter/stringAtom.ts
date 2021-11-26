import { StringAtomContext } from '../language/compiled/SchemeParser';
import { buildParseParentContext } from './utils';

export class StringAtom {
  static parseParentContext = buildParseParentContext<StringAtom, StringAtomContext, 'stringAtom'>(StringAtom, 'stringAtom');

  constructor (private stringAtomContext: StringAtomContext) {}

  toString(): string {
    return this.stringAtomContext.text;
  }
}
