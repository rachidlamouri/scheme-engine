import { Evaluable } from './evaluableClass';

class ExecutionContext {
  private lookupTable: Record<string, Evaluable> = {};

  debug() {
    const entries = Object.entries(this.lookupTable);
    console.log('ExecutionContext:', entries.length, 'references')
    entries.forEach(([key, value]) => {
      console.log('   ', key, value.constructor.name);
    })
    console.log();
  }

  register(key: string, evaluable: Evaluable) {
    if (this.lookupTable[key] !== undefined) {
      throw Error(`Reference "${key}" already exists`);
    }

    this.lookupTable[key] = evaluable;
  }

  lookup(key: string): Evaluable | undefined {
    return this.lookupTable[key];
  }

  reset() {
    this.lookupTable = {};
  }
}

export const executionContext = new ExecutionContext();
