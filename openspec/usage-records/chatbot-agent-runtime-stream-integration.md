# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-agent-runtime-stream-integration`
- 使用场景：在已有 `agent-execution` 消息和本地 patch/store 能力基础上，继续把执行态接入真实聊天页运行时流
- 使用流程：`propose -> apply-change`

## 本次规划结论

当前聊天页已经具备执行态消息渲染和按消息 id 更新的最小前端能力，但这条链路还没有接到远端运行时。继续增加展示型卡片无法解决核心问题，本轮优先把 `agent-execution` 从“能显示”推进到“能跟随 agent runtime 持续更新”。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-runtime-stream-integration/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-runtime-stream-integration/design.md:1)
- [chatbot-agent-runtime-stream-integration spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-runtime-stream-integration/specs/chatbot-agent-runtime-stream-integration/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-runtime-stream-integration/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-agent-runtime-stream-integration/tasks.md:1)

## 实施内容

1. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.ts:1) 中新增：
   - `CHAT_AGENT_RUNTIME_STREAM_API_URL`
   - `AgentRuntimeStreamBatch`
   - `fetchRemoteAgentRuntimeStreamBatch(...)`
2. 在 [src/pages/chatbot/_mock.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/_mock.ts:1) 中新增 `POST /api/chatbot/runtime-stream` 本地 mock 接口
3. 在 [structuredMessageStore.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/structuredMessageStore.ts:1) 和 [useLocalStructuredMessages.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/useLocalStructuredMessages.ts:1) 中新增 upsert 能力，支持远端执行态消息进入本地可更新 store
4. 在 [buildBubbleItems.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/buildBubbleItems.tsx:1) 中按消息 id 去重，避免远端结构化执行态和本地镜像消息重复渲染
5. 在 [index.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/index.tsx:1) 中新增：
   - 远端 `agent-execution` 消息同步到本地 store
   - 运行时 patch 批次轮询消费
   - 会话切换与终态清理逻辑
6. 在以下测试文件中补齐回归：
   - [service.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.test.ts:1)
   - [structuredMessageStore.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/structuredMessageStore.test.ts:1)
   - [buildBubbleItems.test.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/buildBubbleItems.test.tsx:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 结果：通过，`14` 个 suite、`78` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. `agent-execution` 已从静态结构化卡片推进为远端可持续更新的执行态消息
2. 聊天页仍保持纯对话交互，没有重新引入演示卡片
3. 后续如果后端从当前批量 patch 拉取接口升级为 SSE 或 WebSocket，可以继续沿用本轮定义的前端同步与更新边界
