export class SchemeBoolean {
  constructor(private booleanValue: boolean) {}

  isAtom() {
    return new SchemeBoolean(true);
  }

  toString() {
    return `${this.booleanValue}`;
  }
}
