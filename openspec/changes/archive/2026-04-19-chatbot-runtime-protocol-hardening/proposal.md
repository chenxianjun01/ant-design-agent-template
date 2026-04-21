## Why

当前前端已经具备 runtime stream、execution control 和本地 patch 合并能力，但这些协议约定仍分散在 `service.ts`、`data.ts` 和本地 mock 中，缺少一份正式、可对外联调的 contract。随着执行态能力继续扩张，如果不把 patch/event 协议固化下来，前后端会在 message id、cursor、patch 字段、control 响应等边界上持续返工。

## What Changes

- 新增正式的 chatbot runtime protocol contract 文档，统一定义 runtime stream、execution control、patch 结构和错误约定
- 对齐前端现有类型命名与协议术语，减少“代码里能跑、文档里不清楚”的状态
- 为协议 contract 增加基础验证留痕，确保后续联调有稳定参考

## Capabilities

### New Capabilities
- `chatbot-runtime-protocol-hardening`: 定义智能体执行态 runtime patch/event/control 协议 contract 与联调边界

### Modified Capabilities
- `chatbot-agent-runtime-stream-integration`: 明确 runtime stream 批次、cursor 和 patch 应答约定
- `chatbot-agent-execution-controls`: 明确 execution control 请求与响应 patch 约定

## Impact

- 受影响文件主要位于 `src/pages/chatbot/service.ts`、新增 runtime contract 文档，以及对应 OpenSpec specs
- 不改变当前 UI 行为，重点收敛协议与术语
- 后续后端/SSE/WebSocket 接入将以这份 contract 为基线
