# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-agent-execution-controls`
- 使用场景：在执行态消息已接入 runtime stream 后，继续补齐消息内控制动作，形成更完整的前端智能体执行闭环
- 使用流程：`propose -> apply-change`

## 本次规划结论

当前聊天页已经能展示并持续更新 `agent-execution` 消息，但用户仍只能被动观察执行过程。本轮将执行态从“可观测”推进到“可操作”，在消息卡片内部补齐 `stop / retry / continue` 控制协议、远端接口和本地 mock 联调。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-controls/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-controls/design.md:1)
- [chatbot-agent-execution-controls spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-controls/specs/chatbot-agent-execution-controls/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-controls/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-controls/tasks.md:1)

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/data.ts:1) 中新增：
   - `IAgentExecutionControl`
   - `controls` / `pendingControlKey` / `controlErrorMessage`
   - `applyAgentExecutionMessagePatch(...)` 对控制态字段的合并逻辑
2. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.ts:1) 中新增：
   - `CHAT_AGENT_EXECUTION_CONTROL_API_URL`
   - `AgentExecutionControlResult`
   - `executeRemoteAgentExecutionControl(...)`
3. 在 [src/pages/chatbot/_mock.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/_mock.ts:1) 中新增 `/api/chatbot/execution-control` 本地 mock 接口
4. 在 [AgentExecutionMessage.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/messages/AgentExecutionMessage.tsx:1) 中渲染执行态控制按钮、pending/loading 和错误提示
5. 在 [index.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/index.tsx:1) 中新增消息级 `handleAgentExecutionControl(...)`，将控制请求与本地 patch 更新接通
6. 在 [mockPayloadFactory.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/mockPayloadFactory.ts:1) 中为 `agent-execution` mock 增加控制动作
7. 补齐测试：
   - [service.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.test.ts:1)
   - [AgentExecutionMessage.test.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/messages/AgentExecutionMessage.test.tsx:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 结果：通过，`14` 个 suite、`82` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. `agent-execution` 卡片现在不仅能展示和更新，还能在卡片内部发起停止、重试、继续等消息级控制
2. 控制请求先给本地即时反馈，再等待后续 runtime stream 收敛状态
3. 页面仍保持纯对话交互，没有引入额外的全局控制面板
