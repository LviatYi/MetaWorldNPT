# Operation Guider

> 愿星辰指引你的道路.  
> May the stars guide you. —— 魔兽争霸.

一个侵入式的引导配置与时机管理工具。

v31.18.2  
by LviatYi  
thanks @zeliang.niu

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **层台累榭** 建造者模式，层层叠起高复杂度的引导任务组。
- [x] **锦囊妙计** 针对常见引导范式提供预设模板。
- [x] **本质抽象** 将引导任务精确抽象，让尽可能多的引导任务得以被描述。
- [x] **原子精确** 准点报时，对单个或群组引导任务的起始、过程与结束进行针对性控制。
- [x] **唯物辩证** 在合理抽象的前提下，引导任务可以被严谨地描述。

## Deficiency ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

然而它亦面临无法避免的难题：

- **民粹主义** 侵入式的原则要求 OperationGuider 不依赖任何其他模块。
  - 这意味着如 UI 引导任务中，使用者需要以黑暗的手法，而非外部模块已提供的接口，来取得 UI 控件。

## Guide Type

OperationGuider 提供 4 种引导任务类型：

- **Scene** 场景引导
  - 用于引导用户到达场景中某个指定的物体附近，并完成后续操作。
    - 有一个指定的引导物。
    - 碰到触发器或由其他条件结束引导。
  - 在场景中启用了一些引导提示。
    - 使用一条直线连接引导目标。
    - 使用导航线连接引导目标。
  - 由于引导线的存在可能会污染画面，因此超过一定时间，直接视为引导结束。
- **UI** UI 控件引导
  - 用于引导用户操作 UI 控件。
    - 有一个指定的 UI 控件。
    - OperationGuider 会通过动画聚焦在这个 UI 控件的 Rectangle 上。
  - 包含两种点击区域：UI 控件 (Inner) 与 UI 控件外侧 (Back)。  
    如果 UI 控件是一个按钮，点击在不同地方在不同的引导规则下可能有不同结果。
    - **强引导** 仅允许用户点击 Inner 按钮。
    - **无法拒绝引导** 无论点击什么地方 Inner 按钮都将触发。
    - **弱引导** 用户可以点击任何地方关闭引导。
    - **自由引导** 用户可以点击 Inner 跟随引导 也可以点击 Back 关闭引导。
    - **自定义引导** 开发者关闭 Inner 与 Back 的监听，  
      并通过 `setCustomCompletePredicate` 自定义结束条件。
- **Cutscene** 过场引导
  - 用于展示对话、剧情等其他更加个性化的引导行为。
    - 有一个引导结束谓词，测试成功后完成引导。
    - 有一个测试结束谓词的间隔。
- **Group** 引导组
  - 用于管理多个引导任务。
    - 可能是个根组，意味着这个引导组是一个主要的引导流程。
      - 它包含一个开始谓词，当测试成功自动进入引导。
    - 可能是个子组，意味着这个引导组是一个引导流程的一部分。
      - 其下的子任务可以要求是 顺序完成的、无序完成的或任意选一完成的。

## Example ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

### Config in Plan Document

- [Group 组] 新手引导

  - 触发条件：玩家第一次进入游戏
  - 流程
    - [CutScene 过场] 初始对话
      - onFocus：对话 `GuideContent_1_1`
    - [UI 控件] 摇杆介绍
      - UI 控件路径：`MainPanel.ui/RootCanvas/joystick`
      - [条件引导 √ | 弱引导 | 强引导 |...]
        - 完成条件：当用户移动时完成。
    - [Scene 场景] 目标点 A 引导
      - 引导物 Guid：`3F21341C`
      - 结束触发器 Guid：`1E35769B`
      - onFocus: 显示攻击目标 A
      - onAlive 6s/次: showTips `GuideTips_1_1`
    - [Scene 场景] 破坏目标 A 引导
      - 引导物 Guid：`3F21341C`
      - 完成条件：`3F21341C` 指向的建筑被破坏
      - onAlive 6s/次: showTips `GuideTips_1_2`
      - onFade: 隐藏攻击目标 A

- [Group 组] 合成引导
  - 触发条件：当玩家获得 5 件或 5 件以上的同品质同类别的装备时，且玩家处于沙盒关卡内。
  - 流程
    - [CutScene 过场] 初始对话
      - onFocus：对话 `GuideContent_4_1` `GuideContent_4_2`
    - [Scene 场景] 合成 NPC 引导
      - 引导物 Guid：`247BAD52`
      - 结束触发器 Guid：`13878D1E`
      - onFocus: showTips `GuideTips_4_1`
      - onFade：向玩家背包中添加合成材料
    - [UI 控件] 合成入口 UI 介绍
      - UI 控件路径：`NPCOption.ui/RootCanvas/canvas/btn`
      - [条件引导 | 弱引导 | 强引导 √ |...]
    - [UI 控件] 合成按钮 UI 介绍
      - UI 控件路径：`Compound.ui/RootCanvas/btnCompound`
      - [条件引导 | 弱引导 √ | 强引导 |...]

### Config in Code

```typescript
export enum GuideStep {
  Null,

  GroupStart,
  CutsceneTalk1_1,
  UiJoyStick,
  SceneToGuiderA,
  SceneToDestroyA,

  GroupCompound,
  CutsceneTalk4,
  SceneToGuiderCompoundNpc,
  UiCompoundNpcInteract,
  UiCompound,
}

const loadGuide = () => {
  if (SystemUtil.isClient()) {
    //#region Tutorial 新手引导
    let talkFinished: boolean = false;

    manager
      .addTaskGroup(
        GuideStep.GroupStart,
        TaskOptionalTypes.Sequence,
        () => ModuleService.getModule(GuideModuleC)?.isReady ?? true
      )
      .insertTaskToGroup(
        GuideStep.GroupStart,
        new CutsceneOperationGuideTask(GuideStep.CutsceneTalk1_1, () => {
          if (talkFinished) {
            talkFinished = false;
            return true;
          }
          return false;
        }).setOnFocus(() =>
          guideTalk(["GuideContent_1_1"], () => (talkFinished = true))
        )
      )
      .insertTaskToGroup(
        GuideStep.GroupStart,
        new UIOperationGuideTask(
          GuideStep.UiJoyStick,
          () => UIService.getUI(MainPanel).joyStick
        )
          .setBackBtnType(BackBtnTypes.Null)
          .setInnerBtnType(InnerBtnTypes.Null)
          .setCustomCompletePredicate(() => PlayerController.isMoving())
      )
      .insertTaskToGroup(
        GuideStep.GroupStart,
        new SceneOperationGuideTask(GuideStep.SceneToGuiderA, "3F21341C")
          .setTriggerGuid("1E35769B")
          .setOnFocus(() => showObj("3F21341C"))
          .setOnAlive(
            () => GlobalTips.showGlobalTips(i18n.resolves.GuideTips_1_1()),
            6e3
          )
      )
      .insertTaskToGroup(
        GuideStep.GroupStart,
        new SceneOperationGuideTask(GuideStep.SceneToDestroyA, "3F21341C")
          .setPredicate(() => BuildingModule.getBuilding("3F21341C").hp < 0)
          .setOnAlive(
            () => GlobalTips.showGlobalTips(i18n.resolves.GuideTips_1_2()),
            6e3
          )
          .setOnFade(() => hideObj("3F21341C"))
      );
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //#region Compound 合成系统
    manager
      .addTaskGroup(
        GuideStep.GroupCompound,
        TaskOptionalTypes.Sequence,
        () =>
          BagModule.getBag()
            .getItems()
            .filter((item) => item.type === ItemType.Equip).length >= 5 &&
          SceneModule.getScene().isSandbox
      )
      .insertTaskToGroup(
        GuideStep.GroupCompound,
        new CutsceneOperationGuideTask(GuideStep.CutsceneTalk4, () => {
          if (talkFinished) {
            talkFinished = false;
            return true;
          }
          return false;
        }).setOnFocus(() =>
          guideTalk(
            ["GuideContent_4_1", "GuideContent_4_2"],
            () => (talkFinished = true)
          )
        )
      )
      .insertTaskToGroup(
        GuideStep.GroupCompound,
        new SceneOperationGuideTask(
          GuideStep.SceneToGuiderCompoundNpc,
          "247BAD52"
        )
          .setTriggerGuid("13878D1E")
          .setOnFocus(
            () => GlobalTips.showGlobalTips(i18n.resolves.GuideTips_4_1()),
            6e3
          )
          .setOnFade(() => BagModule.getBag().addItem("CompoundMaterial", 1))
      )
      .insertTaskToGroup(
        GuideStep.GroupCompound,
        new UIOperationGuideTask(GuideStep.UiCompoundNpcInteract, () =>
          UIService.getUI(NPCOption).uiWidgetBase.findChildByPath(
            "RootCanvas/canvas/btn"
          )
        ).setAsStrongUIOperationGuideControllerOption()
      )
      .insertTaskToGroup(
        GuideStep.GroupCompound,
        new UIOperationGuideTask(GuideStep.UiCompound, () =>
          UIService.getUI(Compound).uiWidgetBase.findChildByPath(
            "RootCanvas/btnCompound"
          )
        ).setAsWeakUIOperationGuideControllerOption()
      );
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
  }
};
```

[JetbrainsMonoNerdFont]: https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont
[SarasaMonoSC]: https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
