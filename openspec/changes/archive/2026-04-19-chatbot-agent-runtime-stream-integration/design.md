## Context

当前聊天页存在两条结构化消息进入路径：一条来自 `useXChat` 的远端 assistant 响应，一条来自本地 `structuredMessages` store。`agent-execution` 的 patch/update 能力只接在本地 store 上，因此远端直接返回的结构化执行态消息虽然能渲染，但无法继续被 patch 更新。与此同时，用户已经明确要求页面保持纯对话交互，不再通过演示卡片暴露执行态能力，所以本轮接入必须围绕真实对话消息完成。

## Goals / Non-Goals

**Goals:**
- 在 remote 模式下，当 assistant 返回 `agent-execution` 结构化消息时，将其同步到本地可更新 store
- 为该消息接入运行时事件流消费能力，并按消息 id 增量更新
- 提供本地 mock runtime stream 接口，保证开发联调链路可复现
- 保持当前聊天页交互方式和现有消息协议兼容

**Non-Goals:**
- 不在页面空态或工具栏新增演示入口
- 不实现中断、重试、继续等运行控制按钮
- 不引入新的消息类型或重做消息渲染体系
- 不要求后端立即支持 SSE；首轮允许以有序 patch 拉取模拟运行时流

## Decisions

### 1. 运行时流首轮采用“批量 patch 拉取接口”，而不是直接引入 SSE

`@umijs/max` 的 `request` 已在项目中稳定使用，首轮继续沿用统一请求层，降低接入和测试复杂度。本轮新增一个 runtime stream adapter，按 execution/message 标识请求 patch 列表，并在前端串行消费。这样既能满足“持续更新执行态”的真实能力，也能为后续升级到 SSE/WebSocket 保留协议层。

备选方案：
- 直接接 SSE：更接近最终形态，但当前项目还没有现成消费基线，测试成本更高
- 仅做本地定时器模拟：无法形成远端联调边界，不满足本轮目标

### 2. 远端 `agent-execution` 消息进入本地 store，作为唯一可更新副本

执行态消息一旦需要 runtime patch，就不能继续只停留在 `parsedMessages` 渲染链里。为避免“同一条消息分别在 parsedMessages 和 structuredMessages 中各渲染一份”，聊天页会在识别到远端完成态 assistant 结构化消息后，将 `agent-execution` 消息写入本地 store，并在 bubble 构建阶段跳过已同步到本地 store 的同 id 远端结构化卡片。

备选方案：
- 直接 patch `parsedMessages`：受第三方 hook 输出结构约束，不适合作为本地状态源
- 所有结构化消息都强制同步到本地 store：范围过大，当前只针对需要更新的执行态消息

### 3. 运行时流消费生命周期跟随会话和消息状态

前端只在 remote 模式、且消息状态为 `running` 时启动事件流消费；当会话切换、组件卸载、消息进入终态或新流覆盖旧流时，主动停止后续 patch 拉取，避免旧会话流继续写入当前页面状态。

备选方案：
- 全局常驻轮询：实现简单，但会造成资源浪费和会话串写风险

## Risks / Trade-offs

- [运行时接口首轮不是 SSE] → 通过 adapter 隔离请求实现，后续可无痛替换底层 transport
- [远端与本地双轨消息容易重复渲染] → 以 message id 去重，并仅同步 `agent-execution`
- [乱序或重复 patch 可能导致状态抖动] → mock 接口按顺序返回，前端按收到顺序串行应用；协议中保留 patch 列表边界
- [长轮询清理不及时会写脏状态] → 在 effect cleanup 和会话切换时终止消费
