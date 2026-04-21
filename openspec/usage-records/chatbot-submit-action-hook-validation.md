# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-submit-action-hook-validation`
- 使用流程：`propose -> apply-change`
- 目标：补齐 submitAction hook 组合与边界分支测试

## 本次规划结论

本轮继续沿工程质量层推进，但不再扩消息组件，而是聚焦 `formSubmitAction` 的高风险组合路径：

1. `requestAndInsert`
2. 无 `promptTemplate` 的默认 summary prompt
3. `callApi` 成功后的 `afterSuccess` hook 组合

这样能把副作用编排最容易回归的几条路径补齐。

## 实施内容

已在 [formSubmitAction.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/formSubmitAction.test.ts:1) 中新增覆盖：

1. `requestAndInsert` 会同时插入消息并继续发起请求
2. `request` 在没有 `promptTemplate` 时会回退到自动 summary prompt
3. `callApi` 成功后 `afterSuccess` 中的：
   - `clearStructuredMessages`
   - `refreshConversation`
   - `insertMessage`
   - `request`
   - `trackEvent`
   都会按模板解析后的值执行

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 当前结果

聊天模块当前测试基线已更新为：

- 4 个 test suite
- 17 个 test case
- 全部通过
