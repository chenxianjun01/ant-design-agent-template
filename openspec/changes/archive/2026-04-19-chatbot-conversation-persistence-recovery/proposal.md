## Why

当前聊天页已经具备结构化消息、执行态运行时流和执行控制能力，但刷新页面或重新进入后会话上下文仍然容易丢失，长任务也缺少恢复入口。前端智能体如果不能回到上一次工作现场，真实使用体验仍然不完整，因此下一步需要补齐本地会话持久化与恢复能力。

## What Changes

- 为聊天页增加本地会话快照持久化层，保存会话列表、活跃会话、聊天消息快照和结构化消息
- 页面初始化时恢复上次工作现场，并保证运行中的 `agent-execution` 可以继续接入已有 runtime stream
- 为删除会话和新建会话补齐与本地快照的一致性
- 为本地恢复能力补充测试、记录和待办同步

## Capabilities

### New Capabilities
- `chatbot-conversation-persistence-recovery`: 定义聊天页本地会话快照、恢复和运行中执行态恢复行为

### Modified Capabilities
- `chatbot-agent-ui`: 增加聊天页刷新后恢复会话、消息和结构化执行态的要求

## Impact

- 受影响代码主要位于 `src/pages/chatbot/index.tsx`、`src/pages/chatbot/components/schema/useLocalStructuredMessages.ts` 以及新增的本地持久化辅助模块
- 不引入新后端依赖，首轮使用浏览器本地存储完成恢复
- 需要更新 `todo.md`、开发记录和 OpenSpec usage record
