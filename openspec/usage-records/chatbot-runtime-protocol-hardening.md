# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-runtime-protocol-hardening`
- 使用场景：在 runtime stream、execution control 和会话恢复能力完成后，继续把 runtime patch/event/control 协议正式固化为联调 contract
- 使用流程：`propose -> apply-change`

## 本次规划结论

当前前端 runtime 协议已经能工作，但仍散落在 `data.ts`、`service.ts` 和 `_mock.ts` 中，不适合作为后端联调或后续 SSE/WebSocket 升级基线。本轮把这些边界整理成正式 contract，并通过 OpenSpec 把 stream 与 control 的协议要求同步回主 specs。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-protocol-hardening/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-protocol-hardening/design.md:1)
- [chatbot-runtime-protocol-hardening spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-protocol-hardening/specs/chatbot-runtime-protocol-hardening/spec.md:1)
- [chatbot-agent-runtime-stream-integration delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-protocol-hardening/specs/chatbot-agent-runtime-stream-integration/spec.md:1)
- [chatbot-agent-execution-controls delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-protocol-hardening/specs/chatbot-agent-execution-controls/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-protocol-hardening/tasks.md:1)

## 实施内容

1. 新增正式 contract 文档 [runtime-protocol-contract.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/runtime-protocol-contract.md:1)
2. 在 contract 中统一定义：
   - `IAgentExecutionMessagePatch`
   - `AgentRuntimeStreamBatch`
   - `AgentExecutionControlResult`
   - `/api/chatbot/runtime-stream`
   - `/api/chatbot/execution-control`
3. 同步把 OpenSpec 要求补到 runtime stream 与 execution control 两条主 specs
4. 保持当前前端类型、默认 endpoint 和本地 mock 与 contract 一致

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot/chatPersistence.test.ts src/pages/chatbot/service.test.ts --runInBand`
- 结果：通过，`2` 个 suite、`27` 个测试通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. runtime patch / stream / control 已经有一份稳定的正式 contract，可直接作为后端联调基线
2. 当前 HTTP 轮询实现和后续 SSE/WebSocket 升级都可以沿用同一组对象语义
3. 前端不再只靠实现代码“隐式表达协议”，而是有了明确可引用的合同文档
