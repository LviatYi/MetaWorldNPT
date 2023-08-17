import {Singleton} from "./Singleton";

export enum LogLevel {
    log = 1,
    warn = 2,
    error = 3
}

/**
 * Custom Logger for typescript.
 * wrap up from console.log
 */
export class Log4Ts extends Singleton<Log4Ts>() {
    public readonly title: string = "Lviat.Log⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄";
    public readonly logModifier: string = "log";
    public readonly warnModifier: string = "warn";
    public readonly errorModifier: string = "error";

    private modifierTitle(level: LogLevel): string {
        return `[${LogLevel[level]}]:`;
    }


    log(message: string): void {
        console.info(`${this.modifierTitle(1)} ${this.title}`);
        console.log(message);
    }

    warn(message: string): void {
        console.info(`${this.modifierTitle(2)} ${this.title}`);
        console.warn(message);
    }

    error(message: string): void {
        console.info(`${this.modifierTitle(3)} ${this.title}`);
        console.error(message);
    }
}