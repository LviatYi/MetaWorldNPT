# TsDoc in Meta World

## 概述

TSDoc 是一个标准化 TypeScript 代码中使用的文档注释的建议，以便不同的工具可以提取内容而不会被彼此的标记混淆。

规范化的 TSDoc 无疑拥有更强的人机可读性。

LviatYi Known Base 收录了官方推荐的 TSDoc 标记。

[TsDoc | KnownBase][tsDoc-known-base]  
[TsDoc | TsDoc org][tsDoc-official]

TsDoc in Meta World 是 TsDoc 的超集。其提供一系列有含义的标记，以在实践中提供实用性与统一性。

## 标签

### `@desc`

- **块**

详细描述。

不再使用 `@summary`

### `@config`

- **修饰符**

标识此只读属性提取自配置文件。

### `@professional`

- **修饰符**

专业性的。

提供专业性的属性或方法，不使用此接口或属性即可完成常规功能。

### `@flag`

- **修饰符**

标志性枚举。

标识此枚举类型为标志性枚举，其提供位运算支持。

### `@friend`

- **修饰符**

友元。

标识此函数或属性仅允许友元类型或友元函数访问。

### `@nothrow`

- **修饰符**

承诺不抛出异常。

标识此函数不可能抛出异常。

[tsDoc-known-base]:https://github.com/LviatYi/KnownBase/blob/3c2b71fcee2dafc9c4658bf45c0f66692a2d4259/TypeScript/index/tsDoc.md#L1

[tsDoc-official]:https://tsdoc.org/