# Lynx UI

<div style="text-align: right; ">
    <img 
src="https://raw.githubusercontent.com/LviatYi/MetaWorldNPT/main/MetaWorldNPT/JavaScripts/lui/pic/lynx-ui.png" 
alt="Lynx Logo" 
width="200px"
align="right">
</div>

> 轻型全地形模块化猫猫车

Lynx UI (山猫) 是一套面向 Mw 的组件库. 灵感来自于 [󰍗 MaterialUI][MaterialUI].

v31.1.10

## Philosophy ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

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

[MaterialUI]: https://mui.com/material-ui/