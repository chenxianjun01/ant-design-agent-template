# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-rich-message-coverage`
- 使用流程：`propose -> apply-change`
- 目标：补齐文件、图片、音频、地图消息，并明确核心消息类型覆盖面

## 本次规划结论

当前 `text / table / form / chart` 已属于既有能力，本轮不重复实现。实际补齐的缺口是 `file / image / audio / map`，其中地图按用户要求使用 `openlayers`。

## 实施内容

1. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/data.ts:1) 中新增：
   - `MessageType.FILE`
   - `MessageType.IMAGE`
   - `MessageType.AUDIO`
   - `MessageType.MAP`
   - 对应内容协议与合法性校验
2. 新增消息组件：
   - [FileMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/FileMessage.tsx:1)
   - [ImageMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/ImageMessage.tsx:1)
   - [AudioMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/AudioMessage.tsx:1)
   - [MapMessage.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/MapMessage.tsx:1)
3. 在 [MessageRenderer.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.tsx:1) 中注册四类新消息
4. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1) 中新增四类 mock payload
5. 新增 `openlayers` 依赖：`ol`
6. 扩展测试：
   - [MessageRenderer.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.test.tsx:1)
   - [RichMediaMessage.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/messages/RichMediaMessage.test.tsx:1)
   - [service.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.test.ts:1)

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 8 个 test suite
- 43 个 test case
- 全部通过
