## Why

当前聊天页已经具备 `agent-execution` 消息渲染和按 `message.id` 局部更新的前端能力，但这些能力还停留在本地协议层，尚未接入真实运行时事件流。继续增加展示型消息价值有限，当前更需要把执行态真正接到远端运行链路，让同一条对话消息能够随着智能体执行推进而持续更新。

## What Changes

- 新增聊天页运行时事件流接入能力，用于消费远端 `agent-execution` patch 事件并更新既有消息
- 新增本地 mock runtime stream 接口，保证 remote 模式下本地联调仍然可用
- 扩展聊天页结构化消息同步逻辑，使远端返回的 `agent-execution` 消息能够进入本地可更新存储
- 为运行时流接入补充测试、开发记录和使用记录

## Capabilities

### New Capabilities
- `chatbot-agent-runtime-stream-integration`: 定义智能体执行态运行时事件流接入、消费和更新行为

### Modified Capabilities
- `chatbot-agent-ui`: 增加远端 `agent-execution` 消息同步到本地更新链路、并通过运行时事件流持续增量更新的要求

## Impact

- 受影响代码主要位于 `src/pages/chatbot/index.tsx`、`src/pages/chatbot/service.ts`、`src/pages/chatbot/_mock.ts`、`src/pages/chatbot/components/schema/*`
- 新增远端 runtime stream 接口与本地 mock 联调协议
- 需要补充聊天页非可视逻辑测试与 OpenSpec 记录
