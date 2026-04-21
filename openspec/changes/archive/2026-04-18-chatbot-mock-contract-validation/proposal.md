## Why

本地 mock provider 已成为聊天界面联调和回归验证的基础，但当前缺少自动化契约校验，无法保证 mock 输出持续符合共享消息协议。继续扩展消息类型和 schema 能力前，需要先把 mock 输出与协议之间的关系锁住。

## What Changes

- 为 chatbot mock provider 增加结构化 payload 契约测试
- 覆盖 `table / chart / form` 三类单次返回 payload 的协议合法性
- 验证 text mock 仍保持非结构化文本流式模式

## Capabilities

### New Capabilities

- `chatbot-mock-contract-tests`: 本地 mock payload 与共享消息协议的一致性测试

### Modified Capabilities

- `chatbot-agent-ui`: 为本地 mock provider 输出增加回归保护，避免 mock 样本与运行时协议漂移

## Impact

- 受影响区域主要是 `src/pages/chatbot/service.ts` 与对应测试文件
- 不改变运行时业务逻辑，仅新增测试访问入口和测试覆盖
- 验证将继续复用聊天模块 Jest 和项目级 `tsc`
