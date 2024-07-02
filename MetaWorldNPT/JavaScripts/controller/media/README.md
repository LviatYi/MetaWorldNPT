# MediaService

**MediaService** 是一个多媒体（音效、粒子特效）管理前后端。

v31.1.0  
by LviatYi

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font
    Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [x] **直达天听** 暴露原生参数 绝不封死自有功能.
- [x] **选项对象** 使用选项对象传递参数 快捷地接受来自配置表的内容.
- [x] **雕梁画栋** 建造者模式，一砖一瓦地赋能 SoundProxy。
- [x] **残影回声** Blur 与 Echo，延迟生成或不生成不可感知的多媒体效果.

## Idea ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

- 对 Media 的精细控制只允许在 Client 端进行。
    - Media 效果是一种仅在 Client 具备意义的客观存在。
    - 在 MW 中，为了减少性能压力，Server 端的音效资产是虚假的，其中信息如 timeLength 永远为 0。
    - 这意味着，Server 端无法对 Media 进行精细控制。
- 屏蔽在 原生 `mw.Sound` 与 `mw.Effect` 的 play 方法中，对参数 onSuccess 的使用。
    - 该参数用于在音效播放结束时执行的回调函数，存在意义是帮助程序员快速部署一个带有结束回调的音效播放。
    - MediaService 旨在提供 **选项对象** 与 **雕梁画栋** 的使用便利，以确保更稳定的调用模式；且原生 play 方法所添加的
        onSuccess 回调，并非「单次性」的，多次调用将重复添加回调。
    - 为了在编译期前获得更可知的结果，因此将在 MediaService 层屏蔽 onSuccess 参数。

## Config ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

### Sound

MediaService 所推荐的音效配置，应提供如下配置项：

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
    - 空间衰减函数模型.
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
- **isExclusive**
    - 是否 独占音效.
    - 独占音效在播放时会停止其他同 AssetId 音效.

### Effect

MediaService 所推荐的例子特效配置，应提供如下配置项：

- **id** Config ID.
- **assetId** 粒子特效资产 ID.
- **loopCountOrDuration** 循环次数或持续时长.
    - 自动适应 `mw.Effect.loop` 属性.
    - 当特效为循环特效时 该属性作为循环时长. ms
    - 当特效为非循环特效时 该属性作为循环次数.
- **positionOffset**
    - 位置偏移量.
- **rotation**
    - 旋转.
- **scale**
    - 拉伸.
- **slotType**
    - 人形角色插槽类型.
    - 仅作用于 `parent` 为 `mw.Character` 类型时.

| Slot              | SlotName       | Value |
| ----------------- | -------------- | ----- |
| Hair              | 头发           | 0     |
| Head              | 脸部           | 1     |
| LeftHead          | 头部左侧       | 2     |
| RightHead         | 头部右侧       | 3     |
| Glasses           | 眼镜           | 4     |
| Eyes              | 眼睛           | 5     |
| FaceOrnamental    | 面部装饰       | 6     |
| Mouse             | 嘴部           | 7     |
| LeftShoulder      | 左肩部         | 8     |
| RightShoulder     | 右肩部         | 9     |
| LeftGlove         | 左手手套       | 10    |
| RightGlove        | 右手手套       | 11    |
| BackOrnamental    | 背部装饰       | 12    |
| LeftBack          | 左背           | 13    |
| RightBack         | 右背           | 14    |
| LeftHand          | 左手           | 15    |
| RightHand         | 右手           | 16    |
| LeftFoot          | 左脚           | 17    |
| RightFoot         | 右脚           | 18    |
| Buttocks          | 臀部           | 19    |
| Rings             | 头顶光圈       | 20    |
| Nameplate         | 头顶标题       | 21    |
| ChatFrame         | 聊天框         | 22    |
| Root              | 根节点         | 23    |
| LeftLowerArm      | 左手肘         | 24    |
| RightLowerArm     | 右手肘         | 25    |
| LeftThigh         | 左大腿根       | 26    |
| RightThigh        | 右大腿根       | 27    |
| LeftCalf          | 左膝盖         | 28    |
| RightCalf         | 右膝盖         | 29    |
| FirstpersonCamera | 第一人称摄像机 | 30    |

- **客制化参数**
    - 使用符合条件的 string 客制化参数.
    - 如对于一个可定义作为 `floatParams` 的 `length` 与 `width` 属性的粒子特效，可进行如下配置：
        - `length:10|width:20`
    - 如对于一个可定义作为 `colorRandomParams` 的 `back-color` 属性的粒子特效，可进行如下配置：
        - `back-color:#FF0000,#FF2222`
    - **floatParams**
        - `key:value[|key:value]...`
    - **floatRandomParams**
        - `key:minValue,maxValue[|key:minValue,maxValue]...`
    - **vectorParams**
        - `key:x,y,z[|key:x,y,z]...`
    - **vectorRandomParams**
        - `key:minX,minY,minZ,maxX,maxY,maxZ[|key:minX,minY,minZ,maxX,maxY,maxZ]...`
    - **colorParams**
        - `key:hex[|key:hex]...`
    - **colorRandomParams**
        - `key:minHex,maxHex[|key:minHex,maxHex]...`
- **cullDistance**
    - 裁剪距离.
    - 与玩家之间超出此距离的对象将被剪裁.
- **singleLength**
    - 粒子特效的单次播放时长.
    - 用于纠正 `onFinish` 等事件的播出准确性.
    - 为 0 或未定义时 将智能查询该属性.

## Pity ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

以下列举 Lynx UI 开发过程中所遇到的、已解决或未解决的、已绕开或未绕开的 MW UI 缺陷：

- 当 Sound 所需要的 Asset 未加载时，对 isLoop 属性的修改将被后续 play 中的加载行为错误地覆写。
- 当 SoundAsset 在进行以下步骤前，`timeLength` 属性查询结果将为 0：
    - Load Asset。
    - `play` 或 `setSoundAsset` 调用。
- 缺失的 SoundPlayState 枚举导出。
- 错误的 `Effect.timeLength` 属性。
- 缺失的 `Effect` 与 `Sound` 单次完成 时机。

[JetbrainsMonoNerdFont]: https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont
[SarasaMonoSC]: https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z