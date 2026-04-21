## Why

`SchemaSlot` 已有基础运行时测试，但字段类型映射和异常 schema 输入仍缺少更细粒度验证。随着 Formily 入口成为真实渲染路径，这部分不补齐会直接影响后续字段扩展和 schema 演进的安全性。

## What Changes

- 为 `SchemaSlot` 增加更多字段类型的运行时渲染测试
- 补充异常 / 边界 schema 输入的安全性测试
- 将本轮结果纳入开发记录和 OpenSpec 使用记录

## Capabilities

### New Capabilities

- `chatbot-schema-slot-field-tests`: SchemaSlot 字段映射与异常输入测试基线

### Modified Capabilities

- `chatbot-agent-ui`: 为 SchemaSlot 的字段覆盖范围和异常输入降级提供更完整的运行时回归保护

## Impact

- 受影响区域主要是 `src/pages/chatbot/components/schema/SchemaSlot.test.tsx`
- 不改变业务逻辑，仅新增测试覆盖与记录
- 验证仍使用聊天模块 Jest 和项目级 `tsc`
