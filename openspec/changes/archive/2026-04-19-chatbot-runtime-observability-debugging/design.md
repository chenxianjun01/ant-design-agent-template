## Context

当前聊天页的 runtime 能力已经较完整，但诊断能力仍然弱。虽然部分远端失败会通过 `console.warn` 或用户提示暴露出来，但这些信息不成体系，也无法关联到具体会话、消息或 execution 流程。随着 stream、control、恢复、协议 contract 都已建立，下一步最有价值的补强就是让开发者在页面内直接看到运行链路，而不是把问题拆回浏览器控制台和源码。

## Goals / Non-Goals

**Goals:**
- 定义统一的 runtime 观测事件结构，至少覆盖 request、stream batch、control request/result、patch apply、error
- 提供页面内可开关的调试视图，用于展示当前会话的 runtime 事件时间线和关键 ids
- 保持现有对话 UI 不变，调试视图只在开发/联调场景下使用

**Non-Goals:**
- 不接入外部日志平台
- 不做生产级埋点分析后台
- 不实现复杂筛选查询系统，首轮聚焦当前会话内的 runtime 诊断

## Decisions

### 1. 使用本地 runtime event store，而不是把调试数据塞进消息内容

观测数据服务于调试，不应污染对话消息协议。独立 store 便于后续扩展字段，也不会影响消息渲染链。

### 2. 调试视图默认折叠，通过显式开关展示

用户已经明确要求主界面保持纯对话交互，因此调试信息不能挤进普通消息流。首轮采用可折叠的开发调试面板，默认不展开。

### 3. 事件结构围绕 correlation id 组织

至少保留 `conversationKey`、`messageId`、事件类型、时间戳和摘要字段，便于定位单条 execution 消息的完整生命周期。

## Risks / Trade-offs

- [事件记录过多影响渲染] → 首轮只保留当前会话最近有限条 runtime 事件
- [调试 UI 干扰主界面] → 默认折叠，且仅展示在开发联调工作台中
- [日志字段后续变化] → 先以最小稳定结构实现，后续继续扩展
