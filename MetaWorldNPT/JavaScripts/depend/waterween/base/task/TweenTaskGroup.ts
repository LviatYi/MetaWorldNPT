import { EasingFunction } from "../../../easing/Easing";
import { ITweenTaskGroup } from "../interface/ITweenTaskGroup";

export class TweenTaskGroup implements ITweenTaskGroup {
    public twoPhaseTweenBorder: number;

    public get isPause(): boolean {
        throw new Error("Method not implemented.");
    }

    public get elapsed(): number {
        throw new Error("Method not implemented.");
    }

    public set elapsed(value: number) {
        throw new Error("Method not implemented.");
    }

    public call(now?: number, isTimestamp?: boolean): this {
        throw new Error("Method not implemented.");
    }

    public get isBackward(): boolean {
        throw new Error("Method not implemented.");
    }

//#region Tween Action
    public easing(easingFunc: EasingFunction): void {
        throw new Error("Method not implemented.");
    }

    public pause(now?: number): this {
        throw new Error("Method not implemented.");
    }

    public fastForwardToEnd(): this {
        throw new Error("Method not implemented.");
    }

    public continue(recurve?: boolean, now?: number): this {
        throw new Error("Method not implemented.");
    }

    public destroy(): this {
        throw new Error("Method not implemented.");
    }

    public autoDestroy(auto?: boolean): this {
        throw new Error("Method not implemented.");
    }

    public backward(recurve?: boolean, pause?: boolean, now?: number): this {
        throw new Error("Method not implemented.");
    }

    public forward(recurve?: boolean, pause?: boolean, now?: number): this {
        throw new Error("Method not implemented.");
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}