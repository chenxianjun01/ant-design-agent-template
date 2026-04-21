## Why

`formSubmitAction` 已有第一批核心路径测试，但 hook 组合、副作用顺序和若干非 `callApi` 分支仍缺少验证。由于这部分承担了聊天界面最复杂的编排职责，继续扩展之前需要把更容易回归的组合路径补上。

## What Changes

- 为 `formSubmitAction` 增加 hook 组合与边界分支测试
- 覆盖 `requestAndInsert`、默认请求分支、`afterSuccess` hook 组合和 `clearStructuredMessages / refreshConversation / request` 联动
- 将这批验证结果补入开发记录和 OpenSpec 使用记录

## Capabilities

### New Capabilities

- `chatbot-submit-action-runtime-tests`: submitAction 编排运行时组合测试基线

### Modified Capabilities

- `chatbot-agent-ui`: 为 submitAction hook registry 和动作编排主链路补充更完整的回归保护

## Impact

- 受影响文件主要是 `src/pages/chatbot/components/schema/formSubmitAction.test.ts`
- 不改变业务功能，仅增加测试覆盖和记录
- 验证继续使用聊天模块定向 Jest 与项目级 `tsc`
