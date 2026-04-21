## Context

聊天模块当前高度依赖本地 mock provider：

- 日常联调依赖 mock 快速返回结构化消息
- 远端模式本地开发也依赖 `_mock.ts`
- 新消息工厂和结构化消息规范化已经收口到共享协议层

如果 mock 输出漂移，开发态联调会先“看起来能跑”，但真实渲染和协议约束可能已经失真。

## Goals / Non-Goals

**Goals:**

- 验证 mock 输出的结构化 payload 能被共享协议层规范化
- 验证 text mock 仍维持流式文本返回模式
- 用尽量小的测试入口暴露 mock 生成器给测试使用

**Non-Goals:**

- 本轮不测试整个 MockXRequestClass 的时序行为
- 本轮不覆盖每一个随机样本分支
- 本轮不测试远端 `_mock.ts` 路由层

## Decisions

### 1. 暴露窄测试入口而不是重构 provider

原因：当前只需要拿到 mock payload 原文做契约校验，不需要改变 provider 结构。增加一个只读测试入口能把改动控制到最小。

### 2. 使用共享 `normalizeStructuredMessage` 做契约校验

原因：这能保证 mock contract 测的是“是否符合当前真实运行协议”，而不是测试里再手写另一套判断逻辑。

## Risks / Trade-offs

- [风险] 测试入口暴露在生产模块中
  → 入口保持极窄，只读，不参与运行时分支

- [风险] 随机样本仍可能覆盖不全
  → 测试通过强制类型参数锁定 payload 类型，先覆盖稳定主路径
