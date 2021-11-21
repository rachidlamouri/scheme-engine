import { CommonTokenStream } from 'antlr4ts';
import { InputContext, SchemeParser } from './language/compiled/SchemeParser';
import { tokenNamesByType } from './language/tokenNamesByType';

type LogSuppressor = {
  originalLogger: typeof console.error;
  logs: any[];
  disableLogs: Function;
  enableLogs: Function;
}

const errorLogSuppressor: LogSuppressor = {
  originalLogger: console.error,
  logs: [],
  disableLogs() {
    this.logs = [];
    console.error = (...args) => this.logs.push(args);
  },
  enableLogs() {
    console.error = this.originalLogger;
    return this.logs;
  },
};

export const parse = (tokenStream: CommonTokenStream): InputContext => {
  const parser = new SchemeParser(tokenStream);
  errorLogSuppressor.disableLogs();
  const rootAstNode = parser.input();
  const errors = errorLogSuppressor.enableLogs();
  if (errors.length > 0) {
    const tokens = tokenStream
      .getTokens()
      .map((t) => [tokenNamesByType[t.type] ?? '?', t.text])
      .map(([tokenName, text]) => `[${tokenName}|${text}]`)
      .join('')

    const message = [
      `Unable to parse input`,
      `Tokens: ${tokens}`,
      errors.map((args: any[]) => args.join('')).join('\n'),
    ].join('\n')
    throw Error(message);
  }

  return rootAstNode;
}
