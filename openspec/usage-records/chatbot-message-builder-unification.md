# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-message-builder-unification`
- 使用场景：基于《智能体界面开发记录》继续完善 `src/pages/chatbot`
- 使用流程：`propose -> apply-change`

## 本次规划结论

本轮没有继续直接扩展新消息类型，而是先收口已有结构化消息协议的创建和规范化入口。原因是消息对象此前散落在聊天页解析、本地插卡、mock 生成和 submitAction 链路中手工拼装，继续叠加新能力会放大协议漂移风险。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-message-builder-unification/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-message-builder-unification/design.md:1)
- [chatbot-message-builder spec](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-message-builder-unification/specs/chatbot-message-builder/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-message-builder-unification/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-message-builder-unification/tasks.md:1)

## 实施内容

1. 在 `src/pages/chatbot/data.ts` 中新增共享消息工厂能力：
   - `createMessageItem`
   - `resolveMessageTemplate`
   - `stringifyStructuredMessage`
   - `normalizeStructuredMessage`
2. 将 `index.tsx` 的 assistant 结构化 JSON 解析改为复用共享规范化入口。
3. 将 `useLocalStructuredMessages.ts` 的本地插卡逻辑改为复用共享消息工厂和模板解析。
4. 将 `service.ts` 的 table / chart / form mock 结构化消息生成改为复用共享 builder，而不是各处手工拼接带 `id` 的 JSON。

## 验证记录

- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 后续建议

1. 下一轮可以继续把 builder 产出的消息用于更多消息类型扩展，例如审批卡片或时间轴卡片。
2. 若后续引入 Formily，可继续沿用同一消息工厂，不需要再改消息协议入口。
