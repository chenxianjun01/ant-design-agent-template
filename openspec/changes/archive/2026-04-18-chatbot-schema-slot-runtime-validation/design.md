## Context

当前 `SchemaSlot` 的关键逻辑包括：

- `schemaFieldRender` 外部覆盖优先
- 非 `form` 消息直接返回 `null`
- 非可渲染 schema 给出降级提示
- 对可渲染 form schema 走 Formily 默认渲染，并桥接回 `onFormSubmit`

这些行为决定了 `SchemaSlot` 是否真正可作为后续 schema 能力扩展的稳定入口。

## Goals / Non-Goals

**Goals:**

- 覆盖 `SchemaSlot` 最重要的运行时行为
- 尽量使用真实组件渲染而不是纯 mock
- 验证提交流程确实把值传回既有 submit-action 入口

**Non-Goals:**

- 本轮不做复杂 Formily 字段联动测试
- 本轮不做 table/chart schema 运行时测试
- 本轮不做整页联调或浏览器级 e2e

## Decisions

### 1. 使用单个聚焦组件测试文件承接 SchemaSlot 运行时断面

原因：`SchemaSlot` 的价值在于入口行为稳定，测试按组件集中维护更清晰。

### 2. 优先测试真实 form submit 桥接，而不是内部 helper 细节

原因：对外最重要的不是内部 `prepareFormilySchema` 怎么写，而是用户提交后 `onFormSubmit` 是否收到正确值。

## Risks / Trade-offs

- [风险] Formily + antd 在 Jest 环境下渲染差异可能导致测试脆弱
  → 只覆盖最核心的交互路径，避免绑定过多内部 DOM 细节

- [风险] 运行时测试通过不代表 antd6 与 Formily v5 peer 差异已完全消除
  → 继续把运行时兼容性保留为已知观察项
