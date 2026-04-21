## Why

当前智能体界面已经支持 `text / table / chart / form / timeline / approval`，但仍缺少文件、图片、音频和地图这类常见多媒体/地理消息。用户提到的目标类型里，前四类已经具备，剩余缺口需要补齐。

## What Changes

- 盘点并明确当前已支持的消息类型：`text / table / form / chart`
- 为聊天结构化消息协议新增 `file / image / audio / map` 四类消息
- 新增对应渲染组件，并将 `map` 基于 `openlayers` 实现
- 为本地 mock provider 增加四类样例
- 为消息分发和 mock 契约增加四类覆盖

## Capabilities

### New Capabilities

- `chatbot-rich-message-coverage`: 智能体界面的富媒体与地图消息类型覆盖能力

### Modified Capabilities

- `chatbot-agent-ui`: 中央消息分发器和本地 mock provider 新增 `file / image / audio / map` 支持

## Impact

- 受影响代码包括 `src/pages/chatbot/data.ts`、`service.ts`、`components/MessageRenderer.tsx`、`components/messages/*`
- 新增 `openlayers` 依赖 `ol`
- 需要同步补充测试、开发记录和 OpenSpec 使用记录
