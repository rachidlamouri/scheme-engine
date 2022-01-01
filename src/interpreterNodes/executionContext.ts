import fs from 'fs';
import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';

export const pluralize = (arg: any[], singular: string, plural: string) => `${arg.length} ${arg.length === 1 ? singular : plural}`;

type LookupTable = Record<string, Evaluable>;

export class ExecutionContext {
  private lookupTable: LookupTable = {};
  private debugLog: string[] = [];

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

  register(reference: ReferenceAtom, evaluable: Evaluable) {
    if (this.lookupTable[reference.key] !== undefined) {
      throw Error(`Reference "${reference.key}" already exists`);
    }

    this.lookupTable[reference.key] = evaluable;
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
