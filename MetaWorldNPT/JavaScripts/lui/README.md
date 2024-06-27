# Lynx UI

<div style="text-align: right; ">
    <img 
src="https://raw.githubusercontent.com/LviatYi/MetaWorldNPT/main/MetaWorldNPT/JavaScripts/lui/pic/lynx-ui.png" 
alt="Lynx Logo" 
width="200px"
align="right"
>
</div>

> 轻型全地形模块化猫猫车

Lynx UI (山猫) 是一套面向 Mw 的组件库. 灵感来自于 [󰍗 MaterialUI][MaterialUI].

v31.3.6

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
  Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Philosophy ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

### 动效完整性仅对桌面端负责

Mw UI 的某些事件或属性仅在桌面端表现正确。而 Lynx 的基础动效依赖这些属性。

Lynx 对于已知的属性错误的依赖 处理策略为：

- 如果是可以通过低成本的其他方式实现，则尝试实现。
    - 如 `TextField` 换行转 Blur 特性 依赖于 `newLineKeyBind` 属性。而该属性在移动端支持不良。
- 如果绕开成本过高，则在移动端关闭。
    - 如 `TextField` 的 Hover 动效依赖于 `isHovered` 属性。而该属性在移动端的获取焦点后将异常。

对于移动端上未知属性错误引发的问题，Lynx 将不会处理。

### 削弱文字在视觉中的占比

Mw UI 对文本的视觉表达是匮乏的。

其中文采用 `Droid Sans Fallback` ，而英文采用 `Roboto`，且无法更改字体。

因此 Lui 将有限的样式表达力尽可能少地分配在文本上。

- 优先使用面积占比更小的 Thin 字形。
- Lui 将不会管理字体大小及其带来的任何排版问题。
- 连带地，Lui 将不会管理由字体排版所影响的其他元素的排版。
- Lui 默认不对字体使用「自适应大小」。也不推荐你这样做。
    - 并列性但不同长度的文本 会因「自适应大小」变得大小不一而影响排版原则。

### 关注但不全依赖对齐

当带有缩放时，Mw UI 的布局策略变得诡异。

> 尝试在 UI 中放置如下的元素：  
> └ cnv (对齐 上下-左右) (size 200 100)  
> . └ imgMain 163428 (对齐 上下-左右) (size 400 200) (渲染锚点 0 0) (渲染缩放 0.5 0.5)
>
> 如果 cnv 的大小翻倍 (400 200)，imgMain 预期应以 2 倍变化 (800 400)。
>
> 然而实际上，imgMain 将以一种绝对意想不到的方式变化 (600 300)。

这种结果意味着，原有「填满」的布局，将在缩放与拉伸后变得「有空隙」。  
目前 Lui 未找到替代策略，以将对齐完全交给 Mw 进行处理。因此无法使用 12 圆角缩放 0.5 后产生 6 圆角 的高阶技巧。

因此 Lui 将尽量避免对带有缩放的元素进行对齐操作。

Lui 独立布局引擎是计划中的。

## Pity ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

以下列举 Lynx UI 开发过程中所遇到的、已解决或未解决的、已绕开或未绕开的 MW UI 缺陷：

- 缺失或错误的 InputBox focus 时机。
- 034 前错误的 NewLineKeyBind 行为。
- 034 后移动端错误的 NewLineKeyBind 行为。
- 在首次切换窗口前错误的 ScrollBox 滚动交互。
- 在首次切换窗口前错误的 Hover 相关属性。
- 移动端错误的 Hover 相关属性，点击后无法取消。
- 错误的 focus 行为，导致 `bindKey` 仍生效。
- 使用任何 bindKey 后，首次主动聚焦 InputBox 时，错误地自动失焦一次。
- 缺失的获取平台触摸位置的接口。
- 错误的 `onFoucsLost` 拼写与行为预期。
- 非常规的 `commit` 与 `click` 顺序。
- 缺失或错误的 `commitMethod` 属性。
- 不可用的 `renderSize` 与对齐约束同时设置时的行为。

[MaterialUI]: https://mui.com/material-ui/

[JetbrainsMonoNerdFont]: https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]: https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z