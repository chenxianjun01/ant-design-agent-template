# Tasks

## Implementation

- [x] 1.1 抽离 `useLocalStructuredMessages`，统一管理本地结构化消息插卡。
- [x] 1.2 为 `submitAction` 增加 `callApi` 类型和执行逻辑。
- [x] 1.3 为 `FormMessage` 增加 loading、错误提示和重试反馈。
- [x] 1.4 引入 `FormSubmitExecutionResult`，统一提交结果返回值。
- [x] 1.5 为 `callApi` 增加 `beforeRequest / afterSuccess` hook。
- [x] 1.6 将 hook 执行层改造成 registry。
- [x] 1.7 落地 `trackEvent` 动作。
- [x] 1.8 落地 `refreshConversation` 动作。
- [x] 1.9 将 `executeApiAction / trackEvent` 收口到 `submitActionAdapter`。
- [x] 1.10 为 remote 模式补统一 request 骨架。
- [x] 1.11 提供 `src/pages/chatbot/_mock.ts` 本地联调接口。
- [x] 1.12 补充 `submit-action` / `track-event` 协议文档。

## Validation

- [x] 2.1 `pnpm exec tsc --noEmit`
- [x] 2.2 校验本地 mock 表单提交链路可走成功/失败分支
- [x] 2.3 校验 `trackEvent` 与 `refreshConversation` 已接入 hook registry
