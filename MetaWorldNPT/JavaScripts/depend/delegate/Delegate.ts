/**
 * Delegate.
 *
 * @desc provide some useful delegate.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 2.1.6b
 */
export namespace Delegate {
    interface IDelegate<T, Func extends Function> {
        /**
         * add a delegate.
         * @param {Func extends Funciton} func
         * @param {number} alive call times.
         *      default = -1. 无限制.
         * @param {boolean} repeatable  whether can be added repeatedly.
         *      default = false.
         * @return {boolean}
         *      - true success.
         *      - false already exist.
         */
        add(func: Func, alive: number, repeatable: boolean): boolean;

        add(func: Func, alive: number): boolean;

        add(func: Func): boolean;

        /**
         * add a delegate. can be only invoke once.
         * behaves the same as add(func, 1)
         * @param {Func extends Function} func
         * @return {boolean}
         *      - true success.
         *      - false already exist.
         */
        once(func: Func): boolean;

        /**
         * add a delegate as the only alive callback.
         * @desc remove all and add this.
         * @param func
         */
        only(func: Func): boolean;

        /**
         * invoke delegate.
         * @desc you should not rely on the add order.
         * @param param
         */
        invoke(param: T): void;

        /**
         * remove a delegate.
         * @param func
         * @return boolean
         *      - true success.
         *      - false already exist.
         */
        remove(func: Func): boolean;

        /**
         * remove all delegate.
         */
        clear(): void;
    }

    export type SimpleDelegateFunction<T> = (param: T) => void;

    export type ConditionDelegateFunction<T> = (param: T) => boolean;

    abstract class DelegateInfo {
        callback: Function;
        hitPoint: number;

        protected constructor(callback: Function, hitPoint: number) {
            this.callback = callback;
            this.hitPoint = hitPoint;
        }
    }

    class SimpleDelegateInfo<T> extends DelegateInfo {
        declare callback: SimpleDelegateFunction<T>;

        constructor(callback: SimpleDelegateFunction<T>, hitPoint: number) {
            super(callback, hitPoint);
        }
    }

    class ConditionDelegateInfo<T> extends DelegateInfo {
        declare callback: ConditionDelegateFunction<T>;

        constructor(callback: ConditionDelegateFunction<T>, hitPoint: number) {
            super(callback, hitPoint);
            this.callback = callback;
        }
    }

    /**
     * Simple Delegate.
     * 简单委托.
     *
     * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
     * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
     * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
     * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
     * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
     * @author LviatYi
     * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
     * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
     */
    export class SimpleDelegate<T> implements IDelegate<T, SimpleDelegateFunction<T>> {
        private _callbackInfo: SimpleDelegateInfo<T>[] = [];

        public add(func: SimpleDelegateFunction<T>, alive: number = -1, repeatable: boolean = false): boolean {
            if (!repeatable && this.getIndex(func) !== -1) {
                return false;
            }
            this._callbackInfo.push(new SimpleDelegateInfo(func, alive));
        }

        public once(func: SimpleDelegateFunction<T>): boolean {
            return this.add(func, 1);
        }

        public only(func: SimpleDelegateFunction<T>): boolean {
            this.clear();
            return this.add(func);
        }

        public invoke(param?: T): void {
            for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
                const callbackInfo = this._callbackInfo[i];

                try {
                    if (callbackInfo.hitPoint !== 0) {
                        callbackInfo.callback(param);
                    }
                    if (callbackInfo.hitPoint > 0) --callbackInfo.hitPoint;
                    if (callbackInfo.hitPoint === 0) this.removeByIndex(i);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        public remove(func: SimpleDelegateFunction<T>): boolean {
            const index: number = this.getIndex(func);
            if (index !== -1) {
                this._callbackInfo.splice(index, 1);
                return true;
            }
            return false;
        }

        public clear(): void {
            this._callbackInfo.length = 0;
        }

        /**
         * try to get the index of an existing delegate.
         * @param func
         * @return index func index. -1 not exist.
         * @private
         */
        private getIndex(func: SimpleDelegateFunction<T>): number {
            return this._callbackInfo.findIndex(item => {
                return item.callback === func;
            });
        }

        /**
         * remove Func by index.
         * @param index
         * @private
         */
        private removeByIndex(index: number): void {
            this._callbackInfo.splice(index, 1);
        }
    }

    /**
     * Condition Delegate
     * 条件委托.
     *
     * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
     * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
     * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
     * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
     * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
     * @author LviatYi
     * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
     * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
     */
    export class ConditionDelegate<T> implements IDelegate<T, ConditionDelegateFunction<T>> {
        private _callbackInfo: ConditionDelegateInfo<T>[] = [];

        public add(func: ConditionDelegateFunction<T>, alive: number = -1, repeatable: boolean = false): boolean {
            if (!repeatable && this.getIndex(func) !== -1) {
                return false;
            }
            this._callbackInfo.push(new ConditionDelegateInfo(func, alive));
        }

        public once(func: ConditionDelegateFunction<T>): boolean {
            return this.add(func, 1);
        }

        public only(func: ConditionDelegateFunction<T>): boolean {
            throw new Error("Method not implemented.");
        }

        public invoke(param: T): void {
            for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
                const callbackInfo = this._callbackInfo[i];
                let ret: boolean;
                if (callbackInfo.hitPoint !== 0) {
                    ret = callbackInfo.callback(param);
                }

                if (callbackInfo.hitPoint > 0 && ret) {
                    --callbackInfo.hitPoint;
                }

                if (callbackInfo.hitPoint === 0) {
                    this.removeByIndex(i);
                }
            }
        }

        public remove(func: ConditionDelegateFunction<T>): boolean {
            const index: number = this.getIndex(func);
            if (index !== -1) {
                this._callbackInfo.splice(index, 1);
                return true;
            }
            return false;
        }

        public clear(): void {
            this._callbackInfo.length = 0;
        }

        private getIndex(func: ConditionDelegateFunction<T>): number {
            return this._callbackInfo.findIndex(item => {
                return item.callback === func;
            });
        }

        private removeByIndex(index: number): void {
            this._callbackInfo.splice(index, 1);
        }
    }
}