# Known 认知

## 可能的 RPC 调用

- Event.
- Module `net_` 前缀函数.
    - `MWTSLIB:Info-->>sendrpc`
    - `MWTSLIB: Info -->> recvRpc`
- Script `RemoteFunction` 函数.
    - `MWTSLIB:Info-->>sendrpc`
- Script `@mw.Property.onChanged`
    - `MWTSLIB:Info--->>>PreReplicated`
- SubData Action
    - `MWTSLIB:Info-->>sendrpc`

## Level 文件 推断含义

### ActorFlag

位标记。

- `1<<3` 隐藏
- `1<<4` 锁定