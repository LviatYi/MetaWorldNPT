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
 * @version 2.0.1b
 */
export namespace Delegate {
    type SimpleDelegateFunction<T> = (param: T) => void;

    type ConditionDelegateFunction<T> = (param: T) => boolean;

    abstract class DelegateInfo {
        callback: Function;
        hitPoint: number;

        constructor(callback: Function, hitPoint: number) {
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
    export class SimpleDelegate<T> {
        private _callbackInfo: SimpleDelegateInfo<T>[] = [];

        /**
         * add a delegate.
         * @param func
         * @param alive call times.
         *      default = -1. 无限制.
         * @return boolean
         *      - true success.
         *      - false already exist.
         * @public
         */
        public add(func: SimpleDelegateFunction<T>, alive: number = -1): boolean {
            if (this.getIndex(func) !== -1) {
                return false;
            }
            this._callbackInfo.push(new SimpleDelegateInfo(func, alive));
        }

        /**
         * add a delegate. can be only invoke once.
         * behaves the same as add(func, 1)
         * @param func
         * @return boolean
         *      - true success.
         *      - false already exist.
         * @public
         */
        public once(func: SimpleDelegateFunction<T>): boolean {
            return this.add(func, 1);
        }

        /**
         * invoke delegate.
         * @desc you should not rely on the add order.
         * @param param
         * @public
         */
        public invoke(param?: T): void {
            for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
                const callbackInfo = this._callbackInfo[i];

                if (callbackInfo.hitPoint !== 0) {
                    callbackInfo.callback(param);
                }

                if (callbackInfo.hitPoint > 0) {
                    --callbackInfo.hitPoint;
                }

                if (callbackInfo.hitPoint === 0) {
                    this.removeByIndex(i);
                }
            }
        }

        /**
         * remove a delegate.
         * @param func
         * @return boolean
         *      - true success.
         *      - false already exist.
         * @public
         */
        public remove(func: SimpleDelegateFunction<T>): boolean {
            const index: number = this.getIndex(func);
            if (index !== -1) {
                this._callbackInfo.splice(index, 1);
                return true;
            }
            return false;
        }

        /**
         * remove all delegate.
         * @public
         */
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
    export class ConditionDelegate<T> {
        private _callbackInfo: ConditionDelegateInfo<T>[] = [];

        /**
         * add a delegate.
         * @param func
         * @param alive call times.
         *      default = -1. 无限制.
         * @return boolean
         *      - true success.
         *      - false already exist.
         * @public
         */
        public add(func: ConditionDelegateFunction<T>, alive: number = -1): boolean {
            if (this.getIndex(func) !== -1) {
                return false;
            }
            this._callbackInfo.push(new ConditionDelegateInfo(func, alive));
        }

        /**
         * add a delegate. can be only invoke once.
         * behaves the same as add(func, 1)
         * @param func
         * @return boolean
         *      - true success.
         *      - false already exist.
         * @public
         */
        public once(func: ConditionDelegateFunction<T>): boolean {
            return this.add(func, 1);
        }

        /**
         * invoke delegate.
         * @desc you should not rely on the add order.
         * @param param
         * @public
         */
        public invoke(param: T): void {
            for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
                const callbackInfo = this._callbackInfo[i];
                let ret: boolean;
                if (callbackInfo.hitPoint !== 0) {
                    ret = callbackInfo.callback(param);
                }

                if (callbackInfo.hitPoint > 0) {
                    --callbackInfo.hitPoint;
                }

                if (callbackInfo.hitPoint === 0) {
                    this.removeByIndex(i);
                }
            }
        }

        /**
         * remove a delegate.
         * @param func
         * @return boolean
         *      - true success.
         *      - false already exist.
         * @public
         */
        public remove(func: ConditionDelegateFunction<T>): boolean {
            const index: number = this.getIndex(func);
            if (index !== -1) {
                this._callbackInfo.splice(index, 1);
                return true;
            }
            return false;
        }

        /**
         * remove all delegate.
         * @public
         */
        public clear(): void {
            this._callbackInfo.length = 0;
        }

        /**
         * try to get the index of an existing delegate.
         * @param func
         * @return index func index. -1 not exist.
         * @private
         */
        private getIndex(func: ConditionDelegateFunction<T>): number {
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
}