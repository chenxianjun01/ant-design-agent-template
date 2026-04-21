# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-schema-slot-runtime-validation`
- 使用流程：`propose -> apply-change`
- 目标：补齐 `SchemaSlot / Formily` 的运行时回归测试

## 本次规划结论

本轮聚焦 `SchemaSlot` 的 4 个关键运行时断面：

1. `schemaFieldRender` 外部 override 优先级
2. 非 `form` 消息安全返回
3. 非法 schema 的降级提示
4. Formily 默认渲染后的提交桥接

这几项覆盖了当前 `SchemaSlot` 作为真实 schema 入口时最关键的运行时风险。

## 实施内容

1. 新增 [SchemaSlot.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/SchemaSlot.test.tsx:1)
2. 覆盖以下行为：
   - 外部 renderer 覆盖默认运行时
   - 非 form 消息不渲染默认 schema runtime
   - 不可渲染 schema 显示安全降级提示
   - 支持的 form schema 经 Formily 渲染后可提交，并把值回传给 `onFormSubmit`

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试结果已扩展为：

- 4 个 test suite
- 14 个 test case
- 全部通过
