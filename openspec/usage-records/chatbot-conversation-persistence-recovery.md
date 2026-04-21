# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-conversation-persistence-recovery`
- 使用场景：在执行态运行时流和执行控制能力完成后，继续补齐聊天页本地会话快照、恢复与长任务工作现场保留
- 使用流程：`propose -> apply-change`

## 本次规划结论

聊天页现在已经能展示、更新和控制执行态消息，但刷新页面仍会丢失会话现场。本轮优先补本地工作区快照，而不是直接上服务端存档接口，目标是让用户刷新后还能回到上一次工作上下文，并让运行中的执行态继续显示和更新。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-conversation-persistence-recovery/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-conversation-persistence-recovery/design.md:1)
- [chatbot-conversation-persistence-recovery spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-conversation-persistence-recovery/specs/chatbot-conversation-persistence-recovery/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-conversation-persistence-recovery/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-conversation-persistence-recovery/tasks.md:1)

## 实施内容

1. 新增 [chatPersistence.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/chatPersistence.ts:1)，提供：
   - `CHATBOT_WORKSPACE_STORAGE_KEY`
   - `loadChatbotWorkspaceSnapshot(...)`
   - `saveChatbotWorkspaceSnapshot(...)`
   - 本地快照 schema 与容错守卫
2. 在 [useLocalStructuredMessages.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/components/schema/useLocalStructuredMessages.ts:1) 中新增：
   - `initialMessageMap`
   - `messageMap`
3. 在 [index.tsx](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/index.tsx:1) 中新增：
   - 初始化读取本地会话快照
   - 本地 `chatMessageMap` 持久化与恢复
   - 会话列表、活跃会话、bootstrapped 标记、结构化消息和 mock 配置的统一保存
   - 删除会话时同步移除本地聊天快照
4. 新增 [chatPersistence.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/chatPersistence.test.ts:1) 验证快照存取和无效数据回退

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 结果：通过，`15` 个 suite、`84` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. 聊天页刷新后可以恢复上次的会话列表、当前会话、聊天消息快照和结构化消息
2. 运行中的 `agent-execution` 本地恢复后仍可继续显示，并接入现有 runtime stream 续跑逻辑
3. 本轮保持纯前端本地快照实现，没有引入新的服务端依赖
