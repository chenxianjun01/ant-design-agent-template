## Why

`file / image / audio / map` 已经具备基础展示能力，但仍缺少动作链路。用户希望这些消息不仅能展示，还能承接诸如“文件下载回执”“地图点位点击回调”这类操作。

## What Changes

- 为富媒体消息补充通用动作协议
- 让 `file / image / audio` 支持按钮动作
- 让 `map` 支持 marker 点击回调，并复用共享 `submitAction` 执行层
- 为本地 mock 增加可触发动作的样例

## Capabilities

### New Capabilities

- `chatbot-rich-message-actions`: 富媒体消息动作能力

### Modified Capabilities

- `chatbot-rich-message-coverage`: 富媒体与地图消息从只读展示升级为可触发动作的消息类型
- `chatbot-agent-ui`: 共享 `submitAction` 引擎扩展到更多消息类型

## Impact

- 受影响代码包括 `src/pages/chatbot/data.ts`、`components/messages/*`、`service.ts`
- 不新增额外依赖，复用现有共享动作执行层
- 需要同步补充测试、开发记录和 OpenSpec 使用记录
