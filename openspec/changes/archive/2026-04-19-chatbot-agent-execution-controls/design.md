## Context

当前 `agent-execution` 已具备消息协议、渲染组件、patch 更新能力，以及 remote runtime stream 接入能力，但执行态组件依然是只读状态。用户无法在任务卡片上发起“停止执行”“重试当前执行”“继续后续执行”等操作，只能等待远端状态推进。与此同时，聊天页已经有 `submitAction` 与 adapter 边界，因此新增执行控制时应尽量复用既有请求和本地更新能力，而不是引入另一套孤立的控制链。

## Goals / Non-Goals

**Goals:**
- 为 `agent-execution` 消息增加最小可用的控制动作协议
- 在执行态消息组件中展示控制按钮，并在点击后触发远端执行控制请求
- 控制动作触发后更新本地执行态消息，至少覆盖 loading、成功和失败反馈
- 提供本地 mock 接口，保证 remote 模式下本地联调可执行

**Non-Goals:**
- 不新增新的消息类型
- 不实现完整权限体系或确认弹窗编排
- 不把所有执行步骤都变成独立可点击操作，首轮只支持消息级控制
- 不改造现有 `submitAction` 语义，只在协议边界上尽量复用现有模式

## Decisions

### 1. 控制动作挂在 `agent-execution` 内容协议中，而不是做页面外控制条

控制入口直接跟随执行态消息渲染，用户在查看执行进度时即可发起操作，避免把执行控制散落到聊天页其他区域。协议层新增 `controls` 字段，每个 control 声明动作类型、文案和可用条件。

备选方案：
- 页面顶部全局控制区：与具体执行消息脱离，长会话下易混淆目标

### 2. 远端控制请求单独走 execution control adapter，而不是挤进 submitAction API

`submitAction` 更偏向结构化消息内部动作编排，而执行控制属于 agent runtime 的独立边界。首轮在 `service.ts` 中新增 execution control endpoint 和请求方法，避免把运行时控制与表单动作混在一个 API 里。

备选方案：
- 复用 `/api/chatbot/submit-action`：实现快，但语义混乱，后续不利于扩展暂停/恢复等运行时控制

### 3. 控制成功后优先做本地即时反馈，再等待后续 runtime stream 收敛状态

用户点击控制按钮后，前端会立即更新本地执行态消息，例如设置 summary 或局部 loading 状态，减少“点了没反应”的感知。最终状态仍以后续 runtime stream 推送为准。

备选方案：
- 完全等待远端 stream 回写：实现简单，但交互迟滞明显

## Risks / Trade-offs

- [控制请求与 runtime stream 状态可能短暂不一致] → 本地只做轻量即时反馈，最终仍以后续 patch 收敛
- [控制协议过早扩张] → 首轮只支持消息级 stop / retry / continue 三类动作
- [控制按钮状态管理复杂] → 用消息级 pending action key 限制并发点击
