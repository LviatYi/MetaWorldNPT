/**
 * Yoact 响应式数据.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.3.1b
 */
export namespace Yoact {
    export type Effect = { fn: (...params: unknown[]) => void, activity: boolean };
    type Publisher = Set<Effect>
    type KeyEffectMap = Map<string | symbol, Publisher>;
    const noact: symbol = Symbol("noact");

    const reactiveMap = new WeakMap<object, unknown>();
    const publishMap = new WeakMap<object, KeyEffectMap>;
    const effectStack: Effect[] = [];

    class YoactProxyHandler<T extends object> implements YoactProxyHandler<T> {
        public get(target: object, key: string | symbol, receiver: any): any {
            if (!(target.constructor[noact]?.includes(key) ?? false)) {
                trace(receiver, key);
            }
            return Reflect.get(target, key, receiver);
        }

        public set(target: object, key: string | symbol, newValue: any, receiver: any): boolean {
            const proxy = createYoact(newValue);
            if (key !== "length" && Reflect.get(target, key, receiver) === newValue) {
                return true;
            }

            const result = Reflect.set(target, key, proxy, receiver);
            if (target.constructor[noact]?.includes(key) ?? false) return result;
            trigger(receiver, key);
            return result;
        }
    }

    /**
     * 构建 响应式对象.
     * @param target
     */
    export function createYoact<T>(
        target: T,
    ): T {
        if (!isObject(target)) {
            return target;
        }
        if (reactiveMap.has(target)) {
            return reactiveMap.get(target) as T;
        }

        Object.keys(target).forEach(key => {
            if (target.constructor[noact]?.includes(key) ?? false) return;
            target[key] = createYoact(target[key]);
        });

        const proxy = new Proxy(
            target,
            new YoactProxyHandler(),
        ) as T;

        reactiveMap.set(target, proxy);

        return proxy;
    }

    /**
     * 绑定 响应式对象.
     * 当形参函数使用了依赖于响应式对象的值时 当该响应式对象发生数据更新时 将调用形参函数进行更新.
     * 将进行一次主动调用.
     * 自动进行依赖收集.
     * @param fn
     */
    export function bindYoact(fn: () => void): Effect {
        const effect: Effect = {
            fn: () => {
                if (effectStack.findIndex(fn) === -1) {
                    try {
                        effectStack.push(effect);
                        fn();
                    } finally {
                        effectStack.pop();
                    }
                }
            },
            activity: true,
        };
        effect.fn();

        return effect;
    }

    /**
     * 移除 响应行为.
     * @param effect
     */
    export function stopEffect(effect: Effect) {
        effect.activity = false;
    }

    function trace(proxy: object, key: string | symbol) {
        const effect = effectStack[effectStack.length - 1];
        if (effect) {
            let map: KeyEffectMap = publishMap.get(proxy);
            if (map === undefined) {
                map = new Map<string | symbol, Set<Effect>>();
                publishMap.set(proxy, map);
            }

            let publisher: Set<Effect> = map.get(key);
            if (publisher === undefined) {
                publisher = new Set<Effect>();
                map.set(key, publisher);
            }

            publisher.add(effect);
        }
    }

    function trigger(proxy: object, key: string | symbol) {
        const publisher = publishMap.get(proxy)?.get(key);
        if (publisher) {
            const invalidEffect: Effect[] = [];
            publisher.forEach(effect => {
                try {
                    if (!effect.activity) {
                        invalidEffect.push(effect);
                    } else {
                        effect.fn();
                    }
                } catch (e: unknown) {
                    invalidEffect.push(effect);
                    console.error(e);
                }
            });
            invalidEffect.forEach(effect => publisher.delete(effect));
        }
    }

    function isObject(target: unknown): target is object {
        return target !== null && typeof target === "object";
    }

    /**
     * 指定字段 不进行响应式绑定.
     * @return {(target: object, propertyKey: (string | symbol)) => void}
     * @private
     */
    export function Noact() {
        return function (target: object, propertyKey: string | symbol) {
            if (!target.constructor[noact]) target.constructor[noact] = [];

            target.constructor[noact].push(propertyKey);
        };
    }
}
