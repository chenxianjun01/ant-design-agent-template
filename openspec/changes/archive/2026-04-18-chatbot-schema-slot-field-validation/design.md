## Context

当前 `SchemaSlot` 已覆盖：

- override 优先级
- 非 form 安全返回
- 非法 schema 降级提示
- 基础 form submit 桥接

但仍未明确验证：

- `Select`
- `Switch`
- `InputNumber`
- `DatePicker`
- `TextArea`

这些字段是否在 Formily 默认运行时里稳定映射，以及一些边界 schema 输入是否安全处理。

## Goals / Non-Goals

**Goals:**

- 覆盖更多当前已经声明支持的字段类型
- 覆盖异常输入下的安全降级
- 保持测试稳定，不绑定过多第三方组件内部 DOM

**Non-Goals:**

- 本轮不做复杂联动逻辑测试
- 本轮不做 table/chart 的 schema runtime 测试
- 本轮不测样式细节

## Decisions

### 1. 优先测试“是否能稳定渲染 / 提交”，而不是每个组件的完整交互行为

原因：`SchemaSlot` 的主要职责是正确接住 schema 并桥接提交流程，测试应优先覆盖入口稳定性。

### 2. 异常输入只验证安全性，不强求渲染结果细节

原因：对异常 schema 更重要的是“不崩”和“有明确降级”，而不是内部如何组织警告文案。

## Risks / Trade-offs

- [风险] 某些 antd / Formily 组件在 Jest 中交互不稳定
  → 优先用可观测的表单值和按钮提交行为断言，不深入第三方组件内部细节

- [风险] 覆盖字段类型增加后测试维护成本上升
  → 只覆盖当前代码里已明确支持的字段类型，不做超前测试
