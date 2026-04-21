# OpenSpec 使用记录

## 基本信息

- 日期：2026-04-18
- 变更名称：`chatbot-quality-test-coverage`
- 使用流程：`propose -> apply-change`
- 目标：为智能体界面核心模块建立第一批可执行测试基线

## 本次规划结论

本轮不从整页入口做重型测试，而是优先覆盖最值得回归保护的三类核心模块：

1. `MessageRenderer`
2. `schema adapter`
3. `formSubmitAction`

这样可以在不明显增加测试维护成本的前提下，先把消息分发、schema 提取和动作执行主路径保护起来。

本轮 OpenSpec 产物包括：

- [proposal.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-quality-test-coverage/proposal.md:1)
- [design.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-quality-test-coverage/design.md:1)
- [chatbot-quality-tests spec](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-quality-test-coverage/specs/chatbot-quality-tests/spec.md:1)
- [chatbot-agent-ui delta spec](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-quality-test-coverage/specs/chatbot-agent-ui/spec.md:1)
- [tasks.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/openspec/changes/chatbot-quality-test-coverage/tasks.md:1)

## 实施内容

1. 新增 [MessageRenderer.test.tsx](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/MessageRenderer.test.tsx:1)
   - 覆盖已注册消息类型分发
   - 覆盖未知消息类型兜底
2. 新增 [adapter.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/adapter.test.ts:1)
   - 覆盖表格列提取
   - 覆盖图表配置提取
   - 覆盖表单字段与 required 标记
3. 新增 [formSubmitAction.test.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/formSubmitAction.test.ts:1)
   - 覆盖模板替换
   - 覆盖 request 参数构建
   - 覆盖 `callApi` 成功 / 失败主路径

## 验证记录

- 已执行：`pnpm exec jest src/pages/chatbot --runInBand`
- 已执行：`pnpm exec tsc --noEmit`
- 结果：通过

## 后续建议

1. 下一轮可继续补 `SchemaSlot` 的运行时测试和更多 hook 组合测试。
2. 当新消息类型落地时，应同步为对应 renderer 和 adapter 增补测试。
