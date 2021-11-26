import { InputContext } from '../language/compiled/SchemeParser';
import { Evaluable, parseEvaluableParentContext } from './evaluable';

export const parseInputContext = (inputContext: InputContext): Evaluable => parseEvaluableParentContext(inputContext);
