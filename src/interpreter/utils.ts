export class UnreachableError extends Error {
  constructor() {
    super('This code should be unreachable');
  }
}
