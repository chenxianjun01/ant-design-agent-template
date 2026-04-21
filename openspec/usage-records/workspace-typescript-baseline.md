# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-19
- 变更名称：`workspace-typescript-baseline`
- 使用场景：继续推进智能体后续开发前，先恢复工作区级 TypeScript 校验基线
- 使用流程：`propose -> apply-change`

## 本次规划结论

本轮没有继续扩消息类型或运行时功能，而是先修项目级 `tsc`。原因是后续智能体开发会持续依赖 TypeScript 校验兜底，但当前仓库存在两类基础阻塞：

1. `chatbot` 预设会话的 mock 类型声明与 runtime 不一致
2. 根 `tsconfig` 的校验边界和类型解析配置不稳定，同时工作区 `node_modules` 顶层链接异常

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/workspace-typescript-baseline/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/workspace-typescript-baseline/design.md:1)
- [workspace-typescript-baseline spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/workspace-typescript-baseline/specs/workspace-typescript-baseline/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/workspace-typescript-baseline/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/workspace-typescript-baseline/tasks.md:1)

## 实施内容

1. 在 [tsconfig.json](/Users/chenxianjun/Desktop/items/agent/schema-flow/tsconfig.json:1) 中：
   - 排除 `cloudflare-worker`
   - 补充 `baseUrl`
   - 补充 `types` 与 `typeRoots`
   - 增加 `ignoreDeprecations`
2. 在 [data.ts](/Users/chenxianjun/Desktop/items/agent/schema-flow/src/pages/chatbot/data.ts:1) 中将 `ConversationItem.starterMockType` / `starterMockChartType` 改为复用 runtime 的 `MockMessageType` / `MockChartType`
3. 对依赖布局异常执行 `pnpm install --force`，恢复顶层包和类型入口的正常链接
4. 更新 [智能体界面开发记录.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/智能体界面开发记录.md:1797) 中关于本轮 TypeScript 基线修复的记录

## 验证记录

- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

1. 根项目 TypeScript 校验已恢复可执行
2. `chatbot-submit-action-adapter-validation` 这条上一轮 change 的最终验证任务也已具备完成条件
3. 后续可以继续把 OpenSpec 焦点放回智能体功能本身，而不是先消耗在工程基线噪音上
