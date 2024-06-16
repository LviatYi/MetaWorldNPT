import { GodModInferParamForTransmit } from "../../GodModParam";
import { Component, Property } from "mw-lynx-ui";
import { Delegate } from "gtoolkit";

export const ParamInputSizeY = 60;

export const ParamInputZOrder = 1;

export interface IGodModParamInputParametric<P extends GodModInferParamForTransmit> {
    getParam(): P;

    setParam(p: P): void;

    setValidator(validator: Property.DataValidators<unknown>): void;

    setCustomLabel(label?: string): void;

    get validated(): Property.DataValidateResult;

    get onCommit(): Delegate.SimpleDelegate;
}

export type GodModParamInputComponent<P extends GodModInferParamForTransmit> =
    IGodModParamInputParametric<P>
    & Component;