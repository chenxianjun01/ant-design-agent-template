# Proposal

## Background

`src/pages/chatbot` 已经完成结构化消息渲染与基础表单提交，但今天的开发将表单提交链路进一步扩展为可编排的副作用执行系统。该变化已经涉及消息协议、hook 执行、会话状态刷新、远端接口约定和本地联调方式，需要形成可追踪的正式变更记录。

## Goals

1. 将 `submitAction` 从简单的 `request / insertMessage` 扩展为可执行异步 API、副作用 hook 和远端 adapter 的稳定链路。
2. 为后续需求建立标准化的 `openspec` 使用基线。
3. 明确 `submit-action` 与 `track-event` 的前后端联调协议。

## Non-goals

1. 本次不引入真实埋点 SDK。
2. 本次不接入真实后端业务 API 实现。
3. 本次不重构聊天主页面为多组件容器结构。

## Scope

本次范围包含：

1. `submitAction.callApi`
2. `beforeRequest / afterSuccess` hook
3. `trackEvent / refreshConversation` 动作
4. `submitActionAdapter`
5. remote adapter 请求骨架
6. 本地 `_mock.ts` 联调接口
7. 协议文档

## Impacted Files

1. `src/pages/chatbot/data.ts`
2. `src/pages/chatbot/index.tsx`
3. `src/pages/chatbot/service.ts`
4. `src/pages/chatbot/components/messages/FormMessage.tsx`
5. `src/pages/chatbot/components/schema/formSubmitAction.ts`
6. `src/pages/chatbot/components/schema/useLocalStructuredMessages.ts`
7. `src/pages/chatbot/_mock.ts`
8. `src/pages/chatbot/submit-action-contract.md`

## Risks

1. remote adapter 与真实后端返回结构不一致时，可能导致错误状态映射失效。
2. hook 动作继续扩展后，如果没有共享类型约束，复杂度会快速上升。
3. 目前 `trackEvent` 仍以 mock / request 骨架为主，缺少正式埋点通道验证。

## Acceptance Criteria

1. 表单提交支持异步 `callApi`。
2. 表单提交时具备 loading、错误提示和重试反馈。
3. `callApi` 支持前后置 hook。
4. hook 支持 `insertMessage`、`request`、`clearStructuredMessages`、`trackEvent`、`refreshConversation`。
5. 提供统一 `submitActionAdapter` 注入点。
6. 提供本地 remote 联调接口。
7. 提供接口协议文档。
