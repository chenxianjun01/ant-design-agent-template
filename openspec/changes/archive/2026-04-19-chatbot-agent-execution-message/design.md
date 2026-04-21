## Context

当前 `src/pages/chatbot` 已支持多种结构化消息，但这些类型更偏“结果展示”，还没有一种专门承载智能体运行时反馈的消息模型。开发记录中已经明确后续优先级应放在工具调用状态、多阶段轨迹和失败节点可见性，而不是继续堆更多静态消息类型。

## Goals / Non-Goals

**Goals:**
- 提供一个新的 `agent-execution` 消息类型，覆盖智能体执行中的步骤状态展示。
- 保持该类型可通过共享消息协议正常规范化、分发和本地 mock 生成。
- 让 UI 至少能表达 `running / success / error` 三种主状态，以及步骤级状态变化。
- 为后续接入真实 agent orchestration 回执保留稳定结构。

**Non-Goals:**
- 不在本轮引入真实后端执行流或 WebSocket 推送。
- 不实现步骤级重试、继续执行或中断控制按钮。
- 不重做聊天页整体布局或会话状态管理。

## Decisions

### 1. 新增独立消息类型，而不是复用 timeline

`timeline` 更适合静态流程回放；智能体执行态消息需要表达整体状态、当前运行步骤和失败节点，因此单独引入 `agent-execution` 更清晰，也能避免把运行中语义硬塞进 timeline 数据结构。

### 2. 协议采用“整体状态 + steps[]”结构

消息内容保持扁平：
- 顶层摘要：标题、说明、总体状态、开始/更新时间
- 步骤数组：每步的 key、标题、状态、描述、时间

这样既便于 mock，也方便未来映射真实 tool-call / workflow 节点。

### 3. 第一轮只做静态渲染与 mock 覆盖

本轮先让 `agent-execution` 能进入 shared rendering flow，并在本地 mock 下稳定演示；实时更新、增量 patch 和操作按钮等交互能力留到后续 change。

## Risks / Trade-offs

- [消息类型继续增加] → 复用现有 `MessageRenderer` 映射机制，避免页面分支膨胀。
- [协议过早锁死] → 第一轮只保留最小必要字段，复杂控制语义后续再扩。
- [视觉上与 timeline 相似] → 通过整体状态 header 和步骤状态标识，明确它是“执行态”而不是“历史回放”。
