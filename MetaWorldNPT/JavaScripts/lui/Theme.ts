import Gtk from "../util/GToolkit";

export enum Color {
    White = "#FFFFFF",
    Black = "#000000",
    Gray80 = "#CCCCCC",
    Gray60 = "#999999",
    Gray40 = "#666666",
    Gray20 = "#333333",
    Blue = "#2196f3",
    BlueDark = "#1565c0",
    Red = "#f44336",
    RedDark = "#c62828",
    Green = "#4caf50",
    GreenDark = "#2e7d32",
    Yellow = "#ffeb3b",
    YellowDark = "#f9a825",
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

export function ColorHexWithAlpha(color: string, alpha: number) {
    if (color.length > 7) return color;

    return `${color}${
        (Math.ceil(Gtk.clamp(alpha) * 255))
            .toString(16)
            .toUpperCase()
    }`;
}