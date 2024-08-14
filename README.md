# MetaWorldNPT

> :warning:   
> MetaWorldNPT 致力于对 mw 生态提供更稳定的功能子集、更规范的范式模板，截止目前代码共计 15w 行。  
> 但出于某些原因，**该库于 2024/08 终止维护。**  
> 由于 mw 编辑器以不稳定著称，随着编辑器的继续更新，该库的功能可能将失效。  
> 受 G.S.C 担保的稳定功能的最后兼容版本一般由 功能模板/包 版本号指明。  
> 但该库仍提供了不依赖 mw 生态、原生 TS 的可用功能模块，可供参考。  

> 雕梁画栋 高屋建瓴

MetaWorld New Project Template

针对 MetaWorld 编辑器的新项目模板，包含了基本的游戏框架，以及一些来自 LviatYi 维护的功能模块。

旨在帮助你快速构建新项目。

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
  Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Deploy ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

该项目依赖 MW 编辑器运行。版本号由 `./MetaWorldNPT/Config/GameSetting.ini` 中的 `EditorVersion` 属性指明。

其次，该项目依赖 npm 构建，请确保具备该环境。

具备以上条件后，请运行根目录下的 deploy.cmd。

```shell
./deploy.cmd
```

由于该项目是一个实验性项目，因此其承担了一些功能模块的测试任务。NPT 所引用的一些库由 npm link 而来。首次运行时，你的环境并未进行过
link 工作。而 deploy.cmd 则帮助你完成它。

## Portal ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

MetaWorld NPT 与 G.S.C. 旨在为开发者提供高复用性、高文档覆盖率的模块。    
此处提供以功能作为分类的导航。具体模块请参阅其文档。

- **[GToolkit][gtoolkit]** 基础范式工具集。
    - 提供一些基础的工具函数。
- **[Dependencies Usage][dependencies-usage]** 可作为依赖库而使用。
    - GodMod、Yoact 响应式、Waterween 补间、JModule、区域管理、全局提示、对话、状态机、泊松盘随机采样...
- **[Controller Usage][controller-usage]** 可作为控制器而使用。
    - 键盘、多媒体、资产、埋点...
- **[Tester][game-start]** 部分用例与单元测试。

## Thanks ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

- **[linq.js][linq.js]** @mihaifm etc.
- **.gitignore** @minjia.zhang @maopan.liao
- **GToolkit** G.S.C. GTk Standards committee. GTk 标准委员会.
- **Dialogify** @zewei.zhang
- **GodMod** @zewei.zhang

[gtoolkit]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/util

[dependencies-usage]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/depend

[controller-usage]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/controller

[game-start]:https://github.com/LviatYi/MetaWorldNPT/blob/main/MetaWorldNPT/JavaScripts/GameStart.ts

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z

[linq.js]:https://github.com/mihaifm/linq