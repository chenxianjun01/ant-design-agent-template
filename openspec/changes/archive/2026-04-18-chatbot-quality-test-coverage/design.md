## Context

当前聊天模块的核心逻辑已经不再简单：

- `MessageRenderer` 决定消息类型分发与兜底
- `adapter.ts` 负责从 schema 中抽取表格、图表、表单配置
- `formSubmitAction.ts` 负责模板替换、hook 执行和请求参数构建

这些逻辑都是后续继续扩展消息类型和 submitAction 的基础，但目前没有稳定测试保护。

## Goals / Non-Goals

**Goals:**

- 为最核心、最纯的三类逻辑补第一批测试
- 优先选择容易回归且不依赖整页运行环境的断面
- 保持测试实现轻量，不引入额外测试框架

**Non-Goals:**

- 本轮不做整页 e2e
- 本轮不追求所有消息组件全覆盖
- 本轮不为 Formily 运行时做深度 DOM 行为测试

## Decisions

### 1. 优先测纯函数和轻量分发，而不是从整页入口起测

原因：`schema adapter` 和 `formSubmitAction` 有大量纯逻辑，投入产出最高；`MessageRenderer` 只需要验证类型映射和兜底，不必从整页挂载。

### 2. 将 `formSubmitAction` 测试聚焦在关键行为而非所有分支穷举

优先覆盖：

- `buildRequestParams`
- `applyPromptTemplate`
- `resolveTemplateValue`
- `callApi` 成功 / 失败关键路径

这样可以先把最大回归面收住，后续再继续扩展 hook 组合测试。

### 3. 测试文件就近放在聊天模块旁边

原因：该模块还在快速迭代，测试靠近源码更方便和后续 OpenSpec 变更同步维护。

## Risks / Trade-offs

- [风险] Jest 环境对聊天组件依赖的第三方库支持不完全
  → 先以纯逻辑与轻量组件映射为主，避免首轮测试被重型依赖拖垮

- [风险] 测试只覆盖核心路径，仍有长尾分支未覆盖
  → 本轮定位是第一批基线测试，后续继续扩容
