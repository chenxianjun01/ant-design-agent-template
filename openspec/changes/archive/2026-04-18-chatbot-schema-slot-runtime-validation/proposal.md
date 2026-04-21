## Why

`SchemaSlot / Formily` 已经接入，但当前只有类型校验和外围测试，还缺少真正覆盖运行时行为的组件测试。继续扩展 schema 能力前，需要先验证它在聊天界面中的几个关键断面确实按预期工作。

## What Changes

- 为 `SchemaSlot / Formily` 增加聚焦运行时行为的组件测试
- 覆盖外部 renderer 优先级、非法 schema 降级、非 form 安全返回和提交桥接
- 将这批验证结果纳入开发记录和 OpenSpec 使用记录

## Capabilities

### New Capabilities

- `chatbot-schema-slot-runtime-tests`: SchemaSlot/Formily 运行时行为测试基线

### Modified Capabilities

- `chatbot-agent-ui`: 为 SchemaSlot 默认 schema 渲染和表单提交桥接补充运行时回归保护

## Impact

- 受影响区域主要是 `src/pages/chatbot/components/schema/SchemaSlot.test.tsx`
- 不改变业务协议，仅新增测试覆盖和记录
- 验证命令会继续复用聊天模块的定向 Jest 与项目级 `tsc`
