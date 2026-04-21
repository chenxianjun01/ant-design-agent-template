## Why

`src/pages/chatbot` 已经具备结构化消息渲染和表单动作编排能力，但消息对象仍散落在 `index.tsx`、`service.ts`、`useLocalStructuredMessages.ts` 和 `formSubmitAction.ts` 中手工拼装。继续扩展消息类型或模板能力前，需要先把消息构造与规范化入口收口，否则同一协议会在不同链路里逐步漂移。

## What Changes

- 新增统一的消息工厂与模板解析入口，用于创建、补全和规范化结构化消息对象
- 将聊天页解析、本地插卡、submitAction 插卡和 mock 数据生成迁移到统一 builder
- 补充消息规范化与模板替换的稳定约束，避免不同入口产生不一致消息形态
- 增加与消息工厂相关的开发记录和 OpenSpec 使用留痕

## Capabilities

### New Capabilities

- `chatbot-message-builder`: 统一智能体界面的结构化消息创建、规范化与模板插值能力

### Modified Capabilities

- `chatbot-agent-ui`: 聊天页面与表单动作链路改为依赖统一消息工厂，而不是在多个模块里手写消息对象

## Impact

- 受影响代码集中在 `src/pages/chatbot/data.ts`、`index.tsx`、`service.ts` 和 `components/schema/*`
- 不引入新依赖，不改变既有消息协议字段
- 需要同步更新开发记录与 OpenSpec 使用记录，保证这轮规划有可追踪留痕
