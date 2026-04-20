import type { ConversationItem } from './data';

export const PRESET_CONVERSATIONS: ConversationItem[] = [
  {
    key: 'preset-1',
    label: '🧩 Ant Design 的 Form 表单如何做联动校验？',
    group: '今天',
    starterPrompt:
      '请用步骤化方式说明 Ant Design Form 如何做联动校验，并给一个包含依赖字段的示例。',
    starterMockType: 'text',
  },
  {
    key: 'preset-2',
    label: '📋 ProTable 如何自定义工具栏按钮？',
    group: '今天',
    starterPrompt:
      '请返回一个包含自定义工具栏按钮的 ProTable 示例，并说明按钮适合放哪些操作。',
    starterMockType: 'table',
  },
  {
    key: 'preset-3',
    label: '🎨 如何用 antd-style 实现暗色主题切换？',
    group: '昨天',
    starterPrompt:
      '请给我一个 antd-style 主题切换方案，包含 token 覆盖、主题入口和常见坑。',
    starterMockType: 'text',
  },
  {
    key: 'preset-4',
    label: '🗂️ ProLayout 侧边菜单如何动态生成？',
    group: '昨天',
    starterPrompt:
      '请整理一条 ProLayout 动态菜单生成流程，包含权限、路由配置和远端数据接入节点。',
    starterMockType: 'timeline',
  },
  {
    key: 'preset-5',
    label: '📊 Ant Design Charts 折线图数据格式',
    group: '昨天',
    starterPrompt:
      '请返回一个 Ant Design Charts 折线图示例，主题是前端智能体请求趋势，并附带字段说明。',
    starterMockType: 'chart',
    starterMockChartType: 'line',
  },
  {
    key: 'preset-6',
    label: '🚀 Ant Design Pro 如何接入后端权限系统？',
    group: '更早',
    starterPrompt:
      '请输出一张权限接入审批卡，概括角色、菜单权限、页面权限和接口权限四部分。',
    starterMockType: 'approval',
  },
  {
    key: 'preset-7',
    label: '🔍 ProForm 中 Select 远程搜索怎么实现？',
    group: '更早',
    starterPrompt:
      '请返回一个远程搜索表单示例，包含关键词、负责人和状态字段，并展示提交流程。',
    starterMockType: 'form',
  },
  {
    key: 'preset-8',
    label: '⚙️ Ant Design Token 定制主题最佳实践',
    group: '更早',
    starterPrompt:
      '请给我一份主题 token 定制清单，最好包含色板、圆角、间距和组件级覆盖建议。',
    starterMockType: 'text',
  },
];

export const DEFAULT_ACTIVE_KEY = 'default';

export const DEFAULT_CONVERSATIONS: ConversationItem[] = [
  { key: DEFAULT_ACTIVE_KEY, label: '💬 新对话', group: '今天', isDraft: true },
  ...PRESET_CONVERSATIONS,
];
