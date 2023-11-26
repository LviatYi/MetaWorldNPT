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
 * @version 1.2.0b
 */
export namespace Yoact {
    type Effect = (...params: unknown[]) => void;
    type Publisher = Set<Effect>
    type KeyEffectMap = Map<string | symbol, Publisher>;

    const reactiveMap = new WeakMap<object, unknown>();
    const publishMap = new WeakMap<object, KeyEffectMap>;
    const effectStack: Effect[] = [];

    class YoactProxyHandler<T extends object> implements YoactProxyHandler<T> {
        public get(target: object, key: string | symbol, receiver: any): any {
            trace(receiver, key);
            return Reflect.get(target, key, receiver);
        }

        public set(target: object, key: string | symbol, newValue: any, receiver: any): boolean {
            const proxy = createYoact(newValue);
            if (key !== "length" && Reflect.get(target, key, receiver) === newValue) {
                return true;
            }

            const result = Reflect.set(target, key, proxy, receiver);
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

        //TODO_LviatYi 递归创建响应式 可以挪至 get 中 以实现懒加载.
        Object.keys(target).forEach(key => target[key] = createYoact(target[key]));

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
    export function bindYoact(fn: Effect) {
        const effect = () => {
            if (effectStack.findIndex(fn) === -1) {
                try {
                    effectStack.push(effect);
                    fn();
                } finally {
                    effectStack.pop();
                }
            }
        };
        effect();
    }

    function trace(proxy: object, key: string | symbol) {
        const effect = effectStack[effectStack.length - 1];
        if (effect) {
            let map: KeyEffectMap = publishMap.get(proxy);
            if (map === undefined) {
                publishMap.set(proxy, map = new Map<string | symbol, Set<Effect>>());
            }

            let publisher: Set<Effect> = map.get(key);
            if (publisher === undefined) {
                map.set(key, publisher = new Set<Effect>());
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
                    effect();
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
}
