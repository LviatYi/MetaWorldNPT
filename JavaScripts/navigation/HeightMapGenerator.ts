@Core.Class
/**
 * 高度图生成器
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 */
export default class HeightMapGenerator extends Core.Script {
    @Core.Property({displayName: "包围盒起始点"})
    private startSelectPosition: Vector = new Vector(0, 0, 0);
    @Core.Property({displayName: "包围盒终止点"})
    private endSelectPosition: Vector = new Vector(100, 100, 100);

    private heightMap

    private get startPosition() {
        return new Vector(Math.min(this.startSelectPosition.x, this.endSelectPosition.x), Math.min(this.startSelectPosition.y, this.endSelectPosition.y), Math.min(this.startSelectPosition.z, this.endSelectPosition.z),);
    }

    private get endPosition() {
        return new Vector(Math.max(this.startSelectPosition.x, this.endSelectPosition.x), Math.max(this.startSelectPosition.y, this.endSelectPosition.y), Math.max(this.startSelectPosition.z, this.endSelectPosition.z),);
    }

//region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = false;
//region Member init
//endregion ------------------------------------------------------------------------------------------------------

//region Widget bind
//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------

        TimeUtil.delayExecute(this.delayExecute, 200);
    }


    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//region Init
//endregion

    private delayExecute(): void {

    }

//region Event Callback
//endregion
}
