import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { SchemeLexer } from './language/compiled/SchemeLexer';

export const tokenize = (code: string): CommonTokenStream => {
  const lexer = new SchemeLexer(CharStreams.fromString(code));
  const tokenStream = new CommonTokenStream(lexer);
  return tokenStream;
}
