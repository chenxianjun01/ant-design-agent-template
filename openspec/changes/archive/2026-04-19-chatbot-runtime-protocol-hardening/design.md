## Context

当前 runtime 协议事实上已经存在，但分散在多个实现点：`IAgentExecutionMessagePatch` 定义了 patch 结构，`fetchRemoteAgentRuntimeStreamBatch(...)` 约定了 stream 批次，`executeRemoteAgentExecutionControl(...)` 约定了 control 响应，`_mock.ts` 则给出了一套本地示例。问题在于这些定义主要服务于前端实现，并没有形成一份稳定的、后端可直接对照的 protocol contract。

## Goals / Non-Goals

**Goals:**
- 给 runtime stream / execution control / patch 结构产出正式 contract
- 在 contract 中明确消息标识、cursor、完成态、错误态和 patch 合并边界
- 让现有前端类型和文档术语一致，降低联调沟通成本

**Non-Goals:**
- 不引入新的 transport 机制
- 不改变现有 UI 交互
- 不重构 runtime patch 合并算法

## Decisions

### 1. 使用独立 runtime contract 文档，而不是继续往 submit-action contract 里堆内容

`submit-action` 与 runtime stream/control 已经是两套不同边界。继续把执行态协议写进 submit-action 文档会让 contract 继续混杂。独立 contract 文档更适合作为后续 SSE/WebSocket 升级的协议基线。

### 2. 协议围绕三个核心对象组织：patch、stream batch、control result

前端当前实现也正围绕这三个对象工作。正式文档里直接固化：
- `IAgentExecutionMessagePatch`
- `AgentRuntimeStreamBatch`
- `AgentExecutionControlResult`

### 3. 明确“本地即时反馈 + 后续 stream 收敛”的一致性原则

执行控制请求成功后，前端会立刻应用轻量 patch，但最终状态以后续 runtime stream 收敛为准。这个规则必须写进协议说明，否则后端可能误解为 control 响应本身就是最终状态。

## Risks / Trade-offs

- [文档与代码未来漂移] → 将 contract 文档直接引用现有代码类型和默认 endpoint
- [首轮协议过于绑定 HTTP 轮询] → 文档强调对象结构与语义，transport 仅说明当前默认实现
