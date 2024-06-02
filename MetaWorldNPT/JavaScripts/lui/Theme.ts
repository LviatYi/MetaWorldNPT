import Gtk from "../util/GToolkit";

export enum Color {
    White = "#FFFFFF",
    Black = "#000000",
    Gray80 = "#CCCCCC",
    Gray60 = "#999999",
    Gray40 = "#666666",
    Gray20 = "#333333",
    Blue200 = "#90caf9",
    Blue = "#2196f3",
    Blue800 = "#1565c0",
    Red200 = "#ef9a9a",
    Red = "#f44336",
    Red800 = "#c62828",
    Green200 = "#a5d6a7",
    Green = "#4caf50",
    Green800 = "#2e7d32",
    Yellow200 = "#fff59d",
    Yellow = "#ffeb3b",
    Yellow800 = "#f9a825",
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
    secondary: Color.Gray40,
};

export function ColorHexWithAlpha(color: string, alpha: number) {
    if (color.length > 7) return color;

    return `${color}${
        (Math.ceil(Gtk.clamp(alpha) * 255))
            .toString(16)
            .toUpperCase()
    }`;
}

export namespace ColorUtil {
    export function rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {
        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h: number, s: number, v: number = max;

        let d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {h, s, v};
    }

    export function hsvToRgb(h: number, s: number, v: number): { r: number, g: number, b: number } {
        let r: number, g: number, b: number;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }

        return {r: r * 255, g: g * 255, b: b * 255};
    }

    function hexToRgb(hex: string): { r: number, g: number, b: number } {
        hex = hex.replace(/^#/, "");

        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return {r, g, b};
    }

    function rgbToHex(r: number, g: number, b: number): string {
        let red = r.toString(16).padStart(2, "0");
        let green = g.toString(16).padStart(2, "0");
        let blue = b.toString(16).padStart(2, "0");

        return `#${red}${green}${blue}`;
    }

    function hexToHsv(hex: string): { h: number, s: number, v: number } {
        let rgb = hexToRgb(hex);
        return rgbToHsv(rgb.r, rgb.g, rgb.b);
    }

    function hsvToHex(h: number, s: number, v: number): string {
        let rgb = hsvToRgb(h, s, v);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    /**
     * 是否 是鲜艳色.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @return {boolean}
     */
    export function isBrightness(r: number, g: number, b: number): boolean {
        return (r * 299 + g * 587 + b * 114) / 1000 > 128;
    }

    /**
     * 转换为深色主题颜色.
     * @param {ThemeColor} color
     * @return {ThemeColor}
     */
    export function toDarkThemeColor(color: ThemeColor): ThemeColor {
        let primary = hexToHsv(color.primary);
        primary = toBrighter(primary.h, primary.s, primary.v);
        let secondary = hexToHsv(color.secondary);
        secondary = toDarker(secondary.h, secondary.s, secondary.v);

        return {
            primary: hsvToHex(primary.h, primary.s, primary.v),
            secondary: hsvToHex(secondary.h, secondary.s, secondary.v),
        };
    }

    /**
     * 降低亮度.
     * @param {number} h
     * @param {number} s
     * @param {number} v
     * @return {{h: number, s: number, v: number}}
     */
    export function toDarker(h: number, s: number, v: number)
        : { h: number, s: number, v: number } {
        return {
            h,
            s: Math.min(s * 1.2, 1),
            v: v * 0.8,
        };
    }

    /**
     * 提高亮度.
     * @param {number} h
     * @param {number} s
     * @param {number} v
     * @return {{h: number, s: number, v: number}}
     */
    export function toBrighter(h: number, s: number, v: number)
        : { h: number, s: number, v: number } {
        return {
            h,
            s: s * 0.8,
            v: Math.min(v * 1.2, 1),
        };
    }
}
