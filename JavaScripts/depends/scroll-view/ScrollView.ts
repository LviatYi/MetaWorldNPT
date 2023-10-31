import {PredictionItem} from "./PredictionItemPanel";

export class Margin {
    public top: number;
    public right: number;
    public bottom: number;
    public left: number;

    public constructor(all: number);
    public constructor(vertical: number, horizontal: number);
    public constructor(top: number, horizontal: number, bottom: number);
    public constructor(top: number, right: number, bottom: number, left: number);
    public constructor(val1: number, val2: number = undefined, val3: number = undefined, val4: number = undefined) {
        if (val2 === undefined) {
            return new Margin(val1, val1, val1, val1);
        }
        if (val3 === undefined) {
            return new Margin(val1, val2, val1, val2);
        }
        if (val4 === undefined) {
            return new Margin(val1, val2, val3, val2);
        }

        this.top = val1;
        this.right = val2;
        this.bottom = val3;
        this.left = val4;
    }

    public toString() {
        return `top: ${this.top}, right: ${this.right}, bottom: ${this.bottom}, left: ${this.left}`;
    }
}

export default abstract class ScrollView<ViewItem, DataItem> {
//#region Config

//     private _margin: Margin;
//
//     private _space: number;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Data
    private _data: Array<DataItem>;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI Control
    private _scroll: UI.ScrollBox;

    private _container: UI.Canvas;

    private _viewItemConstructor: new () => ViewItem;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    constructor(scroll: UI.ScrollBox,
                container: UI.Canvas,
                data: Array<DataItem>,
                viewItemConstructor: new () => ViewItem,
    ) {
        this._scroll = scroll;
        this._container = container;
        this._viewItemConstructor = viewItemConstructor;
        this._data = data;

        // if (container.autoLayoutEnable) {
        //     GToolkit.log(ScrollView, `container auto layout enabled`);
        //     const originMargin = container.autoLayoutPadding;
        //     this._margin = new Margin(
        //         originMargin.top,
        //         originMargin.right,
        //         originMargin.bottom,
        //         originMargin.left);
        //     this._space = container.autoLayoutSpacing;
        //     GToolkit.log(ScrollView, `margin: ${this._margin}`);
        //     GToolkit.log(ScrollView, `space: ${this._space}`);
        // }

        // TimeUtil.onEnterFrame.add(this.update, this);
    }

    /**
     * 根据 item 数据 渲染 item 视图.
     * @param viewItem
     * @param dataItem
     * @protected
     */
    protected abstract renderItem(
        viewItem: ViewItem,
        dataItem: DataItem): void;

    // private update = (dt: number) => {
    //     GToolkit.log(ScrollView, `updated: ${dt}`);
    // };
}

class InnerData {
    public id: number;

    constructor(id: number) {
        this.id = id;
    }
}

class PredictionData {
    public str: string;
    public id: number;
    public data: InnerData;

    constructor(str: string, id: number, innerId: number) {
        this.str = str;
        this.id = id;
        this.data = new InnerData(innerId);
    }
}

export class MyScrollView extends ScrollView<PredictionItem, PredictionData> {
    constructor(scroll: UI.ScrollBox,
                container: UI.Canvas,
                data: Array<PredictionData>,
                viewItemConstructor: {
                    new(): PredictionItem
                }) {
        super(scroll,
            container,
            data,
            viewItemConstructor);
    }

    protected renderItem(viewItem: PredictionItem,
                         dataItem: PredictionData): void {
        viewItem.idText.text = dataItem.id.toString();
        viewItem.infoText.text = dataItem.str;
        viewItem.innerData.text = dataItem.id.toString();
    }
}