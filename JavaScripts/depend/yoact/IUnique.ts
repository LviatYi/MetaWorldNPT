/**
 * 独一的.
 * @desc 即 拥有主键的. 其可通过主键标识唯一性 当主键相同时认定为同一对象.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default interface IUnique {
    /**
     * 主键.
     */
    primaryKey(): number;

    /**
     * 增量更新.
     * @desc 将 updated 的数据更新应用至自身.
     * @desc 建议自行比较内容 仅更新自身变动的成员 以达成增量更新.
     * @param updated 待更新数据.
     * @return boolean 是否 更新成功.
     */
    move(updated: this): boolean;

    //
    // /**
    //  * 是否 等价.
    //  * @param lhs
    //  * @param rhs
    //  */
    // equal(lhs: this, rhs: this): boolean;
}