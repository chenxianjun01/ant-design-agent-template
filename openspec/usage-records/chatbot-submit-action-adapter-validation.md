# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`chatbot-submit-action-adapter-validation`
- 使用场景：基于《智能体界面开发记录》继续完善 `src/pages/chatbot` 的 submit-action 运行边界
- 使用流程：`propose -> apply-change`

## 本次规划结论

本轮没有继续扩展新的结构化消息类型，而是先补齐 `submitActionAdapter` 的运行时回归基线。原因是当前聊天模块已经具备 mock / remote 双通道执行能力，但测试主要集中在消息协议和 submit-action 编排，adapter 这一层的请求骨架、模式分流和异常处理仍缺少稳定保护。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-submit-action-adapter-validation/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-submit-action-adapter-validation/design.md:1)
- [chatbot-submit-action-adapter-tests spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-submit-action-adapter-validation/specs/chatbot-submit-action-adapter-tests/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-submit-action-adapter-validation/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-submit-action-adapter-validation/tasks.md:1)

## 实施内容

1. 在 [service.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.ts:1) 中导出 adapter 相关的窄运行时入口：
   - `MOCK_PROVIDER_MODE`
   - `REMOTE_PROVIDER_MODE`
   - `executeRemoteSubmitApiAction`
   - `trackRemoteEvent`
2. 重写 [service.test.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/service.test.ts:1)，在保留原有 mock payload contract 测试的同时，新增 adapter 运行时覆盖：
   - mock / remote 模式选择
   - remote submitAction 请求骨架与结果归一化
   - remote submitAction 异常兜底
   - remote trackEvent 请求参数与吞错策略
3. 更新 [智能体界面开发记录.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/智能体界面开发记录.md:1766) 中关于 submitActionAdapter 回归补强的记录。

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot/service.test.ts --runInBand`
- 结果：通过，`20` 个测试全部通过
- 已执行：`pnpm exec tsc --noEmit`
- 结果：未通过，当前阻塞来自仓库既有问题：
  - `cloudflare-worker` 缺少 `hono` 相关依赖与类型
  - `src/pages/chatbot/index.tsx` 存在既有 `MessageType` 类型不匹配

## 后续建议

1. 下一轮可以单独立一条 change，收口 `cloudflare-worker` 的 TypeScript 依赖与类型问题，让项目级 `tsc` 恢复可用。
2. 在 adapter 运行边界稳定后，可以继续推进真实后端联调、tool call 回执或多阶段执行反馈，不必担心 mock / remote 路径无测试保护。
