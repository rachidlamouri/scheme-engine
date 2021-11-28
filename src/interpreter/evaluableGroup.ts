import { EvaluableGroupContext, EvaluableContext } from '../language/compiled/SchemeParser';
import { Evaluable, parseEvaluableParentContext } from './evaluable';
import { buildParseParentContext } from './utils';

export class EvaluableGroup {
  static parseParentContext = buildParseParentContext<
    EvaluableGroup,
    EvaluableGroupContext,
    'evaluableGroup'
  >(EvaluableGroup, 'evaluableGroup');

  private evaluable: Evaluable;
  private evaluableGroup: EvaluableGroup | null;

  constructor(evaluableGroupContext: EvaluableGroupContext) {
    this.evaluable = parseEvaluableParentContext<EvaluableContext>(evaluableGroupContext);
    this.evaluableGroup = EvaluableGroup.parseParentContext(evaluableGroupContext);
  }

  toArray(): Evaluable[] {
    if (this.evaluableGroup) {
      return [this.evaluable, ...this.evaluableGroup.toArray()];
    }

    return [this.evaluable];
  }
}
