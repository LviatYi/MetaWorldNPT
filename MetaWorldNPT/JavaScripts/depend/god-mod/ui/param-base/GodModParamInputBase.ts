import { Component } from "mw-lynx-ui";
import { ParamInputZOrder } from "./IGodModParamInput";

export class GodModParamInputBase extends Component {
    constructor() {
        super();
        this.root.zOrder = ParamInputZOrder;
    }
}