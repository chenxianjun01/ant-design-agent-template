## Context

当前 `src/pages/chatbot` 已经可以消费结构化消息，但消息对象的创建路径很多：

- `index.tsx` 里负责 assistant JSON 消息的解析与规范化
- `service.ts` 里直接拼接 mock 结构化消息 JSON
- `useLocalStructuredMessages.ts` 里负责本地插卡时补 `id`
- `formSubmitAction.ts` 里负责模板替换和 hook 消息插入

这些逻辑都在处理 `IMessageItem`，但规范化规则并不集中，后续如果增加新消息类型、版本字段或更复杂模板，会导致多点同步修改。

## Goals / Non-Goals

**Goals:**

- 提供一个统一的消息工厂，负责创建、补全和模板化结构化消息
- 提供一个统一的规范化入口，负责把未知输入收敛成稳定 `IMessageItem`
- 将页面、mock 和 submitAction 的消息构造迁移到共享实现
- 保持现有消息协议、渲染链路和本地/远端模式兼容

**Non-Goals:**

- 本次不引入 Formily
- 本次不扩展新的消息类型
- 本次不改造 `@ant-design/x` 对话容器结构

## Decisions

### 1. 在 `data.ts` 内新增消息工厂，而不是再拆一个独立协议模块

原因：`data.ts` 已经是聊天页消息协议的主事实来源。把 builder 放在这里，可以让协议类型和创建逻辑在同一处维护，降低继续漂移的风险。

替代方案：

- 新建 `messageFactory.ts`。优点是文件职责更窄；缺点是协议和 builder 分散，不利于当前阶段快速收口。

### 2. 区分“create”与“normalize”两类入口

实现上提供两层能力：

- `createMessageItem` 用于已知结构的创建和补默认值
- `normalizeStructuredMessage` 用于 assistant 原始 JSON、hook 模板结果等未知输入的校验和收敛

原因：mock 与本地插卡属于受控输入，适合走 create；assistant 响应属于不完全可信输入，必须走 normalize。

### 3. 提供消息模板解析入口，而不是继续在提交流程里做通用深拷贝替换

当前模板替换在 `formSubmitAction.ts` 内递归处理任意对象。调整后由消息工厂提供 `resolveMessageTemplate`，专门服务 `IMessageItem` 及其变体，submitAction 只保留 prompt / payload 的泛型模板替换。

原因：这样可以把“模板替换后仍然是一条合法消息”的约束落实到消息层，而不是完全依赖调用方自行保证。

## Risks / Trade-offs

- [风险] builder 放在 `data.ts` 会让文件继续变大
  → 通过只收口协议相关函数，避免把 UI 逻辑混入其中；后续若继续膨胀，再按协议域拆分

- [风险] 旧入口和新入口并存时可能出现重复逻辑
  → 本轮直接替换主要调用方，不保留平行实现

- [风险] 规范化更严格后，某些宽松 mock 数据可能被判无效
  → 优先让 mock 数据也走 builder，减少手写 JSON 偏差
