/**
 * Borrowing the Type interface from Angular:
 * https://github.com/angular/angular/blob/6.1.6/packages/core/src/type.ts
 */
export interface Type<T> extends Function {
  new (...args: any[]): T;
}
