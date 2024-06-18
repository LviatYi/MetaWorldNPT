# MwEditor Code Style Guideline

by G.S.C. Gtk 标准委员会

[TOC]

额外链接：

1. [TsDoc](./tsDoc.md)
1. [Ui Style](./uiStyle.md)

## 词汇

本文档使用如下词汇描述规则的强制程度：

| 词汇                  | 含义                    |
|---------------------|-----------------------|
| 必须 MUST             | 规范的绝对要求               |
| 禁止 MUST NOT         | 规范的绝对禁止               |
| 推荐 RECOMMENDED      | 可能存在正当理由以忽略条目，但必须权衡利害 |
| 不推荐 NOT RECOMMENDED | 可能存在正当理由以忽略条目，但必须权衡利害 |
| 可以 MAY              | 某些场合下可以选用条目           |

本文档在延伸信息中使用如下词汇解释规则：

| 词汇 | 含义              |
|:--:|:----------------|
| 说明 | 对规约做了适当扩展和解释    |
| 正确 | 符合强制性规则的编码或实现方式 |
| 错误 | 违反规则的编码或实现方式    |
| 建议 | 受提倡的编码或实现方式     |

参考 [RFC-2119][RFC2119]

## 编码

丑玩意自己都能看出来，看不出来就挨我打。

科学独断论会告诉你美是客观存在且唯一的，只是愚蠢的人类无法理解完全、描述完全。

## 业务

### 必须 遵守「仅服务端函数不扩散条约」(Server Only Non-Proliferation Treaty, SONPT)

SONPT 的必要条件：

- 客户端无法篡改服务器运行时.
- 客户端无法篡改持久化存储服务器数据.

SONPT 所应对的风险假设：

- C 端可以篡改 game.js
    - C 端可以调用任何本地端函数.
    - C 端可以发送任何 Event.
        - C 端可以调用任何 Remote 函数、Module net_ 前缀函数.
    - C 端可以篡改任何静态数据.
- C 端可以修改内存.

SONPT 的最佳实践：

- 启用 JAC 反作弊模块
    - 在你的项目中引入 JModule，并在其中一个 Module 中启用 JAC 反作弊模块。
    - 这可为开发者拒绝一切来自客户端的非 net_ 函数调用。
- 尽可能地避免 仅服务端 函数在客户端的直接或间接调用
    - 如果引入了 JModule，你仅需关注 net_ 函数。请谨记 net_ 函数是不安全的，用户可以在任何时机调用它们。
- 谨慎对待双端函数
    - 对于仅服务端函数，如果通过属性同步或 net_ 函数间接调用，请施加校验。

谨记任何双端函数都可以被客户端调用。如果想避免非预期的作弊，请为双端函数在服务端施加校验。

---

### 禁止 以常规方式使用 `module_gm`

`module_gm` 是一个后台管理模块。 AddGMCommand 将违背 SONPT 原则。未加验证的 AddGMCommand 函数都将成为作弊的切口。

可以使用 `mw-god-mod` 替代它。

```shell
npm i mw-god-mod
```

---

### 推荐 使用 Log4Ts 代替 `console`

Log4Ts 在编译阶段前强制要求日志发送者标注宣称，以解决匿名日志难以追溯的问题。

```shell
npm i mw-log4ts
```

---

### 推荐 使用 推荐 JModule 而非 原生 Module

JModule 在效率与接口上提供了遵守 SONPT 与 维护数据安全的必要性与简单性。

---

### 推荐 优先使用 GToolkit 中已存在的函数展开

过多自产自销且缺乏文档的工具函数会增加代码的维护成本。

```shell
npm i gtoolkit
```

[RFC2119]:https://www.rfc-editor.org/rfc/rfc2119.txt

[JModule]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/depend/jibu-module

[Log4Ts]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/depend/log4ts

[GodMod]:https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/depend/god-mod
