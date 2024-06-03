import { Component } from "../../../lui/component/Component";
import { AutoComplete } from "../../../lui/component/AutoComplete";
import { GodCommandItem } from "../GodModService";
import { AcceptableParamType } from "../GodModParam";
import { Color } from "../../../lui/Theme";
import Gtk from "../../../util/GToolkit";
import { Button } from "../../../lui/component/Button";

export class GodModPanel extends Component {
    private _cnvController: mw.Canvas;

    private _btnExpand: Button;

    private _btnMove: Button;

    private _btnClose: Button;

    private _input: AutoComplete<GodCommandItem<AcceptableParamType>>;

    private _godCommandItems: GodCommandItem<AcceptableParamType>[] = [];

//#region Lui Component
    public static create(): GodModPanel {
        let godModPanel = new GodModPanel();

        godModPanel.initRoot();

        godModPanel._cnvController = mw.Canvas.newObject(godModPanel.root, "cnvController");
        Gtk.trySetVisibility(godModPanel._cnvController, true);

        godModPanel._btnExpand = Button.create({
            label: "expand",
            size: {x: 220, y: 80},
            padding: {top: 10, right: 20, bottom: 10, left: 0},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 12,
        }).attach(godModPanel._cnvController);
        godModPanel._btnMove = Button.create({
            label: "move",
            size: {x: 100, y: 80},
            padding: {top: 10, right: 20, bottom: 10, left: 0},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 12,
        }).attach(godModPanel._cnvController);
        godModPanel._btnClose = Button.create({
            label: "close",
            size: {x: 80, y: 80},
            padding: {top: 10, right: 0, bottom: 10, left: 0},
            color: {
                primary: Color.Red,
                secondary: Color.Red200,
            },
            fontSize: 12,
        }).attach(godModPanel._cnvController);

        godModPanel._input = AutoComplete
            .create({
                label: "search commands",
                items: godModPanel._godCommandItems,
                size: {x: 400, y: 60},
                color: {
                    primary: Color.Blue,
                    secondary: Color.Blue200,
                },
                itemHeight: 40,
                maxCount: 6,
                fontSize: 16,
                fontStyle: mw.UIFontGlyph.Light,
                variant: "filled",
                // renderOption: (item) => {},
            })
            .attach(godModPanel.root);

        godModPanel.setSize();

        return godModPanel;
    };

    public static defaultOption() {
        return undefined;
    };

    protected destroy(): void {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
    private setSize(): this {
        Gtk.setUiSize(this.root, 400, 180);

        Gtk.setUiSize(this._cnvController, 400, 80);
        Gtk.setUiPosition(this._btnExpand.root, 0, 0);
        Gtk.setUiPosition(this._btnMove.root, this._btnExpand.root.size.x, 0);
        Gtk.setUiPosition(this._btnClose.root, this._btnExpand.root.size.x + this._btnMove.root.size.x, 0);

        Gtk.setUiPosition(this._input.root, 0, this._cnvController.size.y);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region CallBack
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface GodModPanelOption {
}