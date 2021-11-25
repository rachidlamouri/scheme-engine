import { AbstractParseTreeVisitor } from 'antlr4ts/tree';
import { AtomContext, AtomGroupContext, ExpressionContext, GroupContext, InputContext, ListContext, LiteralContext, SymbolicExpressionContext } from '../language/compiled/SchemeParser';
import { SchemeParserVisitor } from '../language/compiled/SchemeParserVisitor';

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

const atomGroupToArray = (group: AtomGroupContext): AtomContext[] => {
  const subGroup = group.atomGroup();
  const firstAtom = group.atom();

  if (subGroup) {
    return [firstAtom, ...atomGroupToArray(subGroup)];
  }

  return [firstAtom];
};

class Interpreter extends AbstractParseTreeVisitor<InterpretedResult> implements SchemeParserVisitor<InterpretedResult> {
  defaultResult() {
    return '';
  }

  visitInput(input: InputContext): string {
    const literal = input.literal();
    const expression = input.expression();

    if (literal) {
      return this.visitLiteral(literal);
    }

    return this.evaluateExpression(expression!);
  }

  visitLiteral(literal: LiteralContext) {
    return symbolicExpressionToString(literal.symbolicExpression());
  }

  evaluateExpression(expression: ExpressionContext): string {
    const atoms = atomGroupToArray(expression.atomGroup());
    return atomToString(atoms[0]);
  }
}

export const interpreter = new Interpreter();
