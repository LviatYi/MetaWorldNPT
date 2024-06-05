import Gtk from "gtoolkit";

export enum Color {
    White = "#FFFFFF",
    Black = "#000000",
    Gray50 = "#fafafa",
    Gray100 = "#f5f5f5",
    Gray200 = "#eeeeee",
    Gray300 = "#e0e0e0",
    Gray400 = "#bdbdbd",
    Gray500 = "#9e9e9e",
    Gray600 = "#757575",
    Gray700 = "#616161",
    Gray800 = "#424242",
    Gray900 = "#212121",
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

export enum Interval {
    VeryFast = 0.1,
    Fast = 0.25,
    Normal = 0.5,
    Slow = 1,
}

export const NormalThemeColor: ThemeColor = {
    primary: Color.Gray500,
    secondary: Color.Gray200,
};

export namespace ColorUtil {
    export interface RGB {
        r: number,
        g: number,
        b: number,
        a?: number,
    }

    export interface HSV {
        h: number,
        s: number,
        v: number
    }

    const safeCache: RGB & HSV = {
        r: 0,
        g: 0,
        b: 0,
        h: 0,
        s: 0,
        v: 0,
    };

    const safeCache2: RGB & HSV = {
        r: 0,
        g: 0,
        b: 0,
        h: 0,
        s: 0,
        v: 0,
    };

    export function colorHexWithAlpha(color: string, alpha: number) {
        if (color.length > 7) return color;

        return `${color}${
            (Math.ceil(Gtk.clamp(alpha) * 255))
                .toString(16)
                .toUpperCase()
        }`;
    }

    export function lerp(r: number,
                         g: number,
                         b: number,
                         rd: number,
                         gd: number,
                         bd: number,
                         t: number,
                         out?: RGB): RGB {
        if (!out) out = {r, g, b};
        out.r = r + (rd - r) * t;
        out.g = g + (gd - g) * t;
        out.b = b + (bd - b) * t;

        return out;
    }

    export function lerpByHsv(r: number,
                              g: number,
                              b: number,
                              rd: number,
                              gd: number,
                              bd: number,
                              t: number,
                              outer?: RGB): RGB {
        const hsv = rgbToHsv(r, g, b, safeCache);
        const hsvD = rgbToHsv(rd, gd, bd, safeCache2);

        return hsvToRgb(
            hsv.h + (hsvD.h - hsv.h) * t,
            hsv.s + (hsvD.s - hsv.s) * t,
            hsv.v + (hsvD.v - hsv.v) * t,
            outer,
        );
    }

    export function lerpHsv(h: number,
                            s: number,
                            v: number,
                            hd: number,
                            sd: number,
                            vd: number,
                            t: number,
                            out?: HSV): HSV {
        if (!out) out = {h, s, v};
        out.h = h + (hd - h) * t;
        out.s = s + (sd - s) * t;
        out.v = v + (vd - v) * t;

        return out;
    }

    export function rgbToHsv(r: number, g: number, b: number, out?: HSV): HSV {
        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        if (!out) out = {h: 0, s: 0, v: max};

        let d = max - min;
        out.s = max === 0 ? 0 : d / max;

        if (max === min) {
            out.h = 0;
        } else {
            switch (max) {
                case r:
                    out.h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    out.h = (b - r) / d + 2;
                    break;
                case b:
                    out.h = (r - g) / d + 4;
                    break;
            }
            out.h /= 6;
        }

        return out;
    }

    export function hsvToRgb(h: number, s: number, v: number, out?: RGB): RGB {
        if (!out) out = {r: 0, g: 0, b: 0};
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                out.r = v;
                out.g = t;
                out.b = p;
                break;
            case 1:
                out.r = q;
                out.g = v;
                out.b = p;
                break;
            case 2:
                out.r = p;
                out.g = v;
                out.b = t;
                break;
            case 3:
                out.r = p;
                out.g = q;
                out.b = v;
                break;
            case 4:
                out.r = t;
                out.g = p;
                out.b = v;
                break;
            case 5:
                out.r = v;
                out.g = p;
                out.b = q;
                break;
        }

        out.r *= 255;
        out.g *= 255;
        out.b *= 255;

        return out;
    }

    export function hexToRgb(hex: string, out?: RGB): RGB {
        if (!out) out = {r: 0, g: 0, b: 0};
        hex = hex.replace(/^#/, "");

        let bigint = parseInt(hex, 16);
        out.r = (bigint >> 16) & 255;
        out.g = (bigint >> 8) & 255;
        out.b = bigint & 255;

        return out;
    }

    export function rgbToHex(r: number, g: number, b: number): string {
        let red = r.toString(16).padStart(2, "0");
        let green = g.toString(16).padStart(2, "0");
        let blue = b.toString(16).padStart(2, "0");

        return `#${red}${green}${blue}`;
    }

    export function hexToHsv(hex: string, out?: HSV): HSV {
        hexToRgb(hex, safeCache);
        return rgbToHsv(safeCache.r, safeCache.g, safeCache.b, out);
    }

    export function hsvToHex(h: number, s: number, v: number): string {
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
        : HSV {
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
        : HSV {
        return {
            h,
            s: s * 0.8,
            v: Math.min(v * 1.2, 1),
        };
    }
}
