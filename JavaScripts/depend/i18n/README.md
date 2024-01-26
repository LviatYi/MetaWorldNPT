# i18n4Ts

> 合作共赢，拒绝阻塞

i18n.ts 是一个多语言翻译工具的 **程序端接口** 及 **规范**。其允许在程序与策划在更流畅的工作流之下完成对动态文本的翻译工作。

v1.6.4b  
by LviatYi  
thanks zewei.zhang  
thanks maopan.liao  
thanks minjia.zhang

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **拒绝阻塞** 规范了一种新的工作流，允许策划与程序主键定义时机动态化，从而异步、复用翻译工作。
- [x] **不忘初心** 手动保持原始 lan_key，解决动态切换多语言时原始 text 所持有 lan_key 被覆写的根源痛点。
- [x] **成熟自持** 自动使用默认语言，快速开始其他工作。
- [x] **力所能及** 自处理初始化工作，不再将无谓的细节暴露在外。
- [x] **战略纵深** 多级配表，记录开发时的即兴灵感。
- [x] **君主立宪** 使用 LanguageTable 与 ResolveTable 提供编译期 LanKey 检查。允许使用 F2 一键更新 LanKey。
- [x] **指挥若定** 提供响应式绑定，允许在多语言切换时自动更新文本。

## Deficiency ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

然而它亦面临无法避免的难题：

- **安石变法** i18n.ts 推荐一种新型的工作流，这可能与你的固有习惯不同。
    - 由于只维护一遍 key ，key 在 Ts 中的维护职权下发到具体的使用地，即去中心化。
    - 由于 key 的定义权力分享给程序，而负责子功能的程序可能并不了解同义文本的存在，这将导致 key 的滥发。

## Use ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

首先，你需要定义语言类型：

```typescript
export enum LanguageTypes {
    English,
    Chinese,
    Japanese
}
```

枚举值顺序与配置表中的信息应保持一致。

无需初始化，默认使用配置表首列语言作为默认语音。同时若要指定语言，可手动选择：

```typescript
i18n.use(LanguageTypes.English);
```

程序应调用此接口调用翻译：

```typescript
const UI_TEXT_KEY = "UI_Key001";
ui.text = i18n.lan(UI_TEXT_KEY);
```

但更推荐将 LanKey 写入 languageDefault 中：

```typescript
// i18n.ts
let languageDefault = {
    LanKey: "Default",
};
// someUi.ts
ui.text = i18n.lan(i18n.lanKeys.LanKey);
```

或使用简写：

```typescript
ui.text = i18n.resolves.LanKey();
```

如果接入了动态调整语言的选项，则推荐使用：

```typescript
import i18n from "./i18n";

i18n.bind(ui, i18n.lanKeys.LanKey);
```

## Flow ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

i18n.ts 旨在优化多语言配置工作流。

程序权利及义务：

- 应记录任何动态文本，即需要在程序中控制变化的文本。
    - 可自行定义文本 LanKey，并将其置入 **languageDefault 缺省语言配置表** 中。
    - 将未出现在配置表的动态文本告知策划，并告知 **languageDefault** 的配置位置。
- 无需在未来对已调用 i18n.lan 的控件进行任何维护。

策划权利及义务：

- 自行维护静态文本。
    - 静态文本即不需要在程序中控制变化的文本。
    - 如果在带有文字的 UI 控件中使用静态文本的 LanKey，在配置表完成配置后将自动翻译。
    - 否则将直接显示原内容。
- 应注意任何存在于 **languageDefault 缺省语言配置表** 中的内容。
    - 将未出现在配置表的 LanKey，整理到 **Language.xlsx 多语言配置表** 中。
    - 不要删除 i18n.ts 中的任何内容。

i18n.ts 进行梯级查询。

1. 首先查询 **Language.xlsx 多语言配置表**。
2. 不存在则查询 **languageDefault 缺省语言配置表**，这将显示缺省语言提供的默认的语言。
3. 不存在则意味着 key 本身即为文本，将直接显示。

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z