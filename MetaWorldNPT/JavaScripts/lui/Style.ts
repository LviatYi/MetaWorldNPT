export namespace Property {
    export type Padding = { top?: number, right?: number, bottom?: number, left?: number };

    export type FontSize = number | "auto";

    export type FontStyle = mw.UIFontGlyph;

    export type TextAlign = "left" | "center" | "right";

    export type EffectLevel = "low" | "medium" | "high";
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
}

