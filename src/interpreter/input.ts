import { InputContext } from '../language/compiled/SchemeParser';
import { Evaluable } from './evaluable';
import { refineEvaluableGroupContext } from './evaluableGroup';

export const refineInputContext = (inputContext: InputContext): Evaluable[] => (
  refineEvaluableGroupContext(inputContext.evaluableGroup())
);
