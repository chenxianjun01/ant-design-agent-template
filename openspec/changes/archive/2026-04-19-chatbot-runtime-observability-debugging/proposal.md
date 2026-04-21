## Why

当前聊天页已经具备 runtime stream、execution control、会话恢复和正式协议 contract，但一旦联调异常，前端仍然缺少清晰的链路观测和调试入口。要定位“请求发出了吗、patch 收到了吗、control 为什么失败、当前 execution id 是什么”，开发者还需要手动看代码和控制台，这会直接拖慢后续联调效率。

## What Changes

- 为聊天页增加统一的 runtime 观测事件结构，覆盖 request、stream、control、patch、error 等关键节点
- 增加可开关的调试面板，展示当前会话的 runtime 事件流和关键标识
- 为现有 runtime request / control / patch 更新链路补齐观测打点
- 为观测与调试能力补齐测试、记录和待办同步

## Capabilities

### New Capabilities
- `chatbot-runtime-observability-debugging`: 定义 runtime 观测事件、调试面板和链路可见性要求

### Modified Capabilities
- `chatbot-agent-ui`: 增加聊天页在开发联调时展示 runtime 调试信息的要求

## Impact

- 受影响代码主要位于 `src/pages/chatbot/index.tsx`、`src/pages/chatbot/service.ts`，以及新增的 runtime 观测模块/调试组件
- 不引入新后端依赖，首轮以本地事件记录和页面调试视图为主
- 需要更新 `todo.md`、开发记录和 OpenSpec usage record
