# OpenSpec 使用规范

本项目后续的智能体界面开发，统一采用 `openspec` 方式推进。

## 1. 目标

使用 `openspec` 的目的：

1. 将“需求 -> 方案 -> 实施 -> 验证”形成稳定记录。
2. 降低后续架构演进时的上下文丢失。
3. 让前端、后端、测试在接口和验收标准上有统一基线。

## 2. 目录约定

```text
openspec/
├── config.yaml
├── README.md
├── templates/
│   ├── proposal.template.md
│   ├── tasks.template.md
│   ├── validation.template.md
│   └── spec.template.md
├── changes/
│   ├── <change-id>/
│   │   ├── proposal.md
│   │   ├── tasks.md
│   │   └── validation.md
│   └── archive/
└── specs/
    └── <capability>/
        └── spec.md
```

## 3. 使用流程

每个新需求，默认按以下流程推进：

1. 建立一个 `change-id`
   推荐格式：`<domain>-<topic>`，例如 `chatbot-submit-action-hooks`
2. 在 `openspec/changes/<change-id>/proposal.md` 写 proposal
3. 在 `openspec/changes/<change-id>/tasks.md` 拆任务
4. 开发过程中同步更新 `validation.md`
5. 若变更会形成稳定能力或长期约束，同时更新 `openspec/specs/<capability>/spec.md`
6. 需求完成后，将该变更移入 `openspec/changes/archive/`，或保留为活跃记录

## 4. 何时必须写 OpenSpec

以下情况必须先写 `proposal` 再开发：

1. 新增消息类型
2. 修改消息协议
3. 修改 `submitAction`、hook、adapter、schema 渲染链
4. 引入新的后端接口或联调协议
5. 对聊天页主链路、会话状态或渲染架构做调整

以下情况可以简化，但仍建议补 `validation`：

1. 纯样式微调
2. 文案修正
3. 小型 bugfix，且不改变协议和行为边界

## 5. 文档职责

### `proposal.md`

回答“为什么做、做什么、不做什么、影响哪里、怎么验收”。

### `tasks.md`

回答“拆成哪些步骤执行”。

### `validation.md`

回答“如何验证、验证结果如何、还有什么风险”。

### `spec.md`

回答“这项能力长期稳定的行为约束是什么”。

## 6. 当前约定

当前智能体界面的变更，默认以 `src/pages/chatbot` 为主场景。

已经落地的第一份正式记录见：

1. [openspec/changes/chatbot-submit-action-orchestration/proposal.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/changes/chatbot-submit-action-orchestration/proposal.md:1)
2. [openspec/specs/chatbot-agent-ui/spec.md](/Users/chenxianjun/Desktop/items/agent/schema-flow/openspec/specs/chatbot-agent-ui/spec.md:1)
