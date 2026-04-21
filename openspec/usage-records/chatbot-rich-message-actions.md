# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-rich-message-actions`
- 使用流程：`propose -> apply-change`
- 目标：为 file / image / audio / map 补齐动作能力

## 本次规划结论

本轮没有为富媒体消息单独设计新的动作执行器，而是把审批卡片的动作结构抽成通用 `IMessageAction`，并继续复用共享 `submitAction` 引擎。

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/data.ts:1) 中新增通用 `IMessageAction`
2. 为以下协议补充动作定义：
   - `IFileMessageItem.actions`
   - `IImageMessageItem.actions`
   - `IAudioMessageItem.actions`
   - `IMapMessageMarker.clickAction`
3. 新增共享动作执行 helper：
   - [useMessageActionExecution.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/useMessageActionExecution.tsx:1)
4. 在以下组件中接入动作能力：
   - [ApprovalMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ApprovalMessage.tsx:1)
   - [FileMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/FileMessage.tsx:1)
   - [ImageMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ImageMessage.tsx:1)
   - [AudioMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/AudioMessage.tsx:1)
   - [MapMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/MapMessage.tsx:1)
5. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1) 中新增富媒体动作 mock，包括文件下载回执、图片解读、音频摘要和地图点位详情

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线保持为：

- 8 个 test suite
- 43 个 test case
- 全部通过
