import { GodModInferParamForTransmit } from "../../GodModParam";
import { Delegate } from "gtoolkit";
import { Component, InputChangeEvent, KeyEvent, Property } from "mw-lynx-ui";

export const ParamInputSizeY = 60;

export const ParamInputZOrder = 1;

export interface IGodModParamInputParametric<P extends GodModInferParamForTransmit> {
    getParam(): P;

    setParam(p: P): void;

    setValidator(validator: Property.DataValidators<unknown>): void;

    get validated(): Property.DataValidateResult;

    onCommit: Delegate.SimpleDelegate<InputChangeEvent>;

    onKeyUp: Delegate.SimpleDelegate<KeyEvent>;
}

export type GodModParamInputComponent<P extends GodModInferParamForTransmit> =
    IGodModParamInputParametric<P>
    & Component;