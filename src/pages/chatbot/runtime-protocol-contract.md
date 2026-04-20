# Chatbot Runtime Protocol Contract

## Purpose

定义 `agent-execution` 在聊天页中的正式 runtime patch / stream / control 协议，作为前后端联调基线。

当前默认 transport 为 HTTP `POST` 轮询接口；后续如果升级为 SSE 或 WebSocket，应保持本合同中的对象语义不变。

## Shared Objects

### `IAgentExecutionMessagePatch`

用于对同一条 `agent-execution` 消息做增量更新。

关键字段：

- `description`: 覆盖消息描述
- `summary`: 覆盖消息摘要
- `status`: 更新整体执行状态，当前支持 `running | success | error`
- `startedAt` / `updatedAt`: 更新时间字段
- `controls`: 覆盖当前控制动作集合
- `pendingControlKey`: 标记当前正在提交的控制动作
- `clearPendingControl`: 清除当前 pending control
- `controlErrorMessage`: 显示控制失败提示
- `clearControlError`: 清除控制错误
- `replaceSteps`: 直接替换步骤数组
- `appendSteps`: 在末尾追加新步骤
- `updateSteps`: 按 `step.key` 局部更新既有步骤

语义约定：

- 一个 patch 只更新声明过的字段，未声明字段保持原值
- `replaceSteps` 优先级高于 `updateSteps`
- `appendSteps` 在 `replaceSteps` 或 `updateSteps` 处理后追加
- control 相关字段只描述当前本地反馈态，不代表最终执行结果

### `AgentRuntimeStreamBatch`

用于描述一次 runtime stream 拉取响应。

```ts
interface AgentRuntimeStreamBatch {
  messageId: string;
  patches: IAgentExecutionMessagePatch[];
  nextCursor?: string;
  done: boolean;
  pollIntervalMs?: number;
}
```

字段约定：

- `messageId`: 被更新的 `agent-execution` 消息 id
- `patches`: 当前批次按顺序应用的 patch 数组
- `nextCursor`: 下一次拉取应携带的 cursor；仅在 `done=false` 时有意义
- `done`: 当前流是否已结束
- `pollIntervalMs`: 建议的下一次拉取间隔

语义约定：

- 同一 `messageId` 下，前端必须按返回顺序依次应用 `patches`
- 当 `done=true` 时，前端不应继续为该 cursor 链路发起下一次请求
- 当 `done=false` 且存在 `nextCursor` 时，前端以下一个 cursor 继续请求

### `AgentExecutionControlResult`

用于描述执行控制请求响应。

```ts
interface AgentExecutionControlResult {
  success: boolean;
  code?: string;
  retryable?: boolean;
  message?: string;
  patch?: IAgentExecutionMessagePatch;
}
```

字段约定：

- `success`: 控制请求是否被接受
- `code`: 业务错误码
- `retryable`: 是否允许用户继续重试控制操作
- `message`: 用户可读提示
- `patch`: 立即应用到同一消息的反馈 patch

语义约定：

- `patch` 只用于即时本地反馈，不替代后续 runtime stream 的最终状态收敛
- 最终执行结果仍以后续 `AgentRuntimeStreamBatch` 为准

## Endpoints

### `POST /api/chatbot/runtime-stream`

请求体：

```json
{
  "messageId": "execution-1",
  "cursor": "0"
}
```

响应体：

```json
{
  "messageId": "execution-1",
  "patches": [
    {
      "summary": "已完成上下文检索，准备生成执行计划。",
      "updateSteps": [
        {
          "key": "retrieve-context",
          "status": "success"
        }
      ]
    }
  ],
  "nextCursor": "1",
  "done": false,
  "pollIntervalMs": 120
}
```

### `POST /api/chatbot/execution-control`

请求体：

```json
{
  "messageId": "execution-1",
  "control": {
    "key": "stop-execution",
    "label": "停止",
    "action": "stop",
    "danger": true
  }
}
```

响应体：

```json
{
  "success": true,
  "message": "停止请求已接收",
  "patch": {
    "summary": "已提交停止请求，等待执行链路收敛。",
    "clearPendingControl": true
  }
}
```

失败示例：

```json
{
  "success": false,
  "code": "REMOTE_CONTROL_FAILED",
  "retryable": true,
  "message": "control down",
  "patch": {
    "clearPendingControl": true,
    "controlErrorMessage": "control down"
  }
}
```

## Frontend Mapping

- `src/pages/chatbot/data.ts`
  - `IAgentExecutionMessagePatch`
  - `applyAgentExecutionMessagePatch(...)`
- `src/pages/chatbot/service.ts`
  - `CHAT_AGENT_RUNTIME_STREAM_API_URL`
  - `CHAT_AGENT_EXECUTION_CONTROL_API_URL`
  - `AgentRuntimeStreamBatch`
  - `AgentExecutionControlResult`
  - `fetchRemoteAgentRuntimeStreamBatch(...)`
  - `executeRemoteAgentExecutionControl(...)`
- `src/pages/chatbot/index.tsx`
  - runtime patch batch consumption
  - execution control immediate feedback

## Local Mock

开发态本地联调接口位于 [src/pages/chatbot/_mock.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/_mock.ts:1)。

已覆盖：

- `POST /api/chatbot/runtime-stream`
- `POST /api/chatbot/execution-control`
