/**
 * 滚动列表项 接口.
 * 自定义滚动列表项 UI 需要实现此接口.
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
export default interface IScrollViewItem<D> {
    /**
     * 数据绑定.
     * @desc 仅调用一次.
     * @desc 请使用响应式绑定.
     * @desc 分别针对单个数据项进行绑定 可以获取更优的性能.
     * @example
     * bindYoact(() => {
     *      ui.idText.text = yoactData.id.toString();
     * });
     * bindYoact(() => {
     *      ui.infoText.text = yoactData.info;
     * });
     *
     * @param data
     */
    bindData(data: D): void;

    /**
     * 可点击对象.
     * 此对象上的点击将触发 {@link onSetSelect} 回调.
     */
    get clickObj(): mw.StaleButton;

    /**
     * onSetSelect 回调.
     * 定义选中状态的 UI 变化.
     * @param bool 是否 选中.
     */
    onSetSelect(bool: boolean): void;
}