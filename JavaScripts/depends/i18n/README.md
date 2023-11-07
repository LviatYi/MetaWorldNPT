# i18n 助手

> 合作共赢，拒绝阻塞

i18n.ts 是一个多语言翻译工具的 **程序端接口** 及 **规范**。其允许在程序与策划在更流畅的工作流之下完成对动态文本的翻译工作。

v1.1.0b  
by LviatYi
by maopan.liao
by minjia.zhang

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
  Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **拒绝阻塞** 规范了一种新的工作流，允许策划与程序主键定义时机动态化，从而异步、复用翻译工作。
- [x] **成熟自持** 自动使用默认语言，快速开始其他工作。
- [x] **力所能及** 自处理初始化工作，不再将无谓的细节暴露在外。
- [x] **战略纵深** 多级配表，记录开发时的即兴灵感。

## Deficiency ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

然而它亦面临无法避免的难题：

- **初生牛犊** i18n.ts 目前处于乳臭未干的状态。

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

无需初始化，但当要指定语言时，需要手动选择使用的语言：

```typescript
i18n.use(LanguageTypes.English);
```

程序应调用此接口调用翻译：

```typescript
const UI_TEXT_KEY = "UI_Key001";
ui.text = i18n.lan(UI_TEXT_KEY);
```

## Flow ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

i18n.ts 旨在优化多语言配置工作流。

程序权利及义务：

- 应注意任何动态文本，可自行定义文本 Key，并将其置入 **languageDefault 缺省语言配置表** 中，从而在开发时达成动态文本显示
- 无需在未来对已调用 i18n.lan 的控件进行任何维护。

策划权利及义务：

- 自行维护静态文本。
    - 在前期，允许直接在控件中使用中文文本，这将正确显示。
    - 在后期，自行定义文本 Key。仅需完成多语言配置，即正确显示。
- 应注意任何存在于 **languageDefault 缺省语言配置表** 中的内容。
    - 当存在 key-value 对时，意味着存在一条动态文本未在配置表中配置。
    - 应将其置入 **Language.xlsx 多语言配置表**，并删除这行记录。

i18n.ts 进行梯级查询。

1. 首先查询 **Language.xlsx 多语言配置表**。
2. 不存在则查询 **languageDefault 缺省语言配置表**，这将显示缺省语言提供的默认的语言。
3. 不存在则意味着 key 本身即为文本，将直接显示。

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z