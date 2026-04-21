# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-schema-slot-field-validation`
- 使用流程：`propose -> apply-change`
- 目标：补齐 SchemaSlot 更多字段类型与异常输入测试

## 本次规划结论

本轮在 SchemaSlot 基础运行时测试之上，继续补齐当前代码里已经声明支持的字段类型映射和异常 schema 输入安全性。

重点覆盖：

1. `Select`
2. `Switch`
3. `InputNumber`
4. `DatePicker`
5. `TextArea`
6. malformed schema 输入

## 实施内容

已在 [SchemaSlot.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/SchemaSlot.test.tsx:1) 中新增：

1. 多字段 schema 的运行时渲染与提交流程测试
2. malformed schema 输入下的安全降级测试

当前新增验证结果包括：

1. 支持字段类型在默认 Formily runtime 下可渲染
2. 初始值可以进入运行时表单
3. 提交后仍能桥接到 `onFormSubmit`
4. 异常 schema 不会导致运行时崩溃

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 5 个 test suite
- 23 个 test case
- 全部通过
