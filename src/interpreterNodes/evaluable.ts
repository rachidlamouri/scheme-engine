import { Serializeable } from './utils';

export abstract class Evaluable implements Serializeable {
  abstract evaluate(...args: any[]): Evaluable;

  abstract serialize(): string;
}
