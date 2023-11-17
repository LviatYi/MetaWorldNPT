export class MyProxyHandler<T extends object> implements ProxyHandler<T> {

    public defineProperty(target: object, property: string | symbol, attributes: PropertyDescriptor): boolean {
        console.log(`MyProxyHandler: defineProperty`);
        return Reflect.defineProperty(target, property, attributes);
    }

    public deleteProperty(target: object, p: string | symbol): boolean {
        console.log(`MyProxyHandler: deleteProperty`);
        return Reflect.deleteProperty(target, p);
    }

    public get(target: object, p: string | symbol, receiver: any): any {
        console.log(`MyProxyHandler: get`);
        return Reflect.get(target, p, receiver);
    }

    public set(target: object, p: string | symbol, newValue: any, receiver: any): boolean {
        console.log(`MyProxyHandler: set`);
        return Reflect.set(target, p, newValue, receiver);
    }

    public getOwnPropertyDescriptor(target: object, p: string | symbol): PropertyDescriptor | undefined {
        console.log(`MyProxyHandler: getOwnPropertyDescriptor`);
        return Reflect.getOwnPropertyDescriptor(target, p);
    }

    public getPrototypeOf(target: object): object | null {
        console.log(`MyProxyHandler: getPrototypeOf`);
        return Reflect.getPrototypeOf(target);
    }

    public has(target: object, p: string | symbol): boolean {
        console.log(`MyProxyHandler: has`);
        return Reflect.has(target, p);
    }

    public isExtensible(target: object): boolean {
        console.log(`MyProxyHandler: isExtensible`);
        return Reflect.isExtensible(target);
    }

    public ownKeys(target: object): ArrayLike<string | symbol> {
        console.log(`MyProxyHandler: ownKeys`);
        return Reflect.ownKeys(target);
    }

    public preventExtensions(target: object): boolean {
        console.log(`MyProxyHandler: preventExtensions`);
        return Reflect.preventExtensions(target);
    }

    public setPrototypeOf(target: object, v: object | null): boolean {
        console.log(`MyProxyHandler: setPrototypeOf`);
        return Reflect.setPrototypeOf(target, v);
    }
}

export function createProxy<T extends object>(
    target: T,
): T {
    return new Proxy<T>(
        target,
        new MyProxyHandler<T>(),
    );
}