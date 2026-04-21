# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-timeline-message`
- 使用流程：`propose -> apply-change`
- 目标：为智能体界面新增时间轴消息类型

## 本次规划结论

本轮优先实现“时间轴消息”而不是“审批卡片”，原因是时间轴更适合当前结构化消息协议的增量扩展方式，只需要补齐协议、渲染、mock 和测试四层闭环。

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/data.ts:1) 中新增：
   - `MessageType.TIMELINE`
   - `ITimelineMessageItem`
   - `ITimelineMessageContent`
   - `timeline` 类型合法性校验
2. 新增 [TimelineMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/TimelineMessage.tsx:1)
3. 在 [MessageRenderer.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.tsx:1) 中注册 `timeline`
4. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1) 中新增 timeline mock 样例
5. 扩展测试：
   - [MessageRenderer.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.test.tsx:1)
   - [TimelineMessage.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/TimelineMessage.test.tsx:1)
   - [service.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.test.ts:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 6 个 test suite
- 26 个 test case
- 全部通过
