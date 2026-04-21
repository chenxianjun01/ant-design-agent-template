## Why

`agent-execution` 消息现在已经能静态展示执行态，但还不能承接真实运行过程中的状态推进。如果每次步骤变化都只能插入一张新卡，用户很快会看到重复且割裂的执行记录，也无法把“同一次执行”的 running、success、error 演进串起来。

## What Changes

- 为 `agent-execution` 定义最小可用的本地 patch/update 协议。
- 为本地结构化消息存储增加按 `message.id` 更新既有消息的能力。
- 提供一个本地执行态演示入口，展示同一条 `agent-execution` 消息从 `running` 逐步更新到最终状态。
- 补充 store、运行时演示和协议边界测试。

## Capabilities

### New Capabilities

- `chatbot-agent-execution-runtime-updates`: 定义 `agent-execution` 消息的本地增量更新能力与演示基线。

### Modified Capabilities

- `chatbot-agent-execution-message`: 增加同一执行消息可被增量 patch 更新的要求。
- `chatbot-agent-ui`: 增加本地执行态消息更新演示能力的长期要求。

## Impact

- 代码范围：`src/pages/chatbot/data.ts`、`src/pages/chatbot/components/schema/structuredMessageStore.ts`、`src/pages/chatbot/components/schema/useLocalStructuredMessages.ts`、`src/pages/chatbot/index.tsx`
- 测试范围：`src/pages/chatbot/components/schema/structuredMessageStore.test.ts`
- 本地演示范围：chatbot 空态快捷入口与本地结构化消息更新链路
