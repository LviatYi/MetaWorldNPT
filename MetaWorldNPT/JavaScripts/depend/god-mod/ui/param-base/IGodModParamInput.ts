import { Delegate } from "../../../../util/GToolkit";
import { KeyEvent } from "../../../../lui/event/KeyEvent";
import Component from "../../../../lui/component/Component";
import { GodModInferredParamType } from "../../GodModParam";
import { Property } from "../../../../lui/Property";
import { InputChangeEvent } from "../../../../lui/event/InputEvent";

export const ParamInputSizeY = 60;

export default interface IGodModParamInputParametric<P extends GodModInferredParamType> {
    getParam(): P;

    setParam(p: P): void;

    setValidator(validator: Property.DataValidators<unknown>): void;

    get validated(): Property.DataValidateResult;

    onCommit: Delegate.SimpleDelegate<InputChangeEvent>;

    onKeyUp: Delegate.SimpleDelegate<KeyEvent>;
}

export type GodModParamInputComponent<P extends GodModInferredParamType> =
    IGodModParamInputParametric<P>
    & Component;