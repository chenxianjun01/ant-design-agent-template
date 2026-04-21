## Why

聊天页现在已经能展示并持续更新 `agent-execution` 执行态，但用户仍然只能被动观察状态变化，无法对长任务执行进行控制。对真实前端智能体来说，执行态如果没有停止、重试、继续之类的控制能力，运行闭环仍然不完整，因此下一步需要把执行消息从“可观测”推进到“可操作”。

## What Changes

- 为 `agent-execution` 增加可声明的执行控制动作，如停止、重试、继续
- 为聊天页增加执行控制动作入口，并复用现有共享动作执行边界
- 新增远端执行控制接口与本地 mock 对齐能力
- 为执行控制交互补齐测试、记录和待办同步

## Capabilities

### New Capabilities
- `chatbot-agent-execution-controls`: 定义执行态消息的控制动作协议、交互行为和远端控制边界

### Modified Capabilities
- `chatbot-agent-ui`: 增加执行态消息控制能力及其在对话流中的交互要求

## Impact

- 受影响代码主要位于 `src/pages/chatbot/data.ts`、`src/pages/chatbot/components/messages/AgentExecutionMessage.tsx`、`src/pages/chatbot/index.tsx`、`src/pages/chatbot/service.ts`、`src/pages/chatbot/_mock.ts`
- 新增执行控制请求协议和本地 mock 接口
- 需要更新 `todo.md`、开发记录和 OpenSpec usage record
