## Why

智能体界面主链路已经基本可用，但工程质量层仍然明显滞后，尤其是 `MessageRenderer`、`schema adapter` 和 `formSubmitAction` 这些核心模块缺少直接测试。继续扩展消息类型和模板系统之前，需要先补一批高价值测试，降低后续重构风险。

## What Changes

- 为智能体界面新增第一批单元测试与轻量交互测试
- 优先覆盖 `MessageRenderer`、`schema adapter`、`formSubmitAction`
- 明确当前测试基线和后续可扩展的测试入口

## Capabilities

### New Capabilities

- `chatbot-quality-tests`: 智能体界面核心模块的自动化测试覆盖能力

### Modified Capabilities

- `chatbot-agent-ui`: 为核心消息分发、schema 解析和 submitAction 执行链路补充可回归验证的测试保障

## Impact

- 受影响区域以 `src/pages/chatbot/components/**` 测试文件为主
- 不改变现有业务协议，仅新增测试与必要的测试支撑
- 验证方式将增加 Jest 针对聊天模块的定向执行
