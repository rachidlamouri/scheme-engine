import fs from 'fs';
import { Evaluable } from './evaluable';

export const pluralize = (arg: any[], singular: string, plural: string) => `${arg.length} ${arg.length === 1 ? singular : plural}`;

type LookupTable = Record<string, Evaluable>;
type DebugLog = string[];

const createLookupTable = (): LookupTable => ({});
const createDebugLog = (): DebugLog => [];

class ExecutionContext {
  private lookupTable: LookupTable = createLookupTable();
  private debugLog: string[] = createDebugLog();

  dumpTableToLog() {
    const entries = Object.entries(this.lookupTable);
    this.logNewline();
    this.log('Dumping ExecutionContext');
    this.log(`  ${pluralize(entries, 'reference', 'references')}`);
    entries.forEach(([key, value]) => {
      this.log(`    ${key}: ${value.constructor.name}`);
    })
    this.logNewline;
  }

  log(text: string) {
    this.debugLog.push(text);
  }

  logNewline() {
    this.log('');
  }

  lookup(key: string): Evaluable | undefined {
    return this.lookupTable[key];
  }

  register(key: string, evaluable: Evaluable) {
    if (this.lookupTable[key] !== undefined) {
      throw Error(`Reference "${key}" already exists`);
    }

    this.lookupTable[key] = evaluable;
  }

  reset() {
    this.lookupTable = createLookupTable();
    this.debugLog = createDebugLog();
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

export const globalExecutionContext = new ExecutionContext();
