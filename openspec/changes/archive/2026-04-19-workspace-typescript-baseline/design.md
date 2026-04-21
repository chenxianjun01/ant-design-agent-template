## Context

当前根项目 `tsconfig.json` 直接包含仓库内所有 `ts/tsx` 文件，导致项目级 `pnpm exec tsc --noEmit` 会同时校验 `src/pages/chatbot` 与 `cloudflare-worker`。但 `cloudflare-worker` 是独立子工程，依赖由其自身 `package.json` 管理，根工作区并不会自动提供 `hono` 模块解析结果。与此同时，`src/pages/chatbot/data.ts` 将预设会话的 `starterMockType` 约束为 `MessageType`，与实际聊天页使用的 `MockMessageType` 不一致，造成字面量赋值报错。

## Goals / Non-Goals

**Goals:**
- 恢复根项目 `pnpm exec tsc --noEmit` 的可执行基线。
- 让聊天页预设会话类型与 mock runtime 类型保持一致。
- 保持 `cloudflare-worker` 继续作为独立子工程管理自身依赖和类型检查。

**Non-Goals:**
- 不改动 `cloudflare-worker` 的运行代码或路由实现。
- 不调整聊天消息协议和渲染逻辑。
- 不把整个仓库重构为 monorepo / workspace 引导结构。

## Decisions

### 1. 根 `tsconfig` 排除 `cloudflare-worker`

根项目的 `tsc` 应只对当前前端应用和共享类型负责，不跨越到独立子工程。对 `cloudflare-worker` 继续保留其自己的 `tsconfig.json` 和依赖管理，这样边界清晰，也避免为了根校验去重复安装子工程依赖。

备选方案：
- 在根项目新增 `hono` 依赖。问题是会模糊子工程边界，并不能解决未来其他子工程依赖漂移。
- 在根项目配置 project references。问题是超出本轮最小修复范围。

### 2. `starterMockType` 改为对齐 `MockMessageType`

预设会话里的 `starterMockType` 表示本地 mock provider 的返回类型，而不是消息渲染后的 `MessageType` 枚举。将其收口到 `MockMessageType` 可以直接反映运行时语义，并消除字面量赋值错误。

备选方案：
- 扩大 `MessageType` 使用范围。问题是会把消息协议类型和 mock 选择类型继续混在一起。

### 3. 在根 `tsconfig` 明确 `baseUrl` 与全局 `types`

当前根配置声明了 `paths`，但没有显式 `baseUrl`，同时也没有给 Node/Jest 提供统一全局类型入口，导致根应用自己的包引用和测试/配置文件的全局符号解析都不稳定。补齐这两个配置属于 workspace baseline，而不是业务代码行为变更。

备选方案：
- 为每一类缺失模块单独写 declaration shim。问题是噪音大，而且会掩盖真实配置问题。

## Risks / Trade-offs

- [根 `tsc` 不再覆盖 `cloudflare-worker`] → 明确保留子工程自己的 `typecheck` 入口，后续如需统一校验再单独做工程化 change。
- [`data.ts` 引入对 `service.ts` 类型的依赖] → 使用 `import type`，保持运行时无额外耦合。
- [扩大根 `tsconfig` 全局类型可能影响局部约束] → 仅添加 `node` 和 `jest`，覆盖当前配置与测试文件所需的最小集合。
