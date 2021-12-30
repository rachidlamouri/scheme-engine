// This class has to live outside of ./evaluable to prevent circular import dependencies
// Almost everything is an Evaluable but "refineEvaluableContext" needs to import everything
export abstract class Evaluable {
  abstract evaluate(...args: any[]): Evaluable;
}
