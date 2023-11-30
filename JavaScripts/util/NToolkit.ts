/**
 * Prototype of a class constructor.
 */
export type Constructor<TResult> = new (...args: Array<any>) => TResult;

/**
 * A function taking one argument and returning a boolean result.
 * TArg void default.
 */
export type Predicate<TArg = void> = (arg: TArg) => boolean;

class NToolkit {

}

export default new NToolkit();