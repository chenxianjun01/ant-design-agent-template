# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-runtime-observability-debugging`
- 使用场景：在 runtime 协议、流式更新、执行控制和恢复能力都补齐后，继续增加运行链路观测与调试视图
- 使用流程：`propose -> apply-change`

## 本次规划结论

当前智能体工作台的核心能力已经基本补齐，但一旦联调异常，开发者仍然缺少一套可直接查看的运行事件视图。本轮增加本地 runtime event store 和调试面板，把 request / stream / control / patch 全链路串起来，方便定位问题。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-observability-debugging/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-observability-debugging/design.md:1)
- [chatbot-runtime-observability-debugging spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-observability-debugging/specs/chatbot-runtime-observability-debugging/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-observability-debugging/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-runtime-observability-debugging/tasks.md:1)

## 实施内容

1. 新增 [runtimeObservability.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/runtimeObservability.ts:1)，定义：
   - `RuntimeEventType`
   - `RuntimeEventRecord`
   - `RuntimeEventMap`
   - `appendRuntimeEvent(...)`
2. 新增 [RuntimeDebugPanel.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/RuntimeDebugPanel.tsx:1)，提供默认折叠的调试视图
3. 在 [index.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/index.tsx:1) 中补齐：
   - 聊天请求事件
   - execution message 同步事件
   - runtime stream batch / patch apply 事件
   - execution control request / result 事件
4. 新增测试：
   - [runtimeObservability.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/runtimeObservability.test.ts:1)
   - [RuntimeDebugPanel.test.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/RuntimeDebugPanel.test.tsx:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 结果：通过，`17` 个 suite、`87` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. 当前会话的 request / stream / control / patch 链路已经可以在页面内观察
2. 调试视图默认折叠，不污染主对话流
3. 后续如果继续扩展 correlation id、远端日志上传或筛选能力，可以直接建立在本轮 event model 上
