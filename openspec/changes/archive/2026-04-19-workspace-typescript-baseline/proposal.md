## Why

当前仓库的项目级 `pnpm exec tsc --noEmit` 不能稳定通过，阻塞点来自两个无关但高频影响的基线问题：`src/pages/chatbot` 的本地预设会话类型声明不准确，以及根 `tsconfig` 把 `cloudflare-worker` 一并纳入校验但工作区并未共享其独立依赖。继续推进智能体后续开发前，需要先恢复 workspace 级 TypeScript 校验可用性。

## What Changes

- 修正 `src/pages/chatbot` 中预设会话的 `starterMockType` 类型边界，使其与实际 mock 类型定义一致。
- 收口根项目 TypeScript 校验范围，避免根 `tsc` 被 `cloudflare-worker` 的独立依赖布局错误拖住。
- 补齐根项目 TypeScript 的基础解析配置，使 Node、Jest 和根应用依赖能被稳定识别。
- 为项目级 TypeScript 基线补充 OpenSpec 留痕和验证记录。
- 不修改现有聊天消息协议语义，不变更 `cloudflare-worker` 运行逻辑。

## Capabilities

### New Capabilities

- `workspace-typescript-baseline`: 定义工作区级 TypeScript 校验可执行基线。

### Modified Capabilities

- `chatbot-agent-ui`: 增加本地预设会话 mock 类型声明必须与聊天 mock runtime 类型一致的要求。

## Impact

- 代码范围：`tsconfig.json`、`src/pages/chatbot/data.ts`
- 配置范围：根 TypeScript 模块解析与全局类型声明
- 校验范围：项目根 `pnpm exec tsc --noEmit`
- 关联目录：`cloudflare-worker/`、`src/pages/chatbot/`
