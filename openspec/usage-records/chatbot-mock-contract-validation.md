# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-mock-contract-validation`
- 使用流程：`propose -> apply-change`
- 目标：为本地 mock payload 与共享消息协议建立自动化契约校验

## 本次规划结论

本轮聚焦 mock provider 与共享消息协议的一致性，不测整套 provider 时序，而是直接验证 mock 输出是否能被统一消息协议正常消费。

选择覆盖：

1. `text` 模式保持流式文本
2. `table / chart / form` 三类结构化 payload 可被 `normalizeStructuredMessage` 正常收敛

## 实施内容

1. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1) 中新增窄测试入口：
   - `chatbotMockPayloadFactory.createAssistantPayload(...)`
2. 新增 [service.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.test.ts:1)
   - 校验 `text` mock 仍为 `stream` 且不是结构化消息
   - 校验 `table / chart / form` mock payload 可被共享协议层成功规范化

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 5 个 test suite
- 21 个 test case
- 全部通过
