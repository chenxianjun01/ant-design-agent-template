## Context

当前 `SchemaSlot` 只做两件事：

- 有 `schemaFieldRender` 时，交由外部自定义渲染
- 没有时，显示“已预留 SchemaField 入口”的提示

这意味着 schema 入口在架构上已经存在，但没有默认实现。现有 `FormMessage` 仍依赖自写的 antd 动态表单逻辑，这套逻辑适合做兜底，但不能替代正式的 schema 渲染层。

## Goals / Non-Goals

**Goals:**

- 为 `SchemaSlot` 接入可运行的 Formily 默认渲染能力
- 让 form 类型消息在有合法 schema 时可直接经由 `SchemaSlot` 渲染和提交
- 保持 `schemaFieldRender` 的外部覆盖能力
- 保留现有 antd 动态表单兜底，避免接入期把表单能力绑死在单一路径上

**Non-Goals:**

- 本次不扩展新的消息类型
- 本次不将 table/chart 完全改写为 Formily schema 驱动
- 本次不重构 submitAction 执行器

## Decisions

### 1. 使用 Formily 的 schema 组件体系，而不是继续扩展自写字段映射

原因：`SchemaSlot` 的目的就是承接后端动态 schema。继续扩展 `renderFieldNode` 只能不断增加手写映射复杂度，无法形成真正的 schema 渲染入口。

替代方案：

- 继续增强现有 antd 动态表单渲染。优点是依赖少；缺点是和“SchemaSlot 入口”目标不一致，后续仍然要再迁一次。

### 2. 默认渲染只优先承接 form schema，table/chart 继续维持现状

原因：当前最明确的业务价值在 form 提交链路。table 和 chart 已有稳定渲染实现，强行统一到 Formily 只会增加复杂度。

### 3. `SchemaSlot` 保留自定义覆盖优先级

顺序为：

1. `schemaFieldRender`
2. Formily 默认渲染
3. 兼容兜底提示 / 空状态

原因：这能保证未来如果业务侧要注入自定义 schema renderer，不需要拆掉默认实现。

## Risks / Trade-offs

- [风险] 新增依赖后 schema 与 antd 版本兼容性可能存在边界问题
  → 先以最小范围接入 `form` 场景，保持 table/chart 不受影响

- [风险] Formily 渲染的提交值格式可能与现有执行器预期不完全一致
  → 在 `SchemaSlot` 的 form 提交桥接层统一序列化，再进入 `onFormSubmit`

- [风险] 后端 schema 若不符合 Formily 结构，仍可能无法直接渲染
  → 保留现有 antd 动态表单兜底路径，并在 `SchemaSlot` 中给出明确降级
