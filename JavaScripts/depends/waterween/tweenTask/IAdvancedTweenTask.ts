import ITweenTask from "./ITweenTask";

/**
 * IAdvancedTweenTask.
 * Advanced tween task interface.
 * With more media controller.
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
export default interface IAdvancedTweenTask<T> extends ITweenTask<T> {

    /**
     * 是否 任务正 󰓕倒放.
     */
    get isBackward(): boolean;

    /**
     * 是否 任务正 重复 播放.
     */
    get isRepeat(): boolean;

    /**
     * 是否 任务正 󱞳往复 播放.
     */
    get isPingPong(): boolean;
    
//#region Advanced Tween Action

    /**
     * 重置 补间.
     * @param pause 是否伴随 󰏤暂停. default false.
     */
    restart(pause: boolean): this;

    restart(): this;

    /**
     * 󰓕倒放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     */
    backward(recurve: boolean, pause: boolean): this;

    backward(recurve: boolean): this;

    backward(): this;

    /**
     * 󰐊正放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     */
    forward(recurve: boolean, pause: boolean): this;

    forward(recurve: boolean): this;

    forward(): this;

    /**
     * 重复 播放.
     * @param repeat 是否 重复 播放.
     *      - true default. 完成后 重置 补间.
     */
    repeat(repeat: boolean): this;

    repeat(): this;

    /**
     * 󱞳往复 播放.
     * @param pingPong 是否 󱞳往复 播放
     *      - true default. 󰐊正放 结束后 󰓕倒放.
     * @param repeat 是否 重复 播放.
     *      - true default.
     */
    pingPong(pingPong: boolean, repeat: boolean): this;

    pingPong(pingPong: boolean): this;

    pingPong(): this;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}