import GToolkit from "../../../util/GToolkit";
import Log4Ts from "../../log4ts/Log4Ts";
import {IDialogueContentNodeElement} from "../../../config/DialogueContentNode";
import ADialogifyConfigReader, {
    getInteractNodes,
    IDialogueContentNodeConfigElement,
    IDialogueInteractNodeConfigElement,
    IRelateEntityConfigElement,
    isDialogueContentNodeHasNextId,
    isDialogueInteractNodeHasContentNodeId,
    isDialogueInteractNodeHasFuncId,
    isEntityIdValid,
} from "../dialogify-config-reader/ADialogifyConfigReader";
import i18n from "../../i18n/i18n";
import DialogueFuncFactory, {DialogueNodeFuncTypes} from "../dialogue-node-func-type/DialogueFuncTypes";
import DialogifyConfigReader from "../dialogify-config-reader/DialogifyConfigReader";

export interface IContentNodePanel {
    /**
     * 内容源 名称 TextBlock.
     */
    txtSourceName: mw.TextBlock;

    /**
     * 内容 TextBlock.
     */
    txtContent: mw.TextBlock;

    /**
     * 下一条 Button.
     */
    btnNext: mw.Button | mw.StaleButton;

    /**
     * 下一条 提示 Image.
     */
    imgNext: mw.Image;

    /**
     * 内容 Canvas.
     */
    cnvContentNode: mw.Canvas;

    /**
     * 交互选项 Canvas.
     */
    cnvOptions: mw.Canvas;
}

export interface IInteractNodePanel {
    /**
     * 交互按钮 Button.
     */
    btnMain: mw.Button | mw.StaleButton;

    /**
     * 交互选项内容 TextBlock.
     */
    txtContent: mw.TextBlock;

    /**
     * 交互选项图标 Image.
     */
    imgIcon: mw.Image;
}

/**
 * 对话面板控制器.
 */
export default abstract class ADialoguePanelController<
    MP extends mw.UIScript & IContentNodePanel,
    IPItem extends mw.UIScript & IInteractNodePanel,
    RC extends IRelateEntityConfigElement,
    CC extends IDialogueContentNodeConfigElement,
    IC extends IDialogueInteractNodeConfigElement,
    R extends ADialogifyConfigReader<RC, CC, IC>> {
//#region Constant
    /**
     * 控制器 退出对话.
     * @friend
     * {@link ADialoguePanelController}
     */
    public static readonly ControllerExitDialogueEventName = "__CONTROLLER_EXIT_DIALOGUE__";
    /**
     * 控制器 刷新对话.
     * @desc <code> id:number </code> 对话内容节点 id.
     * @friend
     * {@link ADialoguePanelController}
     */
    public static readonly ControllerRefreshDialogueEventName = "__CONTROLLER_REFRESH_DIALOGUE__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Panel Member

    /**
     * 交互选项 item UI 构造器.
     * @protected
     */
    protected abstract get interactorItemConstructor(): new() => IPItem;

    /**
     * 交互选项 Canvas 容量.
     * @protected
     */
    protected readonly cnvOptionsMaxCapacity: number = 4;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member

    /**
     * 组合模式.
     * @protected
     */
    protected _panel: MP | null;

    protected checkPanel(): boolean {
        if (!this._panel) {
            Log4Ts.error(ADialoguePanelController, `panel not set.`);
            return false;
        }
        return true;
    }

    protected _nextArrowShown: boolean = true;

    protected _currentContentId: number = null;

    /**
     * 当前显示的对话内容节点.
     */
    public get currentContentId(): number {
        return this._currentContentId;
    }

    protected _talkingDialogueEntityId: number | null = null;

    protected _objectiveDialogueEntityId: number | null = null;

    /**
     * 当前发言的 叙述实体 id.
     */
    public get talkingDialogueEntityId(): number | null {
        return this._talkingDialogueEntityId;
    }

    /**
     * 当前 客观 叙述实体 id.
     * @desc 记录上一个非玩家的对话实体 id.
     * @desc 客观 指 非我的 非玩家的.
     * @desc 如果当前发言的 叙述实体 id 是主角 则返回上一个非玩家发言的对话实体 id.
     * @desc 如果对话树节点不存在上一个非玩家对话实体则返回 null.
     */
    public get objectiveDialogueEntityId(): number | null {
        return this._objectiveDialogueEntityId;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init

    /**
     * init.
     * @desc 你必须在 {@link ADialoguePanelController.registerPanel} 中初始化 {@link ADialoguePanelController._panel}.
     */
    public registerPanel(panel: MP): this {
        this._panel = panel;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI Behavior
    /**
     * 应用节点.
     * @privateRemarks 描述 对话内容节点的判定树.
     * @privateRemarks 条件桩 (nextId content interactNodeIds) 的空情况.
     * @param config
     */
    public setContent(config: IDialogueContentNodeConfigElement) {
        if (!this.checkPanel()) return;
        if (!config) {
            Log4Ts.error(ADialoguePanelController, `config is null.`);
            this.exitDialogue();
            return;
        }

        this._currentContentId = config.id;
        this.updateEntityIdData(config);
        const content = config.content;

//#region 条件项 000
        if (GToolkit.isNullOrEmpty(content) &&
            !isDialogueContentNodeHasNextId(config) &&
            GToolkit.isNullOrEmpty(config.interactPredNodeIds)) {
            this.exitDialogue();
            return;
        }
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//#region 条件项 100 101
        if (GToolkit.isNullOrEmpty(content) &&
            isDialogueContentNodeHasNextId(config)) {
            Log4Ts.error(ADialoguePanelController, `配置了一行无意义的 DialogueContentNode. id: ${config.id}`);
            this.exitDialogue();
            return;
        }
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

        this._panel.btnNext.onClicked.clear();

        const options: number[] = getInteractNodes(config);
        if (options.length > this.cnvOptionsMaxCapacity) {
            Log4Ts.error(ADialoguePanelController,
                `count of options exceeds the recommended capacity.`,
                `id: ${config.id}`,
                `count: ${options.length}`,
                `recommended capacity: ${this.cnvOptionsMaxCapacity}`);
            options.length = this.cnvOptionsMaxCapacity;
        }

        this.showInteractOptions(options);
        if (GToolkit.isNullOrEmpty(options)) {
//#region 条件项 110
            if (isDialogueContentNodeHasNextId(config)) {
                this._panel.btnNext
                    .onClicked
                    .add(() => Event.dispatchToLocal(ADialoguePanelController.ControllerRefreshDialogueEventName, config.nextId));
            }
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region 条件项 010
            else this._panel.btnNext.onClicked.add(this.exitDialogue);
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
        }
//#region 条件项 0--
        if (GToolkit.isNullOrEmpty(content)) {
            GToolkit.trySetVisibility(this._panel.cnvContentNode, false);
        }
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//#region 条件项 1--
        else {
            GToolkit.trySetVisibility(this._panel.cnvContentNode, true);
            this._panel.txtSourceName.text = this.getSourceName(this._talkingDialogueEntityId);
            this._panel.txtContent.text = this.innerGetContent(config);
            this.showNextArrow(isDialogueContentNodeHasNextId(config));
        }
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
    }

    /**
     * 显隐 「下一个」 提示箭头.
     * @param shown 是否显示.
     * @private
     */
    protected showNextArrow(shown: boolean) {
        if (shown === this._nextArrowShown) return;
        this._nextArrowShown = shown;
        GToolkit.trySetVisibility(this._panel.imgNext, shown);
    }

    /**
     * 显隐 交互选项.
     * @param options
     * @private
     */
    protected showInteractOptions(options: number[]) {
        this._panel.cnvOptions.removeAllChildren();
        if (GToolkit.isNullOrEmpty(options)) return;

        options.forEach((interactNodeId) => {
            const interactNode = this.configReader.getDialogueInteractNodeConfig(interactNodeId);
            if (!interactNode) return;

            const nodeUi = UIService.create(this.interactorItemConstructor);
            this.initInteractNode(nodeUi, interactNode);
            this._panel.cnvOptions.addChild(nodeUi.uiObject);
        });
    }

    protected initInteractNode(ui: IInteractNodePanel, config: IC) {
        if (!config) {
            Log4Ts.error(ADialoguePanelController, `config is null.`);
            return this;
        }

        ui.txtContent.text = this.getInteractContent(config);
        if (config.icon) {
            GToolkit.trySetVisibility(ui.imgIcon, true);
            ui.imgIcon.imageGuid = config.icon;
        } else {
            GToolkit.trySetVisibility(ui.imgIcon, false);
        }
        ui.btnMain.onClicked.clear();
        ui.btnMain.onClicked.add(() => {
            if (isDialogueInteractNodeHasFuncId(config)) {
                const func = DialogueFuncFactory(config.funcId as DialogueNodeFuncTypes);
                func?.();
            }

            if (isDialogueInteractNodeHasContentNodeId(config)) {
                Event.dispatchToLocal(ADialoguePanelController.ControllerRefreshDialogueEventName, config.contentNodeId);
            } else {
                Event.dispatchToLocal(ADialoguePanelController.ControllerExitDialogueEventName);
            }
        });

        return this;
    }

    /**
     * 显示 对话界面.
     */
    public showDialoguePanel(): boolean {
        if (!this.checkPanel()) return false;
        return !!UIService.showUI(this._panel);
    }

    /**
     * 隐藏 对话界面.
     * @return 是否 成功隐藏.
     */
    public shutDown(): boolean {
        this._currentContentId = null;
        if (!this.checkPanel()) return false;
        return UIService.hideUI(this._panel);
    }

    private exitDialogue = () => {
        Event.dispatchToLocal(ADialoguePanelController.ControllerExitDialogueEventName);
    };

    /**
     * 更新当前对话实体 id.
     *    - null default. 清除当前的对话实体 id.
     * @private
     * @param config
     */
    private updateEntityIdData(config: IDialogueContentNodeElement) {
        if (!isEntityIdValid(config?.sourceId ?? null)) {
            return;
        }
        const sourceId = config.sourceId;
        this._talkingDialogueEntityId = sourceId;
        if (this.configReader.getRelateEntityConfig(sourceId)?.isSubjective ?? false) return;
        this._objectiveDialogueEntityId = sourceId;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * config 读取器.
     * 当使用自定义 Config 类型时 请重写此方法.
     * @protected
     */
    public get configReader(): R {
        return DialogifyConfigReader as R;
    };

    /**
     * 获取 对话内容节点 内容.
     * 语法糖. 请勿重写.
     * @param config
     * @protected
     * @sealed
     */
    protected innerGetContent(config: IDialogueContentNodeConfigElement | number): string {
        if (typeof config === "number") config = this.configReader.getDialogueContentNodeConfig(config);
        return this.getContent(config);
    }

    /**
     * 从配置获取 叙述实体 名称.
     * @param sourceId
     * @protected
     */
    protected getSourceName(sourceId: number) {
        return i18n.lan(this.configReader.getRelateEntityConfig(sourceId)?.name ?? "null");
    }

    /**
     * 从配置获取 对话内容节点 内容.
     * @param config
     * @protected
     * @final
     */
    protected getContent(config: IDialogueContentNodeConfigElement) {
        return i18n.lan(config.content);
    }

    /**
     * 获取 对话交互节点 内容.
     * 语法糖. 请勿重写.
     * @param config
     * @protected
     * @sealed
     */
    protected getInteractContent(config: IDialogueInteractNodeConfigElement | number) {
        if (typeof config === "number") config = this.configReader.getDialogueInteractNodeConfig(config);
        return i18n.lan(config.content);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}