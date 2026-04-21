# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-approval-message`
- 使用流程：`propose -> apply-change`
- 目标：为智能体界面新增审批卡片消息类型

## 本次规划结论

本轮将审批卡片定义为“展示型结构化消息”，优先解决审批摘要、申请单据和待处理信息的可读性问题，不在卡片内部引入动作按钮和复杂回执协议。

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/data.ts:1) 中新增：
   - `MessageType.APPROVAL`
   - `IApprovalMessageField`
   - `IApprovalMessageContent`
   - `approval` 类型合法性校验
2. 新增 [ApprovalMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ApprovalMessage.tsx:1)
3. 在 [MessageRenderer.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.tsx:1) 中注册 `approval`
4. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1) 中新增 approval mock 样例
5. 扩展测试：
   - [MessageRenderer.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.test.tsx:1)
   - [ApprovalMessage.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ApprovalMessage.test.tsx:1)
   - [service.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.test.ts:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 7 个 test suite
- 29 个 test case
- 全部通过
