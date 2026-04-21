# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-approval-action-protocol`
- 使用流程：`propose -> apply-change`
- 目标：为审批卡片补齐动作按钮与共享 submitAction 执行能力

## 本次规划结论

本轮没有为审批卡片重新设计独立动作执行器，而是直接复用已有 `submitAction` 引擎，让审批卡片按钮通过注入 `content.submitAction` 的方式走同一条副作用编排链路。

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/data.ts:1) 中新增：
   - `IApprovalMessageAction`
   - `approval.actions`
2. 在 [ApprovalMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ApprovalMessage.tsx:1) 中新增：
   - 审批动作按钮渲染
   - loading / 错误 / retryable 反馈
   - 审批字段到模板变量的上下文构建
3. 在 [formSubmitAction.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/formSubmitAction.ts:1) 中放宽执行条件，使共享引擎可兼容非 `form` 消息
4. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1) 中为 approval mock 增加动作按钮样例
5. 扩展测试：
   - [ApprovalMessage.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ApprovalMessage.test.tsx:1)
   - [formSubmitAction.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/formSubmitAction.test.ts:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 7 个 test suite
- 31 个 test case
- 全部通过
