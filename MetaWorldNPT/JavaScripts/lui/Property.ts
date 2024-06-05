import Gtk from "../util/GToolkit";

export namespace Property {
    export type Padding = { top?: number, right?: number, bottom?: number, left?: number };

    export type FontSize = number | "auto";

    export type FontStyle = mw.UIFontGlyph;

    export type InputType = mw.InputTextLimit;

    export type DataValidators<P> = (DataValidator<P> | DataValidatorWithReason<P>)[];

    export type DataValidateResult = { result: boolean, reason?: string };

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
    import DataValidateResult = Property.DataValidateResult;

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

    export function validate<P>(validators: Property.DataValidators<P>, param: P): DataValidateResult {
        if (Gtk.isNullOrEmpty(validators)) return {result: true};

        for (let validator of validators) {
            if (typeof validator === "function") {
                if (!validator(param)) {
                    return {
                        result: false,
                    };
                }
            } else {
                if (!validator.validator(param)) {
                    return {
                        result: false,
                        reason: validator.reason,
                    };
                }
            }
        }

        return {
            result: true,
        };
    }
}

/**
 * 󰌆数据验证器.
 */
export type DataValidator<P> = (param: P) => boolean

/**
 * 归因 󰌆数据验证器.
 */
export interface DataValidatorWithReason<P> {
    /**
     * 󰌆数据验证器.
     */
    validator: DataValidator<P>;

    /**
     * 原因.
     */
    reason: string;
}
