export enum Color {
    White = "#FFFFFF",
    Black = "#000000",
    Gray80 = "#CCCCCC",
    Gray60 = "#999999",
    Gray40 = "#666666",
    Gray20 = "#333333",
}

export default class ThemeColor {
    /**
     * 主色.
     */
    public primary: string;

    /**
     * 副色.
     */
    public secondary: string;
}

export const NormalThemeColor: ThemeColor = {
    primary: Color.Gray80,
    secondary: Color.Gray80,
};