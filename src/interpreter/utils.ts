import { ParserRuleContext } from 'antlr4ts';

export class UnhandledContextError extends Error {
  constructor(context: ParserRuleContext) {
    super(`Unhandled "${context.constructor.name}" with children [${context.children?.map((c) => c.constructor.name).join(', ')}]`);
  }
}
