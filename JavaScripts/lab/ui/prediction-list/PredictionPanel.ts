import PredictionItem, { PredictionItemData } from "./PredictionItem";
import GToolkit from "../../../util/GToolkit";
import PredictionList_Generate from "../../../ui-generate/UIScrollerViewLab/PredictionList_generate";
import YoactArray from "../../../depends/yoact/YoactArray";
import ScrollView from "../../../depends/scroll-view/ScrollView";
import Enumerable from "linq";

export class PredictionPanel extends PredictionList_Generate {
//#region View Props
    private _outData: PredictionItemData[] = [];
    private _yoactArray: YoactArray<PredictionItemData> = new YoactArray<PredictionItemData>();

    private _scrollView: ScrollView<PredictionItemData, PredictionItem>;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld UI Event

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

//#region Member init
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());
        this._outData.push(PredictionItemData.generate());

        this._yoactArray.setAll(this._outData);
        this._yoactArray.sort(item => item.primaryKey());
        this._scrollView = new ScrollView(
            this._yoactArray,
            PredictionItem,
            this.scrollBox,
            this.container);
//#endregion ------------------------------------------------------------------------------------------

//#region Widget bind
//#endregion ------------------------------------------------------------------------------------------

//#region Event subscribe
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate() {
    }

    protected onShow() {
    }

    protected onHide() {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI Behavior
    public insertData() {
        let g: PredictionItemData;
        while (true) {
            g = PredictionItemData.generate();
            if (Enumerable.from(this._outData).select(m => m.primaryKey()).indexOf(g.primaryKey()) < 0) {
                break;
            }
        }
        this._outData.push(g);
        this._yoactArray.setAll(this._outData);
        this.recordData();
    }

    public updateData() {
        const item: PredictionItemData = GToolkit.randomArrayItem(this._outData);
        item.innerData.info = item.innerData.info + "m";
    }

    public removeData() {
        const index = GToolkit.random(
            0,
            this._outData.length,
            true);
        console.log(index);
        this._outData.splice(
            index,
            1);
        this._yoactArray.setAll(this._outData);
        this.recordData();
    }

    private recordData() {
        for (const item of this._outData) {
            GToolkit.log(PredictionPanel, item);
        }
    }

    public scroll() {
        this._scrollView
            .scrollToKey(
                GToolkit
                    .randomArrayItem(Enumerable
                        .from(this._outData)
                        .select((element) => {
                            return element.primaryKey();
                        })
                        .toArray()
                        .sort()));
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}