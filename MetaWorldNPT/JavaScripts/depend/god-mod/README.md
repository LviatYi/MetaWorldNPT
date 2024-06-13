# God Mod

> 无所不能......在下一个轮回.

God Mod 是新一代管理命令工具. 允许在游戏中调用任何管理命令.

v31.1.2  
by LviatYi  
by ZeWei.Zhang  
thanks Lei.Zhao

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **呼风唤雨** 模糊搜索与拼音搜索 随心所欲地触及.
- [x] **一板一眼** 简单类型与 Mw 常用类型参数验证、Enum 自动转下拉列表与配置表参数快速预览.
- [x] **前辙可鉴** 提供命令与参数的历史记录 快速重复命令.
- [ ] **召之即来** 提供常用的一般性命令.
- [x] **交互艺术** 允许拖动 显隐 窗口.
- [x] **触手可得** 自生成 UI. 不依赖任何其他要素.
- [x] **一夫当关** 权限认证. KV 存储的用户权限凭证.
- [x] **已读立回** 完善的交互反馈.
- [x] **上炕揭瓦** 尽可能贴近现存的 Api 设计，提供快捷的替换步骤.

## Deficiency ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

然而它亦面临无法避免的难题：

- **黄口小儿** GodMod 目前处于乳臭未干的状态。

## Example ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

以下是一个面向程序配置的简单示例：

---

### 初始化

GodMod 作为命令管理后台，它提供了由 C 端直接引发 S
端变化的通道，需要程序谨慎使用。[什么是 「仅服务端函数不扩散条约 (SONPT)」][sonpt]  
因此 GodMod 默认不显示在游戏内，需要进行一些初始化步骤。

```typescript
if (GameServiceConfig.isRelease) {
    // 正式发布.
    GodModService.getInstance().setAuthStrategy("strong");
}
// 带验证的显示.
GodModService.getInstance().authShowGm();
```

GodMod 提供两种策略对用户进行认证：

- `strong` **强认证** 用户的 UserId 必须在 KV 存储的管理员名单中存在，才能正常使用 GodMod。
- `weak` **弱认证** 如果为 PIE 环境，或未配置管理员名单，用户可以直接使用 GodMod。

管理员名单存储于 KV，可以通过 [Web 后台][233Web] 进行添加。

Key 为 `GOD_MOD_ADMIN_LIST__STORAGE_KEY`

<div style="text-align: center;">
    <img src="pic/mw-web-backstage.png" style="width: 30rem;" alt="mw-web-backstage">
</div>

---

### 添加指令

GodMod 提供了全栈的类型提示、完备的参数验证。程序需要更多地承担一些义务，来告知策划应该提供什么类型的参数。

虽然看似提高了程序的成本，但相信我，GodMod 内部复杂的类型体操与基于 Lui 的组件化参数输入窗口将成倍地提高所有项目开发者的收益。

下方提供一些示例：

#### 添加一个无参指令

```typescript
addGMCommand("say",
    "void",
    () => {
        Log4Ts.log(testGmPanel, `say something`);
    });
```

#### 添加一个 Vector 类型的指令

```typescript
addGMCommand("vector",
    "vector",
    (params) => Log4Ts.log(testGmPanel, `value: ${params}`));
```

- 程序可以惊喜的发现，`params` 是 `Vector` 类型，而非一个简单的 `string`。同时，使用者将遇到一个这样的输入框：

<div style="text-align: center;">
    <img src="pic/vector-input.png" style="width: 20rem;" alt="vector-input">
</div>

#### 添加一个带参数验证的 Integer 类型指令

```typescript
addGMCommand("range",
    "integer",
    (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
    undefined,
    {
        validator: [
            (param) => param >= 0 && param <= 10,
        ],
    },
    "Validator");
```

- validator 是一个数组，可以添加多个验证函数。  
  当输入框失去焦点时，将会依次调用这些函数，如果有一个函数返回 `false`，则会提示用户输入不合法。
- validator 的元素为一个 (`DataValidator`) 谓词，或是一个 归因 󰌆数据验证器 (`DataValidatorWithReason`)
  ，后者在验证失败时，会提示用户输入不合法的原因。
- `"Validator"` 指明该命令属于 Validator 组。

```typescript
addGMCommand("range",
    "integer",
    (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
    undefined,
    {
        validator: [
            RangeDataValidator(0, 10),
        ],
    },
    "Validator");
```

- 也可以使用 `RangeDataValidator` ，它是内置的参数验证生成器中的一个，它能够快速提供一个可归因的范围验证。

#### 添加一个 Enum 类型指令

```typescript
enum DynamicEnum {
    A,
    B,
    C,
}

addGMCommand("enum A",
    DynamicEnum,
    (params) => {
        switch (params) {
            case DynamicEnum.A:
                Log4Ts.log(testGmPanel, `StateA`);
                break;
            case DynamicEnum.B:
                Log4Ts.log(testGmPanel, `StateB`);
                break;
            case DynamicEnum.C:
                Log4Ts.log(testGmPanel, `StateC`);
                break;
        }
        Log4Ts.log(testGmPanel, `value: ${params}`);
    },
    undefined,
    undefined,
    "Enum");
```

- 同样地，`params` 是 `DynamicEnum` 类型。
- 由于 LviatYi 为程序付出了诸多关于类型推断的努力，任何动态的 Enum 类型都是允许的。
- Enum 不需要参数验证。因为使用者将使用 Lui 的 AutoComplete 控件，选择一个编译阶段前定义好的 Enum 值。

#### 添加一个 GameConfig

```typescript
addGMCommand("use DialogueContentNode Config",
    GameConfig.DialogueContentNode,
    (params) => {
        Log4Ts.log(testGmPanel,
            `id: ${params.id}`,
            `content: ${params.content}`);
    },
    undefined,
    undefined,
    "Config");
```

- GameConfig 是由 @ZeBin.Ge 定义的静态数据配置规范。
- GodMod 将自动捕获 id name 等字段，并提供预览能力。

<div style="text-align: center;">
    <img src="pic/game-config-preview.png" style="width: 20rem;" alt="game-config-preview">
</div>

- params 是 `IDialogueContentNodeElement` 类型。
- 使用者输入对应配置的 ConfigId。

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z

[sonpt]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/depend/jibu-module#statement-

[233Web]:https://portal.ark.online/