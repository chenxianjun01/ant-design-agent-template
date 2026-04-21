# Validation

## Commands

1. `pnpm exec tsc --noEmit`

## Results

1. 类型检查通过。
2. `FormMessage` 已具备 loading、错误提示和可重试交互。
3. `submitAction.callApi` 已支持成功插卡、失败提示、继续请求。
4. `trackEvent` 已通过 adapter 接入本地 mock 和 remote 骨架。
5. `refreshConversation` 已可更新会话元数据并提升当前会话排序。
6. `src/pages/chatbot/_mock.ts` 已提供本地 remote 联调接口。

## Residual Risks

1. 真实后端需要遵循 `submit-action-contract.md` 才能无缝接入。
2. 埋点远端接口目前只有请求骨架，尚未验证真实 SDK 或正式服务。
3. hook registry 未来扩展较多时，建议进一步拆动作模块。
