# MetaWorldNPT

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

## Thanks ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

- **.gitignore** @minjia.zhang @maopan.liao
- **GToolkit** G.S.C. GTk Standards committee. GTk 标准委员会.
- **Dialogify** @zewei.zhang
- **GodMod** @zewei.zhang

[JetbrainsMonoNerdFont]:https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]:https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
