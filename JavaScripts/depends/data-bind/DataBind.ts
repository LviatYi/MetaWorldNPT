export class MyProxyHandler implements ProxyHandler<object> {
    public apply(target: object, thisArg: any, argArray: any[]): any {
        console.log(`MyProxyHandler: apply`);
    }

    public construct(target: object, argArray: any[], newTarget: Function): object {
        console.log(`MyProxyHandler: construct`);
        return undefined;
    }

    public defineProperty(target: object, property: string | symbol, attributes: PropertyDescriptor): boolean {
        console.log(`MyProxyHandler: defineProperty`);
        return false;
    }

    public deleteProperty(target: object, p: string | symbol): boolean {
        console.log(`MyProxyHandler: deleteProperty`);
        return false;
    }

    public get(target: object, p: string | symbol, receiver: any): any {
        console.log(`MyProxyHandler: get`);
        Reflect.get(target, p, receiver);
    }

    public getOwnPropertyDescriptor(target: object, p: string | symbol): PropertyDescriptor | undefined {
        console.log(`MyProxyHandler: getOwnPropertyDescriptor`);
        return undefined;
    }

    public getPrototypeOf(target: object): object | null {
        console.log(`MyProxyHandler: getPrototypeOf`);
        return undefined;
    }

    public has(target: object, p: string | symbol): boolean {
        console.log(`MyProxyHandler: has`);
        return false;
    }

    public isExtensible(target: object): boolean {
        console.log(`MyProxyHandler: isExtensible`);
        return false;
    }

    public ownKeys(target: object): ArrayLike<string | symbol> {
        console.log(`MyProxyHandler: ownKeys`);
        return undefined;
    }

    public preventExtensions(target: object): boolean {
        console.log(`MyProxyHandler: preventExtensions`);
        return false;
    }

    public set(target: object, p: string | symbol, newValue: any, receiver: any): boolean {
        console.log(`MyProxyHandler: set`);
        Reflect.set(target, p, receiver);
        return false;
    }

    public setPrototypeOf(target: object, v: object | null): boolean {
        console.log(`MyProxyHandler: setPrototypeOf`);
        return false;
    }
}

export function createProxy(
    target: object,
) {
    return new Proxy(target,
        new class implements ProxyHandler<object> {
            public apply(target: object, thisArg: any, argArray: any[]): any {
            }

            public construct(target: object, argArray: any[], newTarget: Function): object {
                return undefined;
            }

            public defineProperty(target: object, property: string | symbol, attributes: PropertyDescriptor): boolean {
                return false;
            }

            public deleteProperty(target: object, p: string | symbol): boolean {
                return false;
            }

            public get(target: object, p: string | symbol, receiver: any): any {
            }

            public getOwnPropertyDescriptor(target: object, p: string | symbol): PropertyDescriptor | undefined {
                return undefined;
            }

            public getPrototypeOf(target: object): object | null {
                return undefined;
            }

            public has(target: object, p: string | symbol): boolean {
                return false;
            }

            public isExtensible(target: object): boolean {
                return false;
            }

            public ownKeys(target: object): ArrayLike<string | symbol> {
                return undefined;
            }

            public preventExtensions(target: object): boolean {
                return false;
            }

            public set(target: object, p: string | symbol, newValue: any, receiver: any): boolean {
                return false;
            }

            public setPrototypeOf(target: object, v: object | null): boolean {
                return false;
            }
        });
}