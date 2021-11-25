import { AtomGroupContext } from '../language/compiled/SchemeParser';
import { Atom } from './atom';
import { buildParseParentContext, InterpretedResult } from './utils';

export class AtomGroup {
  static parseParentContext = buildParseParentContext<AtomGroup, AtomGroupContext, 'atomGroup'>(AtomGroup, 'atomGroup');

  private atom: Atom;
  private atomGroup: AtomGroup | null;

  constructor(atomGroupContext: AtomGroupContext) {
    this.atom = Atom.parseParentContext(atomGroupContext);
    this.atomGroup = AtomGroup.parseParentContext(atomGroupContext);
  }

  firstAtom() {
    return this.atom;
  }

  toResult(): InterpretedResult {
    const atomResult = this.atom.toResult();

    if (this.atomGroup) {
      return `${atomResult} ${this.atomGroup.toResult()}`;
    }

    return atomResult;
  }
}
