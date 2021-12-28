import { InputContext } from '../language/compiled/SchemeParser';
import { parseEvaluableGroupParentContext } from './evaluableGroup';
import { SymbolicExpression } from './symbolicExpression';

export const parseInputContext = (inputContext: InputContext): SymbolicExpression[] => parseEvaluableGroupParentContext(inputContext);
