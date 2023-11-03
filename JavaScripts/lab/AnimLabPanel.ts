import AnimLab_Generate from "../ui-generate/AnimLab_generate";

@UIBind("")
export default class AnimLabPanel extends AnimLab_Generate {

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;
        console.log("Awake");
    }

    protected onUpdate() {

    }


}
