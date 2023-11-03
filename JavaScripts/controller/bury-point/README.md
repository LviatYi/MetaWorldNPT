# Bury Point Controller

BuryPointController (BPC) 是一个埋点控制器。其为埋点提供规范与便捷。

v0.9.0a  
by LviatYi

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
  Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **有限自由** 提供 BuryInfo 抽象类，一种埋点信息规范。
- [x] **隐式转换** 自动识别自定义的字段，并转换为 Json 字符串。
- [x] **柏林狗洞** 允许你忽视规范，直接填入 Bury 参数。

## Use ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

提供了两种方式通过 BPC 进行埋点：

### 平地高楼

这是推荐的方法，允许你轻松地对埋点信息进行复用。

首先，需要继承 BuryInfo 抽象类：

```typescript
export class TsActionClickBuryInfo extends BuryInfo {
//#region Constant
    private static readonly TS_ACTION_CLICK_BURY_DESC = "记录游戏中的各种事件";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public buryName: string = BuryEventDefine.TsActionClick;

    public buryDescription: string = TsActionClickBuryInfo.TS_ACTION_CLICK_BURY_DESC;

    constructor(
        public scene_id: number,
        public info1: number,
        public info2: number) {
        super();
    }
}
```

随后，在需要埋点的类型中进行实例化 BuryInfoDerive 并播报。

```typescript
BuryPointController.getInstance().report(new TsActionClickBuryInfo(1, 10, 100));
```

这意味着你可以通过继承复用你的埋点信息类：

```typescript
class DeriveClickBuryInfo extends TsActionClickBuryInfo {
//#region Constant
    private static readonly SUB_SCENE_ID = 5;

    private static readonly INFO1 = 10;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
    constructor(
        public info4: number,
        info2: number) {
        super(
            DeriveClickBuryInfo.SUB_SCENE_ID,
            DeriveClickBuryInfo.INFO1,
            info2,
        );
    }
}
```

### 白手起家

你也可以直接填入埋点参数直接播报埋点：

```typescript
BuryPointController.getInstance().customReport(
    eventName, // 事件名
    description, // 事件描述
    json, // Json 格式的参数字符串
);
```

### 最佳实践

建议项目统一管理埋点逻辑，使用 BuryRouter 进行埋点行为的分发。

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z