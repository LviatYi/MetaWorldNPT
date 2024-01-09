import { Singleton } from "../singleton/Singleton";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import ADialoguePanelController from "./dialogue-panel-controller/ADialoguePanelController";
import ADialogifyConfigReader, {
    IDialogueContentNodeConfigElement,
    IDialogueInteractNodeConfigElement,
    IRelateEntityConfigElement,
} from "./dialogify-config-reader/ADialogifyConfigReader";

/**
 * DialogifyManager.
 * @desc 对话管理器.
 * @desc 管理对话行为及对话时信息.
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class DialogifyManager extends Singleton<DialogifyManager>() {
//#region Constant
    /**
     * 玩家遇到招呼.
     * @desc <code> id:number </code> 对话内容节点 id.
     */
    public static readonly PlayerEnterGreetEventName = "__PLAYER_ENTER_GREET_EVENT_NAME__";
    /**
     * 玩家进入正式对话.
     * @desc <code> id:number </code> 对话内容节点 id.
     */
    public static readonly PlayerEnterOfficialDialogueEventName = "__PLAYER_ENTER_OFFICIAL_DIALOGUE__";
    /**
     * 玩家离开对话.
     * @desc <code> id:number </code> 对话内容节点 id.
     */
    public static readonly LeaveDialogueEventName = "__DIALOGIFY_LEAVE_DIALOGUE__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    private _panelController: ADialoguePanelController<
        any,
        any,
        IRelateEntityConfigElement,
        IDialogueContentNodeConfigElement,
        IDialogueInteractNodeConfigElement,
        ADialogifyConfigReader<
            IRelateEntityConfigElement,
            IDialogueContentNodeConfigElement,
            IDialogueInteractNodeConfigElement>>;

    private _talkingDialogueEntityId: number | null = null;

    private _subjectiveDialogueEntityId: number | null = null;

    private get configReader(): ADialogifyConfigReader<
        IRelateEntityConfigElement,
        IDialogueContentNodeConfigElement,
        IDialogueInteractNodeConfigElement
    > | null {
        return this._panelController?.configReader ?? null;
    };

    /**
     * 是否 正在对话.
     */
    public get isDialoguing(): boolean {
        return this._talkingDialogueEntityId !== null;
    }

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
    public get subjectiveDialogueEntityId(): number | null {
        return this._subjectiveDialogueEntityId;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Singleton

    protected onConstruct(): void {
        super.onConstruct();

        Event.addLocalListener(ADialoguePanelController.ControllerExitDialogueEventName,
            () => {
                this._panelController?.shutDown();
            });
        Event.addLocalListener(ADialoguePanelController.ControllerRefreshDialogueEventName,
            (contentNodeId: number) => {
                this._panelController?.setContent(this.configReader?.getDialogueContentNodeConfig(contentNodeId));
            });
    }

    /**
     * 初始化控制器.
     * @param controller
     */
    public initController(controller: ADialoguePanelController<
        any,
        any,
        IRelateEntityConfigElement,
        IDialogueContentNodeConfigElement,
        IDialogueInteractNodeConfigElement,
        ADialogifyConfigReader<
            IRelateEntityConfigElement,
            IDialogueContentNodeConfigElement,
            IDialogueInteractNodeConfigElement>>) {
        this._panelController = controller;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 交谈.
     * @param config
     * @param greet 是否 打招呼.
     *  - 打招呼 仍会渲染节点 但不意味着进入正式对话.
     *  - 可用于 仅构建交互节点 但不进行锁定视角、锁定移动等正式对话时的额外操作.
     */
    public chat(config: number | IDialogueContentNodeConfigElement, greet: boolean = false) {
        if (typeof config === "number") config = this.configReader.getDialogueContentNodeConfig(config);
        if (!config) {
            Log4Ts.error(DialogifyManager, `config null. id: ${config.id}`);
            return;
        }

        this._panelController.showDialoguePanel();
        this.updateEntityIdData(config.sourceId);
        this._panelController.setContent(config);

        if (greet) {
            Event.dispatchToLocal(DialogifyManager.PlayerEnterGreetEventName, config.id);
        } else {
            Event.dispatchToLocal(DialogifyManager.PlayerEnterOfficialDialogueEventName, config.id);
        }
    }

    /**
     * 退出对话.
     * @return 是否 成功退出.
     */
    public exit(): boolean {
        if (this._panelController.shutDown()) {
            this._talkingDialogueEntityId = null;
            this.updateEntityIdData(null);
            Event.dispatchToLocal(DialogifyManager.LeaveDialogueEventName);
            return true;
        }
        return false;
    }

    /**
     * 更新当前对话实体 id.
     * @param sourceId
     *    - null default. 清除当前的对话实体 id.
     * @private
     */
    private updateEntityIdData(sourceId: number = null) {
        this._talkingDialogueEntityId = sourceId;
        if (this.configReader.getRelateEntityConfig(sourceId)?.isSubjective ?? false) return;
        this._subjectiveDialogueEntityId = sourceId;
    }
}
