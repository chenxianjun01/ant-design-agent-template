## Context

当前聊天界面的 `submitAction` 主要挂在 `form` 消息上，已经具备 `request / insertMessage / requestAndInsert / callApi` 及 hook 编排能力。审批卡片如果重新实现一套动作协议，会和既有执行链重复。

## Goals / Non-Goals

**Goals:**

- 让审批卡片支持按钮动作
- 复用现有 `submitAction` 执行链路和错误处理语义
- 保持 mock、测试和开发记录同步更新

**Non-Goals:**

- 本轮不做按钮级权限控制
- 本轮不引入确认弹窗或多步审批流
- 本轮不扩展到所有消息类型的通用交互协议

## Decisions

### 1. 审批卡片按钮直接挂载 `submitAction`

原因：动作协议已经在表单里跑通，审批卡片只需要声明按钮和对应动作，不必再定义第二套执行模型。

### 2. 执行引擎兼容“任意带 `content.submitAction` 的结构化消息”

原因：这样审批卡片可以通过注入当前按钮的 `submitAction` 复用既有逻辑，同时不破坏表单场景。

### 3. 审批卡片内部自管 loading / 错误 / retryable

原因：这与表单组件的交互模型一致，用户能明确看到按钮动作执行状态，也避免把 UI 反馈分散到页面层。

## Risks / Trade-offs

- [风险] `submitAction` 从表单扩到非表单消息后，命名会变得不完全准确
  → 当前先复用现有文件和语义，等后续更多消息类型接入时再考虑重命名为更通用的 action engine

- [风险] 审批卡片按钮上下文值来源不如表单天然明确
  → 通过审批字段、基础元数据和按钮自定义值合并成模板上下文，先保证模板可用性
