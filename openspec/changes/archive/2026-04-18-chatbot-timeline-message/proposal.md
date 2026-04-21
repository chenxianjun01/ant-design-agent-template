## Why

智能体界面已经具备文本、表格、图表、表单四类消息，但在流程型信息展示上仍然空缺。时间轴消息可以覆盖“执行进展、阶段状态、事件回放”这类高频场景，而且比审批卡片更适合当前架构做增量落地。

## What Changes

- 为聊天结构化消息协议新增 `timeline` 类型
- 新增 `TimelineMessage` 渲染组件
- 为本地 mock provider 增加时间轴样例
- 为消息分发和 mock 契约增加时间轴类型覆盖

## Capabilities

### New Capabilities

- `chatbot-timeline-message`: 智能体界面的时间轴消息类型与渲染能力

### Modified Capabilities

- `chatbot-agent-ui`: 中央消息分发器和本地 mock provider 新增时间轴消息支持

## Impact

- 受影响代码包括 `src/pages/chatbot/data.ts`、`service.ts`、`components/MessageRenderer.tsx`、`components/messages/*`
- 不引入新依赖，沿用 antd 现有组件能力
- 需要同步补充测试与开发记录
