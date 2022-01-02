import { ReferenceAtom } from './interpreterNodes/atom';
import { Evaluable } from './interpreterNodes/evaluable';
import { ExecutionContext } from './interpreterNodes/executionContext';
import { Serializeable } from './interpreterNodes/utils';

export class InterpretedResult implements Serializeable  {
  constructor(public readonly evaluables: Evaluable[]) {}

  serialize(includeReferenceDefinitions: boolean = process.env.SCHEME_DEBUG === 'true') {
    return this.evaluables
      .filter((e) => includeReferenceDefinitions || !(e instanceof ReferenceAtom))
      .map((e) => e.serialize()).join('\n');
  }
}

export const interpret = (executionContext: ExecutionContext, evaluables: Evaluable[]): InterpretedResult => (
  new InterpretedResult(
    evaluables.map((e) => e.evaluate(executionContext))
  )
);
