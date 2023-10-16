# Nolan Camera Movement System

Nolan 导演级运镜管理系统。面向 Meta World Camera 系统。  
目前处于开发阶段，并进行了小规模的测试。

v0.1.0a  
by LviatYi

阅读该文档时，推荐安装以下字体：

- [JetBrainsMono Nerd Font Mono][JetbrainsMonoNerdFont]
- [Sarasa Mono SC][SarasaMonoSC]

若出现乱码，其为 Nerd Font 的特殊字符，不影响段落语义。

## Functional ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

它旨在提供如下便利：

- [ ] **刚柔相济** 依赖单任务 AccessorTween，允许进行丝滑的运动控制。
- [ ] **身临影棚** 来自对大师的拙劣模仿，预置多种运镜方案。

## Deficiency ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

然而它亦面临无法避免的难题：

- **乳臭未干** Nolan 目前处于极度幼稚的状态。
- **屋檐之下** Nolan 高度依赖现有的 MetaWorld Camera 系统，作者无法提供随时对接更新的承诺，亦无法提供超越框架功能的承诺。

## Wiki ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

MetaWorld 文档最令人感到遗憾的一点，即其文档作者忽略了认知差异，将其视为理所当然。

很多概念在偷懒中忽略了重要概念的介绍，而接口本身却又不符合常识，这对使用者构成了极高的隐式成本。

Wiki 旨在尽可能抹平认知差异。如有疑问或错误，欢迎指出，期待与你的合作。

### ArmLength

在 UE 中，SpringArm 与 Camera 是呈父子级关系的两个组件，而 MetaWorld 中将其合并为一个。

在 MetaWorld 中，Camera WorldLocation 与 RelativeLocation 之间的换算 **并非** 直接作用于 Player。其父级组件实际上为
SpringArm。因此计算公式为：

$$
\text{WorldLocation} = \text{RelativeLocation} - \text{SpringArmLength} * \text{CameraSystemWorldRotation}
$$

这意味着 Camera 的实际坐标将受到 SpringArm 属性的影响。

### ArmRotation & ArmLocation

理论上，你应该优先调整 ArmRotation 与 ArmLocation 来进行运镜。然而在 MetaWorld 中，当相机旋转属性为 **输入控制**
时，这两个属性将不生效。

在 MetaWorld 中，为了减少一次由输入向 SpringArm 属性的写入，在 **输入控制** 时，控制器属性将直接作用于 Camera 本身。

一次违背直观换取性能的交易。

因此，当 **输入控制** 时，你应该直接控制控制器，从而模拟对 SpringArm 的控制。此方法在 027 版本前无法实现。

[JetbrainsMonoNerdFont]: https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip@fallbackFont

[SarasaMonoSC]: https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
