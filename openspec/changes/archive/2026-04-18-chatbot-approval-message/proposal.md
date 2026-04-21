## Why

时间轴消息已经补齐了流程进展展示，但智能体界面仍缺少一种更适合“审批单 / 申请单 / 工单确认”场景的摘要卡片。审批卡片比表格更紧凑，也更贴近业务界面中的阅读习惯。

## What Changes

- 为聊天结构化消息协议新增 `approval` 类型
- 新增 `ApprovalMessage` 渲染组件
- 为本地 mock provider 增加审批卡片样例
- 为消息分发和 mock 契约增加审批卡片类型覆盖

## Capabilities

### New Capabilities

- `chatbot-approval-message`: 智能体界面的审批卡片消息类型与渲染能力

### Modified Capabilities

- `chatbot-agent-ui`: 中央消息分发器和本地 mock provider 新增审批卡片消息支持

## Impact

- 受影响代码包括 `src/pages/chatbot/data.ts`、`service.ts`、`components/MessageRenderer.tsx`、`components/messages/*`
- 不引入新依赖，沿用 antd 现有组件能力
- 需要同步补充测试、开发记录和 OpenSpec 使用记录
