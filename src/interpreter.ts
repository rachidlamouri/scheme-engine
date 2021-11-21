import { AbstractParseTreeVisitor } from 'antlr4ts/tree';
import { AtomContext, GroupContext, InputContext, ListContext, LiteralContext, SymbolicExpressionContext } from './language/compiled/SchemeParser';
import { SchemeParserVisitor } from './language/compiled/SchemeParserVisitor';

export type InterpretedResult = string;

const atomToString = (atom: AtomContext): string => atom.text;

const listToString = (list: ListContext): string => {
  const group = list.group();
  const groupText = group ? groupToString(group) : '';
  return `(${groupText})`;
}

const groupToString = (group: GroupContext): string => {
  const subGroup = group.group();
  const [firstExpression, secondExpression] = group.symbolicExpression();
  const firstExpressionText = expressionToString(firstExpression);

  if (subGroup) {
    return `${firstExpressionText} ${groupToString(subGroup)}`;
  }

  if (secondExpression) {
    return `${firstExpressionText} ${expressionToString(secondExpression)}`;
  }

  return firstExpressionText;
}

const expressionToString = (expression: SymbolicExpressionContext): string => {
  const atom = expression.atom();
  const list = expression.list();

  if (atom) {
    return atomToString(atom);
  }

  return listToString(list!);
};

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(input: InputContext) {
    return this.visitLiteral(input.literal());
  }

  visitLiteral(literal: LiteralContext) {
    const atom = literal.atom();
    const list = literal.list();

    if (atom) {
      return atomToString(atom);
    }

    return listToString(list!);
  }
}

export const interpreter = new Interpreter();
