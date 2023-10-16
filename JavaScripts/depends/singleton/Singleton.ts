/**
 * Singleton factory.
 * To create a Singleton, extends Singleton<YourClass>().
 * @example
 * class UserDefineSingleton extends Singleton<UserDefineSingleton>() {
 *      public name: string;
 *
 *      public someSubMethod(): void {
 *          console.log("someSubMethod in UserDefineSingleton called");
 *      }
 *
 *      protected onConstruct(): void {
 *          this.name = "user define singleton";
 *      }
 *  }
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @version 1.0.0
 * @constructor
 * @beta
 */
export function Singleton<T>() {
    return class Singleton {
        private static _instance?: T = null;

        public createTime: Date;

        /**
         * we don't recommend to use it.
         * if you want to do something when constructing, override onConstructor.
         * @protected
         */
        protected constructor() {
            this.createTime = new Date();
        }

        public static getInstance(): T {
            if (!this._instance) {
                this._instance = new this() as T;
                (this._instance as Singleton).onConstruct();
            }
            return this._instance;
        }

        /**
         * override when need extend constructor.
         * @virtual
         * @protected
         */
        protected onConstruct(): void {
        }
    };
}