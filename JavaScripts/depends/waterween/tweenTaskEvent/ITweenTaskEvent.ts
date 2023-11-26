import { Delegate } from "../../delegate/Delegate";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * ITweenTaskEvent.
 * Events broadcast by tween task.
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
export default interface ITweenTaskEvent {
    /**
     * 当 󰄲完成 时.
     *      val: 是否 任务正 󰓕倒放.
     * @beta
     */
    onDone: SimpleDelegate<boolean>;

    /**
     * 当 󰩺销毁 时.
     * @beta
     */
    onDestroy: SimpleDelegate<void>;

    /**
     * 当 󰏤暂停 时.
     * @beta
     */
    onPause: SimpleDelegate<void>;

    /**
     * 当 󰐊继续 时.
     * @beta
     */
    onContinue: SimpleDelegate<void>;

    /**
     * 当 重置 时.
     * @beta
     */
    onRestart: SimpleDelegate<void>;
}