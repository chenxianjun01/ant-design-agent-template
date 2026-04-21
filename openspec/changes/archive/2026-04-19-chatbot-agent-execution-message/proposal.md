## Why

当前聊天界面已经能渲染文本、表单、审批卡片和时间轴，但还缺少真正贴近智能体产品核心的“执行中反馈”消息。继续往下做 agent 场景时，如果没有统一的执行态消息类型，工具调用步骤、多阶段状态和失败节点只能散落在文本里，既不利于用户理解，也不利于后续接入真实 orchestration 回执。

## What Changes

- 新增一个结构化 `agent-execution` 消息类型，用于展示智能体执行中的步骤状态和阶段进展。
- 为 `agent-execution` 定义稳定协议，包括整体状态、摘要、步骤列表和时间信息。
- 在 `MessageRenderer` 中接入专用渲染组件，提供运行中、成功、失败三类视觉状态。
- 在本地 mock provider 中提供 `agent-execution` 示例，便于联调和演示。
- 补充消息协议、渲染和 mock contract 的测试基线。

## Capabilities

### New Capabilities

- `chatbot-agent-execution-message`: 定义智能体执行态结构化消息的协议、渲染和本地 mock 基线。

### Modified Capabilities

- `chatbot-agent-ui`: 增加对智能体执行态消息覆盖的长期要求。

## Impact

- 代码范围：`src/pages/chatbot/data.ts`、`src/pages/chatbot/components/MessageRenderer.tsx`、`src/pages/chatbot/components/messages/AgentExecutionMessage.tsx`、`src/pages/chatbot/mockPayloadFactory.ts`、`src/pages/chatbot/service.ts`
- 测试范围：`src/pages/chatbot/components/MessageRenderer.test.tsx`、新增执行态消息组件测试、`src/pages/chatbot/service.test.ts`
- 本地联调范围：chatbot mock 类型选择与结构化消息样例
