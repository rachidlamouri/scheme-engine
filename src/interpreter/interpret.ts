import { InputContext } from '../language/compiled/SchemeParser';
import { refineInputContext } from './input';

export const interpret = (rootAstNode: InputContext): string => {
  return refineInputContext(rootAstNode)
    .map((evaluable) => evaluable.evaluate().toString())
    .join('\n');
}
