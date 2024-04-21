export function assert(...test: boolean[]): void {
    for (let i = 0; i < test.length; i++)
        if (!test[i]) throw new Error("Assertion failed");

}

export interface Pair<A, B> {
    p1: A;
    p2: B;
}

// Cantor pairing function, ((N, N) -> N) mapping function
// https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
export function make_pair_natural(a: number, b: number): number {
    return (a + b) * (a + b + 1) / 2 + b;
}