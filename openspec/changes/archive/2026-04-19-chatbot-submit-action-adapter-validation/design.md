## Context

`submitActionAdapter` 位于 `src/pages/chatbot/service.ts`，承担 `callApi` 与 `trackEvent` 的 mock / remote 分流，是 schema 执行链与运行时 I/O 的边界。当前回归测试已覆盖消息协议、SchemaSlot 和 submit-action hook 组合，但尚未覆盖 adapter 的模式切换、远端请求骨架、错误归一化和埋点失败容错。

这类行为一旦回退，不一定能从 UI 组件测试里及时暴露，因此需要在 service 层建立更贴近运行时边界的窄测试入口。

## Goals / Non-Goals

**Goals:**
- 为 mock / remote adapter 行为建立可执行回归基线。
- 验证 remote `executeApiAction` 的请求形状、成功结果归一化和失败兜底。
- 验证 remote `trackEvent` 的失败吞掉策略，确保不会向上抛错。
- 将改动限制在 `service.ts` 与 `service.test.ts` 及对应 OpenSpec 文档。

**Non-Goals:**
- 不变更现有 submit-action 协议字段。
- 不改动聊天页 UI 或表单交互。
- 不引入新的远端 endpoint 或埋点 SDK。

## Decisions

### 1. 在 `service.ts` 暴露窄测试入口，而不是重写生产逻辑

保留 `createSubmitActionAdapter` 作为正式运行入口，仅补充最小化导出，便于测试直接验证 remote / mock 实现。这样测试针对真实生产代码路径，不需要复制 adapter 逻辑到测试辅助函数中。

备选方案：
- 只测试 `createSubmitActionAdapter` 返回对象，不直接触达内部实现。问题是很难稳定验证 remote 错误归一化与埋点吞错细节。
- 通过页面组件测试间接覆盖。问题是耦合过大，失败定位不清晰。

### 2. 使用模块重载验证 provider mode，而不是运行时改写常量

`CHAT_PROVIDER_MODE` 在模块加载时读取环境变量。测试中通过 `jest.isolateModules` / `jest.resetModules` 结合模块 mock 重新加载 `service.ts`，可以验证 mock 与 remote 模式选择，而不需要侵入生产代码去新增 setter。

备选方案：
- 将 provider mode 改成函数入参。问题是会改变现有运行入口签名，超出本次测试性收口范围。

### 3. 将回归范围聚焦在 adapter 边界，不重复覆盖已有 hook 逻辑

本次只验证 adapter 的分流、请求参数与异常处理；hook registry、模板求值和消息插卡继续由现有 `formSubmitAction` 测试承担。这样测试职责更清楚，也避免重复用例。

## Risks / Trade-offs

- [模块重载测试依赖 jest 隔离行为] → 使用单文件内集中封装的加载辅助函数，避免跨测试污染。
- [新增导出可能扩大 `service.ts` API 面] → 仅导出 adapter 相关窄入口，并继续以内部实现命名表达其测试属性。
- [request mock 与 Umi request 泛型行为存在差异] → 只断言调用参数与归一化结果，不依赖底层实现细节。
