## Why

审批卡片消息已经能展示摘要信息，但仍停留在只读态。对于“审批通过后通知相关成员”“让智能体继续生成处理建议”这类场景，用户还需要离开卡片再走额外操作，体验不完整。

## What Changes

- 为 `approval` 消息协议新增动作按钮定义
- 让审批卡片按钮复用现有 `submitAction` 执行链路
- 为本地 approval mock 增加可点击动作样例
- 为审批动作补充运行时测试和执行层测试

## Capabilities

### New Capabilities

- `chatbot-approval-action-protocol`: 审批卡片按钮及动作执行能力

### Modified Capabilities

- `chatbot-approval-message`: 审批卡片从只读摘要升级为可触发动作的消息类型
- `chatbot-agent-ui`: 既有 `submitAction` 执行引擎兼容非表单结构化消息

## Impact

- 受影响代码包括 `src/pages/chatbot/data.ts`、`components/messages/ApprovalMessage.tsx`、`components/schema/formSubmitAction.ts`、`service.ts`
- 不引入新依赖，沿用现有 `antd` 和 `submitAction` 执行层
- 需要同步补充测试、开发记录和 OpenSpec 使用记录
