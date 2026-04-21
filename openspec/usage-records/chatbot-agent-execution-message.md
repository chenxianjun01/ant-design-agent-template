# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-agent-execution-message`
- 使用场景：在完成运行边界与 TypeScript 基线收口后，继续推进智能体核心运行时反馈能力
- 使用流程：`propose -> apply-change`

## 本次规划结论

本轮没有继续扩静态结果型消息，而是直接切到更核心的 agent 运行态反馈。原因是开发记录里已经明确，真正的智能体界面优先级更高的是工具调用步骤、多阶段执行轨迹和失败节点可见性，而不是再加一类普通展示卡片。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-message/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-message/design.md:1)
- [chatbot-agent-execution-message spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-message/specs/chatbot-agent-execution-message/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-message/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-message/tasks.md:1)

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/data.ts:1) 中新增：
   - `MessageType.AGENT_EXECUTION`
   - `IAgentExecutionMessageContent`
   - `IAgentExecutionStep`
2. 新增 [AgentExecutionMessage.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/messages/AgentExecutionMessage.tsx:1)，并在 [MessageRenderer.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/MessageRenderer.tsx:1) 中注册 `agent-execution`
3. 在 [mockPayloadFactory.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/mockPayloadFactory.ts:1) 与 [service.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.ts:1) 中补齐 `agent-execution` 本地 mock payload 与 mock selector
4. 在 [index.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/index.tsx:1) 中将 `agent-execution` 接入 mock 类型标签和快捷入口
5. 在以下测试中补齐覆盖：
   - [MessageRenderer.test.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/MessageRenderer.test.tsx:1)
   - [AgentExecutionMessage.test.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/messages/AgentExecutionMessage.test.tsx:1)
   - [service.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.test.ts:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 结果：通过，`13` 个 suite、`73` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. 聊天模块现在已经具备一类真正面向 agent 场景的执行态消息
2. 工具步骤、阶段状态和失败节点终于不需要再退回纯文本表达
3. 后续如果继续做真实 tool-call 回执、步骤级增量更新或中断/重试控制，可以在这条协议上继续扩，而不必再发明新入口
