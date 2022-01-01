import fs from 'fs';
import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';
import { Lambda } from './lambda';

export const pluralize = (arg: any[], singular: string, plural: string) => `${arg.length} ${arg.length === 1 ? singular : plural}`;

export type StackFrame = Readonly<Record<string, Evaluable>>;
export const createStackFrame = (): StackFrame => ({});

export class ExecutionContext {
  protected callStack: StackFrame[] = [createStackFrame()];
  protected debugLog: string[] = [];

  /**
   * Should only be run via the ExecutionContext in a Closure
   */
  call(lambda: Lambda, parameters: Evaluable[]): Evaluable {
    this.callStack.push(createStackFrame());

    let result: Evaluable | null = null;
    let error: unknown;
    try {
      lambda.parameterReferences.forEach((reference, index) => {
        const value = parameters[index];
        this.register(reference, value);
      });
      result = lambda.evaluate(this);
    } catch (e) {
      error = e;
      this.log('Error in closure!')
      this.dumpCallStackToLog();
    }

    if (result === null) {
      throw error;
    }

    this.callStack.pop();
    return result;
  }

  createAndRegisterClosure(reference: ReferenceAtom, lambda: Lambda): Closure {
    const newExecutionContext = new ExecutionContext();
    newExecutionContext.callStack = this.callStack.slice();
    newExecutionContext.debugLog = this.debugLog;

    const closure = new Closure(lambda, newExecutionContext);
    this.register(reference, closure);
    newExecutionContext.register(reference, closure);

    return closure;
  }

  dumpCallStackToLog() {
    this.logNewline();
    this.log(`Dumping ExecutionContext call stack: ${pluralize(this.callStack, 'frame', 'frames')}`);
    this.callStack
      .slice()
      .map((stackFrame, index) => ({ stackFrame, index }))
      .forEach(({ stackFrame, index }) => {
        const entries = Object.entries(stackFrame);
        this.log(`    Frame ${index}: ${pluralize(entries, 'reference', 'references')}`);
        entries.forEach(([key, value]) => {
          this.log(`      ${key}: ${value.constructor.name}`);
        })
      })
    this.logNewline();
  }

  private get head(): StackFrame {
    return this.callStack[this.callStack.length - 1];
  }

  private set head(stackFrame: StackFrame) {
    this.callStack[this.callStack.length - 1] = stackFrame;
  }

  log(text: string) {
    this.debugLog.push(text);
  }

  logNewline() {
    this.log('');
  }

  lookup(key: string): Evaluable | undefined {
    for (let i = this.callStack.length - 1; i >= 0; i -= 1) {
      const frame = this.callStack[i];
      if (key in frame) {
        return frame[key];
      }
    }

    return this.head[key];
  }

  register(reference: ReferenceAtom, evaluable: Evaluable<any>) {
    this.log(`Registering: ${reference.key} -> ${evaluable.constructor.name}`);

    if (this.head[reference.key] !== undefined) {
      throw Error(`Reference "${reference.key}" already exists`);
    }

    this.head = {
      ...this.head,
      [reference.key]: evaluable,
    }
  }

  writeLog() {
    if (process.env.SCHEME_DEBUG !== 'true') {
      return;
    }

    const debugDir = 'debug';
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir);
    }

    const filename =
      new Date().toISOString()
        .replace(/-/g, '')
        .replace(/:/g, '')
    fs.writeFileSync(`${debugDir}/${filename}`, this.debugLog.join('\n'));
  }
}

export class Closure extends Evaluable<Evaluable[]> {
  constructor(public readonly lambda: Lambda, private executionContext: ExecutionContext) {
    super();
  }

  evaluate(parentExecutionContext: ExecutionContext, parameters: Evaluable[]): Evaluable {
    super.logEvaluation(parentExecutionContext);

    return this.executionContext.call(this.lambda, parameters);
  }

  serialize(): string {
    throw Error('Not implemented');
  }
}
