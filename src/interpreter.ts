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
  const firstSExpression = group.symbolicExpression();
  const firstSExpressionText = symbolicExpressionToString(firstSExpression);

  if (subGroup) {
    return `${firstSExpressionText} ${groupToString(subGroup)}`;
  }

  return firstSExpressionText;
}

const symbolicExpressionToString = (sExpression: SymbolicExpressionContext): string => {
  const atom = sExpression.atom();
  const list = sExpression.list();

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
    return symbolicExpressionToString(literal.symbolicExpression());
  }
}

export const interpreter = new Interpreter();
