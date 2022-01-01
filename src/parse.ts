import { CommonTokenStream } from 'antlr4ts';
import { Input } from './interpreterNodes/input';
import { parseTokenStream } from './parser/parseTokenStream';
import { refineInputContext } from './parser/refineInputContext';

export const parse = (tokenStream: CommonTokenStream): Input => {
  const rootAstNode = parseTokenStream(tokenStream);
  const refinedRootAstNode = refineInputContext(rootAstNode);
  return refinedRootAstNode;
};
