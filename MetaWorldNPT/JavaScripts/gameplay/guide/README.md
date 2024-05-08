# Operation Guider

> 愿星辰指引你的道路.  
> May the stars guide you. —— 魔兽争霸.

一个侵入式的引导配置与时机管理工具。

v31.18.2  
by LviatYi

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
  Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **层台累榭** 建造者模式，层层叠起高复杂度的引导任务组。
- [x] **锦囊妙计** 针对常见引导范式提供预设模板。
- [x] **本质抽象** 将引导任务精确抽象。让尽可能多的引导任务得以被描述。
- [x] **原子精确** 准点报时，对单个或群组引导任务的起始、过程与结束进行针对性控制。

## Deficiency ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

然而它亦面临无法避免的难题：

- **民粹主义** 侵入式的原则要求 OG 不依赖任何其他模块。
    - 这意味着如 UI 引导任务中，使用者需要以黑暗的手法，而非外部模块已提供的接口，来取得
      UI 控件。

## State ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

### Tween Task State

对于每个 Tween Task，具有如下状态：

- 播放状态
    - `󰐊播放`
    - `󰏤暂停`
    - `󰄲完成`
- 时序状态
    - `󰐊正放`
    - `󰓕倒放`
- 循环状态
    - 非循环
    - `重复` 完成后 `重置` 补间.
        - 你不应该在循环状态下访问 isDone.
- 往复状态
    - 非往复
    - `󱞳往复` `󰐊正放`结束后 `󰓕倒放`.

不同维度的状态相容，而各自的子状态之间互斥。

---

### Tween Task Group State

对于每个 Tween Task Group，具有如下状态：

- 播放状态
    - `󰐊播放`
    - `󰏤暂停`
    - `󰄲完成`
- 时序状态
    - `󰐊正放`
    - `󰓕倒放`
- 编排状态
    - `󰒿顺序`
    - `平行`
- 循环状态
    - 非循环
    - `重复` 完成后 `重置` 补间.
        - 你不应该在循环状态下访问 isDone.
- 往复状态
    - 非往复
    - `󱞳往复` `󰐊正放`结束后 `󰓕倒放`.

不同维度的状态相容，而各自的子状态之间互斥。

---

## Behavior ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

### AutoDestroy

如果未设置 `autoDestroy(true)` ，需手动删除任务。

---

## Example ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

![示例图片](pic/example.png)

```typescript
import Waterween from "./Waterween";

Waterween.group(
    getter,
    setter,
    [
        {dist: {task1: d1}, duration: task1Duration},
        {
            dist: {task2_1: d2_1}, duration: task2_1Duration, isParallel: true, subNode: [
                {dist: {task3: d3}, duration: task3Duration},
                {dist: {task4_1: d4_1}, duration: task4_1Duration, isParallel: true},
                {dist: {task4_2: d4_2}, duration: task4_2Duration, isParallel: true},
            ]
        },
        {dist: {task2_2: d2_2}, duration: task2_2Duration, isParallel: true, isFocus: true},
        {dist: {task5: d5}, duration: task5Duration}
    ]
);
```

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z