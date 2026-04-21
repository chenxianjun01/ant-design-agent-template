# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-agent-execution-runtime-updates`
- 使用场景：在完成 `agent-execution` 静态消息后，继续推进执行态的本地增量更新能力
- 使用流程：`propose -> apply-change`

## 本次规划结论

上一轮已经把 `agent-execution` 做成稳定消息类型，但它还只能静态展示。继续往下做 agent 场景时，更关键的问题是同一条执行消息如何随着步骤推进持续更新，而不是每次都插入一张新卡。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-runtime-updates/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-runtime-updates/design.md:1)
- [chatbot-agent-execution-runtime-updates spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-runtime-updates/specs/chatbot-agent-execution-runtime-updates/spec.md:1)
- [chatbot-agent-execution-message delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-runtime-updates/specs/chatbot-agent-execution-message/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-runtime-updates/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-execution-runtime-updates/tasks.md:1)

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/data.ts:1) 中新增：
   - `IAgentExecutionStepPatch`
   - `IAgentExecutionMessagePatch`
   - `applyAgentExecutionMessagePatch(...)`
2. 在 [structuredMessageStore.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/structuredMessageStore.ts:1) 中新增 `updateStructuredMessageByConversation(...)`
3. 在 [useLocalStructuredMessages.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/useLocalStructuredMessages.ts:1) 中暴露 `updateStructuredMessage(...)`
4. 在 [index.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/index.tsx:1) 中新增本地 execution demo，演示同一张 `agent-execution` 卡片从 `running` 逐步 patch 到 `success`
5. 在 [structuredMessageStore.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/structuredMessageStore.test.ts:1) 中补齐增量更新测试

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 结果：通过，`13` 个 suite、`74` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. `agent-execution` 不再只是静态结果卡片，而是具备了最小本地 runtime update 能力
2. 后续如果接真实事件流或 tool-call 回执，可以直接复用这一轮的 patch 协议和 store 更新入口
3. 本地联调时已经可以清楚观察“同一卡片增量推进”而不是“重复插卡”
