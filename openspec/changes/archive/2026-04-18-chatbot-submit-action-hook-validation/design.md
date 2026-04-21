## Context

当前 `formSubmitAction` 已经覆盖：

- 模板替换
- request 参数构建
- `callApi` 成功 / 失败主路径

但尚未直接测试：

- `requestAndInsert`
- 默认 prompt 回退逻辑
- `afterSuccess` hook 的 `insertMessage / request / clearStructuredMessages / refreshConversation`
- 非 `callApi` 路径的联动顺序

## Goals / Non-Goals

**Goals:**

- 补齐 `formSubmitAction` 里最关键的组合式路径
- 保持测试粒度在执行器层，不上升到页面联调
- 验证 hook registry 的实际外部效果

**Non-Goals:**

- 本轮不测远端接口本身
- 本轮不为每种 hook 排列组合做穷举
- 本轮不测 FormMessage / SchemaSlot UI

## Decisions

### 1. 重点验证副作用结果而非内部实现细节

原因：执行器的价值是对外产生哪些副作用，测试应优先断言 `insertStructuredMessage / onRequest / refreshConversation / clearStructuredMessages / trackEvent` 是否按配置触发。

### 2. 以最小新增用例覆盖最大回归面

优先补：

- `requestAndInsert`
- 默认 prompt fallback
- `callApi + afterSuccess` 多 hook 组合

这样能显著提升后续改动的安全性，而不会把测试膨胀得太快。

## Risks / Trade-offs

- [风险] 执行器测试过于依赖 mock 细节
  → 只断言稳定的对外行为和主要参数，不绑定内部局部实现

- [风险] 仍有长尾 hook 组合未覆盖
  → 将其保留为后续持续扩容项，不在本轮硬做穷举
