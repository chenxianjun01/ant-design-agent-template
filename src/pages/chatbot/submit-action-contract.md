# Chatbot Submit Action Contract

## Endpoints

### `POST /api/chatbot/submit-action`

用于执行 `submitAction.action === 'callApi'` 的后端副作用。

当前既可由动态表单提交触发，也可由审批卡片动作按钮触发。

请求体：

```json
{
  "api": "createTicketWithRisk",
  "payload": {
    "applicant": "张三",
    "topic": "智能体消息联调",
    "priority": "high",
    "planDate": "2026-04-18"
  }
}
```

响应体：

```json
{
  "success": true,
  "code": "OK",
  "retryable": false,
  "message": "工单创建成功",
  "data": {
    "ticketId": "TICKET-1024",
    "status": "created",
    "owner": "智能体调度中心"
  }
}
```

字段约定：

- `success`: 是否执行成功
- `code`: 业务错误码，失败时用于前端 `errorMessages` 映射
- `retryable`: 是否允许用户在表单区域直接重试
- `message`: 用户可读提示，未命中错误码映射时会直接展示
- `data`: 返回给前端模板变量和后续 hook 使用的上下文数据

失败示例：

```json
{
  "success": false,
  "code": "RATE_LIMITED",
  "retryable": true,
  "message": "当前高优任务创建过于频繁，请稍后重试。",
  "data": {
    "priority": "high"
  }
}
```

### `POST /api/chatbot/track-event`

用于执行 `trackEvent` hook。

请求体：

```json
{
  "event": "form_submit_succeeded",
  "properties": {
    "api": "createTicketWithRisk",
    "ticketId": "TICKET-1024",
    "priority": "medium"
  }
}
```

响应体：

```json
{
  "success": true,
  "message": "埋点已记录",
  "data": {
    "trackedAt": "2026-04-18T03:00:00.000Z"
  }
}
```

## Frontend Mapping

- `src/pages/chatbot/service.ts`
  - `CHAT_SUBMIT_ACTION_API_URL`
  - `CHAT_TRACK_EVENT_API_URL`
  - `createSubmitActionAdapter()`
- `src/pages/chatbot/components/schema/formSubmitAction.ts`
  - `submitActionAdapter.executeApiAction(...)`
  - `submitActionAdapter.trackEvent(...)`

当前共享执行层已兼容：

- `form` 消息中的 `content.submitAction`
- `approval` 消息动作按钮注入的 `content.submitAction`

## Local Mock

开发态本地联调接口位于 [src/pages/chatbot/_mock.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/_mock.ts:1)。

已覆盖：

- `createTicket`
- `notifyMembers`
- `createTicketWithRisk`
- `track-event`
