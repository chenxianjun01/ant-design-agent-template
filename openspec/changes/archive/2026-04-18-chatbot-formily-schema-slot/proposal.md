## Why

`SchemaSlot` 目前仍是占位提示，导致后端即使下发了动态 schema，聊天页面也无法通过统一入口完成真实渲染。继续扩展智能体界面前，需要先把 schema 渲染能力落到可运行状态，否则 schema 相关能力会长期停留在预留层。

## What Changes

- 接入 Formily 作为 `SchemaSlot` 的默认 schema 渲染实现
- 为聊天页表单消息建立 Formily 与现有 `onFormSubmit` 提交流程之间的桥接
- 保留 `schemaFieldRender` 自定义覆盖能力，并将默认渲染作为兜底
- 补充本轮接入的规划、实现记录和验证留痕

## Capabilities

### New Capabilities

- `chatbot-schema-slot-rendering`: 基于 Formily 的聊天消息 schema 渲染能力

### Modified Capabilities

- `chatbot-agent-ui`: `SchemaSlot` 从预留态升级为真实 schema 渲染入口，表单 schema 可直接在消息流中渲染并提交

## Impact

- 受影响文件包括 `package.json`、`src/pages/chatbot/components/schema/*`、`src/pages/chatbot/components/messages/FormMessage.tsx`
- 需要新增 Formily 依赖并完成类型与运行时接入
- 不改变当前消息协议主结构，也不移除现有 antd 动态表单兜底路径
