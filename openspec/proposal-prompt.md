# OpenSpec Proposal Prompt

下面这段提示词用于后续新的智能体界面需求。目标是先生成一份规范化的 `openspec proposal`，再进入实现。

---

你正在为本项目编写一份 `openspec proposal`。

项目信息：

1. 技术栈：Ant Design Pro、React、TypeScript、`@ant-design/x`、`@umijs/max request`
2. 核心目录：`src/pages/chatbot`
3. 当前消息类型：`text`、`table`、`chart`、`form`
4. 当前关键链路：
   - `MessageRenderer`
   - `submitAction`
   - `hook registry`
   - `submitActionAdapter`
   - `remote/mock` 联调接口
5. 已有联调协议：
   - `/api/chatbot/submit-action`
   - `/api/chatbot/track-event`

请基于我接下来给出的需求，输出一份正式的 `openspec proposal`，要求：

1. 输出语言使用中文。
2. 明确写出：
   - Background
   - Goals
   - Non-goals
   - Scope
   - Impacted Files
   - Risks
   - Acceptance Criteria
3. 不要直接写实现代码。
4. 必须说明这次变更是否会影响以下稳定边界：
   - 消息协议 `src/pages/chatbot/data.ts`
   - 分发器 `MessageRenderer.tsx`
   - 表单动作执行器 `formSubmitAction.ts`
   - adapter 边界 `service.ts`
   - 本地 remote mock 接口
5. 如果需求涉及接口联调，必须补充：
   - 请求体
   - 响应体
   - 错误码
   - 验收方式
6. 如果需求涉及新消息类型，必须补充：
   - 类型定义
   - componentMap 注册点
   - 兜底策略
   - mock 数据策略
7. 如果需求涉及 submitAction / hook / adapter，必须补充：
   - 是新增动作还是修改现有动作
   - 是否破坏现有 schema 配置兼容性
   - 是否需要扩展 OpenSpec spec
8. proposal 要求偏工程化，不要空泛。

输出格式请严格使用：

```md
# Proposal

## Background

## Goals

1.

## Non-goals

1.

## Scope

## Impacted Files

1.

## Risks

1.

## Acceptance Criteria

1.
```

如果我提供的需求不完整，请先基于当前代码结构做最保守、最可落地的方案，不要为了等更多信息而停止。

---

建议用法：

1. 先把新需求粘贴到这段 prompt 后面。
2. 生成 `openspec/changes/<change-id>/proposal.md`
3. 确认 proposal 后，再继续生成 `tasks.md` 和 `validation.md`
