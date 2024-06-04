import { Delegate } from "../../../util/GToolkit";
import { KeyEvent } from "../../../lui/event/KeyEvent";
import Component from "../../../lui/component/Component";
import { GodModInferredParamType } from "../GodModParam";

export default interface IGodModParamInputParametric<P extends GodModInferredParamType> {
    getParam(): P;

    onKeyUp: Delegate.SimpleDelegate<KeyEvent>;
}

export type GodModParamInputComponent<P extends GodModInferredParamType> =
    IGodModParamInputParametric<P>
    & Component;