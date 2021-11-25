import { AtomContext } from '../language/compiled/SchemeParser';
import { buildParseParentContext, InterpretedResult } from './utils';

export class Atom {
  static parseParentContext = buildParseParentContext<Atom, AtomContext, 'atom'>(Atom, 'atom');

  constructor(private atomContext: AtomContext) {}

  toResult(): InterpretedResult {
    return this.atomContext.text;
  }
}
