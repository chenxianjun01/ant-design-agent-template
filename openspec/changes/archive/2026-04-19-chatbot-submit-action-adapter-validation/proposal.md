## Why

当前 `src/pages/chatbot` 已具备 `submitActionAdapter` 的 mock / remote 双通道实现，但现有回归测试主要覆盖消息协议和 submit-action 编排本身，尚未验证 adapter 在本地与远端模式下的选择、请求骨架和错误归一化行为。继续扩展智能体联调能力前，需要先把这层运行边界补成稳定测试基线。

## What Changes

- 为 `submitActionAdapter` 增加自动化回归测试，覆盖 mock 模式与 remote 模式的执行分流。
- 验证 remote `executeApiAction` 的请求骨架、结果归一化和异常兜底。
- 验证 remote `trackEvent` 的请求参数与失败吞掉策略，确保埋点失败不打断主流程。
- 仅补充测试入口与必要的小范围可测性导出，不改现有消息协议和 UI 交互。

## Capabilities

### New Capabilities

- `chatbot-submit-action-adapter-tests`: 定义 submit-action adapter 本地/远端运行回归测试基线。

### Modified Capabilities

- `chatbot-agent-ui`: 增加对 submitActionAdapter 运行回归基线的长期要求，覆盖 mock/remote 适配与错误处理。

## Impact

- 代码范围：`src/pages/chatbot/service.ts`、`src/pages/chatbot/service.test.ts`
- 行为范围：`submitActionAdapter.executeApiAction`、`submitActionAdapter.trackEvent`
- 运行边界：`/api/chatbot/submit-action`、`/api/chatbot/track-event`
