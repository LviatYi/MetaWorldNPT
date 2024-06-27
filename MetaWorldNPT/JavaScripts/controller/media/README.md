# MediaService

**MediaService** 是一个多媒体（音效、粒子特效）管理前后端。

v31.0.0  
by LviatYi

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
  Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- **直达天听** 暴露原生参数 绝不封死自有功能.

## Sound ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

### Config

MediaService 所提供的音效配置，提供了如下配置项：

- **id** Config ID.
- **assetId** 音效资产 ID.
- **loopCount** 循环次数.
    - <=0 无限循环.
    - > 0 指定次数的有限循环.
- **volume**
    - 音量. 0-1
    - 实际播放音量将受到 globalVolumeScale 影响.
- **isSpatial**
    - 是否 空间音效.
    - 仅空间音效时 声音的位置具有意义.
- **attenuationDistanceModel**
    - 空间衰减模型.
    - 仅作用于 空间音效.
- **attenuationShape**
    - 空间衰减形状.
    - 仅作用于 空间音效.

  | Shape  | Value |
  | ------ | ----- |
  | 球体   | 0     |
  | 胶囊体 | 1     |
  | 盒体   | 2     |
  | 锥体   | 3     |

- **attenuationShapeExtents**
    - 空间衰减形状的范围.
    - 该范围外 音效开始衰减.
    - 仅作用于 空间音效.
    - 针对不同的衰减形状，该属性的意义不同.

  | Shape  | X          | Y          | Z              |
  | ------ | ---------- | ---------- | -------------- |
  | 球体   | 球体半径   | -          | -              |
  | 胶囊体 | 半高       | 半径       | -              |
  | 盒体   | x          | y          | z              |
  | 锥体   | 圆锥体半径 | 圆锥体角度 | 圆锥体衰减角度 |

- **falloffDistance**
    - 空间衰减距离.
    - 空间衰减形状外 按照该距离进行衰减.
    - 仅作用于 空间音效.
- **isUiSound**
    - 是否 UI 音效.
    - UI 音效在游戏暂停时仍播放.
    - **在实际开发中鲜有使用的属性**

## Pity ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

以下列举 Lynx UI 开发过程中所遇到的、已解决或未解决的、已绕开或未绕开的 MW UI 缺陷：

- 当 Sound 所需要的 Asset 未加载时，对 isLoop 属性的修改将被后续 play 中的加载行为错误地覆写。
- 缺失的 SoundPlayState 枚举导出。

[JetbrainsMonoNerdFont]: https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]: https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z