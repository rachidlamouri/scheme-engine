export abstract class Evaluable {
  abstract evaluate(...args: any[]): Evaluable;
}