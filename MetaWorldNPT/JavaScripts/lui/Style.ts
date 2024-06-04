export namespace Property {
    export type Padding = { top?: number, right?: number, bottom?: number, left?: number };

    export type FontSize = number | "auto";

    export type FontStyle = mw.UIFontGlyph;

    export type TextAlign = "left" | "center" | "right";

    export type EffectLevel = "low" | "medium" | "high";

    export enum Corner {
        None = 0,
        TopLeft = 1 << 0,
        TopRight = 1 << 1,
        BottomLeft = 1 << 2,
        BottomRight = 1 << 3,
        Top = TopLeft | TopRight,
        Left = TopLeft | BottomLeft,
        Right = TopRight | BottomRight,
        Bottom = BottomLeft | BottomRight,
        All = TopLeft | TopRight | BottomLeft | BottomRight,
    }
}

export namespace PropertyUtil {
    export function applyFontSize(
        fontSizeAble: {
            fontSize: number,
            autoAdjust: boolean
        }, fontSize: Property.FontSize) {
        if (typeof fontSize === "number") {
            fontSizeAble.fontSize = fontSize;
            fontSizeAble.autoAdjust = false;
        } else {
            fontSizeAble.autoAdjust = true;
        }
    }

    export function applyTextAlign(
        textAlignAble: {
            textAlign: mw.TextJustify
        }, textAlign: Property.TextAlign) {
        switch (textAlign) {
            case "left":
                textAlignAble.textAlign = mw.TextJustify.Left;
                break;
            case "center":
                textAlignAble.textAlign = mw.TextJustify.Center;
                break;
            case "right":
                textAlignAble.textAlign = mw.TextJustify.Right;
                break;
        }
    }

    export function getMaskPrecisionByEffectLevel(effectLevel: Property.EffectLevel): number {
        switch (effectLevel) {
            case "low":
                return 4;
            case "high":
                return 10;
            case "medium":
            default:
                return 6;
        }
    }

    export function hasCorner(corner: Property.Corner, target: Property.Corner): boolean {
        return (corner & target) === target;
    }
}

