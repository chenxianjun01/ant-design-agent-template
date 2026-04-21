## Context

`agent-execution` 已能以结构化消息渲染执行状态，但本地结构化消息存储当前只有 append / clear / remove，没有 update。同一执行过程如果要展示步骤状态推进，只能连续插入多张卡片，这与真实 agent 运行态的“同一次执行不断更新”不一致。

## Goals / Non-Goals

**Goals:**
- 给 `agent-execution` 增加最小 patch/update 协议。
- 让本地结构化消息存储支持按 `message.id` 更新既有消息。
- 在聊天页提供一个可见的本地运行态演示入口。

**Non-Goals:**
- 不实现远端推送或后端事件流。
- 不处理任意消息类型的通用 patch 语义。
- 不加入步骤级交互控制按钮。

## Decisions

### 1. 只为 `agent-execution` 定义专用 patch 协议

本轮不做全消息类型通用 patch。`agent-execution` 是最明确需要增量更新的类型，先定义专用 patch 能把协议边界收清楚，也避免过早抽象。

### 2. store 层提供“按 id 更新”能力

渲染链和页面已经基于 `IMessageItem[]` 工作，因此最小变更点是在 `structuredMessageStore` 中提供按 `message.id` 查找并替换更新后的消息，页面层只负责触发 demo。

### 3. demo 采用本地定时 patch，而不是 mock provider 流式回包

当前本地 mock provider 更适合生成一次性 payload。增量更新演示直接在页面本地调 store patch 更简单，也更接近未来接远端事件流时的落点。

## Risks / Trade-offs

- [patch 协议过窄] → 先覆盖整体状态、摘要、步骤替换/追加/更新，足够支撑首轮 runtime demo。
- [页面内定时 demo 容易残留副作用] → 用 `useRef` 保存 timer，并在切会话/卸载时清理。
- [只支持 agent-execution 更新] → 明确这是本轮设计边界，后续若其他消息类型也需要 patch 再单独抽象。
