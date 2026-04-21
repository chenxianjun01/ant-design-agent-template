# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-formily-schema-slot`
- 使用流程：`propose -> apply-change`
- 目标：将 `SchemaSlot` 从占位入口升级为真实的 Formily schema 渲染入口

## 本次规划结论

本轮不尝试把 table / chart 一并改造成 Formily 驱动，而是先把最有业务价值的 `form` 消息接入 `SchemaSlot` 默认渲染。这样可以在保留现有表格、图表稳定实现的前提下，把动态表单 schema 正式跑通。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-formily-schema-slot/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-formily-schema-slot/design.md:1)
- [chatbot-schema-slot-rendering spec](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-formily-schema-slot/specs/chatbot-schema-slot-rendering/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-formily-schema-slot/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-formily-schema-slot/tasks.md:1)

## 实施内容

1. 新增 Formily 依赖：
   - `@formily/core`
   - `@formily/react`
   - `@formily/antd-v5`
2. 在 [SchemaSlot.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/SchemaSlot.tsx:1) 中落地默认 Formily 渲染：
   - 外部 `schemaFieldRender` 仍优先
   - 默认渲染仅接管 `form` 消息
   - 不支持的 schema 保持安全降级
3. 在 [formValue.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/formValue.ts:1) 中抽离初始值归一化与表单提交序列化逻辑，供 antd 表单和 Formily 表单共用。
4. 在 [FormMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/FormMessage.tsx:1) 中改为优先走 `SchemaSlot`，保留原 antd 动态表单兜底。
5. 为适配 TypeScript 6 工程校验，将 [tsconfig.json](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/tsconfig.json:1) 的 `declaration` 关闭，恢复项目级 `tsc` 可用性。

## 风险记录

当前 `@formily/antd-v5` 的 peer 依赖声明是 `antd@^5.13.0`，而仓库当前使用 `antd@6`。本轮已通过类型校验，但运行时兼容性仍需在页面联调中继续观察。

## 验证记录

- 已执行：`pnpm exec max setup`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过
