import {
  type IAgentExecutionMessageContent,
  type IApprovalMessageContent,
  type IAudioMessageContent,
  type IChartMessageContent,
  type IFileMessageContent,
  type IFormMessageContent,
  type IImageMessageContent,
  type IMapMessageContent,
  type IMessageItemDraft,
  type ITableMessageContent,
  type ITimelineMessageContent,
  MessageType,
  stringifyStructuredMessage,
} from './data';
import type { MockChartType } from './service';

export const createMockTextPayload = (
  prompt: string,
  pickRandom: <T>(items: readonly T[]) => T,
): string => {
  const samples = [
    `以下是本地 mock 文本响应。\n\n你刚才的问题是：**${prompt || '未提供内容'}**。\n\n- 当前链路已支持 Markdown\n- 后续可以继续扩展引用卡片、代码块、操作按钮`,
    `我现在运行在本地 mock provider。\n\n这条消息用于验证纯文本渲染、打字机动画以及 Markdown 解析。\n\n\`\`\`ts\nconst mode = 'mock';\nconsole.log(mode);\n\`\`\``,
    `<think>先判断用户是否需要结构化结果；如果只是普通问答，则直接返回文本。</think>\n这里是文本类型消息，适合验证 ` +
      '`XMarkdown`' +
      ` 与现有对话气泡样式。`,
  ];

  return pickRandom(samples);
};

export const createMockFilePayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.FILE,
    content: {
      title: '本地 Mock 文件',
      description: `根据“${prompt || '未提供内容'}”整理出的交付文件`,
      files: [
        {
          key: 'prd',
          name: 'agent-ui-prd.pdf',
          url: 'https://example.com/files/agent-ui-prd.pdf',
          size: '2.4 MB',
          mimeType: 'application/pdf',
          description: '需求文档与交互说明',
          actions: [
            {
              key: 'receipt',
              label: '记录下载回执',
              submitAction: {
                action: 'insertMessage',
                message: {
                  role: 'assistant',
                  type: MessageType.TEXT,
                  content: {
                    text: '已记录文件 {{fileName}} 的下载回执。',
                  },
                },
              },
            },
          ],
        },
        {
          key: 'report',
          name: 'release-checklist.xlsx',
          url: 'https://example.com/files/release-checklist.xlsx',
          size: '680 KB',
          mimeType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          description: '发布检查清单',
        },
      ],
    } satisfies IFileMessageContent,
  });

export const createMockImagePayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.IMAGE,
    content: {
      title: '本地 Mock 图片',
      description: `围绕“${prompt || '未提供内容'}”生成的视觉样例`,
      images: [
        {
          key: 'cover',
          title: '主视觉',
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
          alt: 'workspace',
          description: '用于验证图片预览与说明文案',
          actions: [
            {
              key: 'caption',
              label: '生成图片解读',
              submitAction: {
                action: 'request',
                promptTemplate:
                  '请为图片 {{imageTitle}} 生成简短解读，地址：{{imageUrl}}。',
                mockType: 'text',
              },
            },
          ],
        },
        {
          key: 'detail',
          title: '细节截图',
          url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
          alt: 'code',
          description: '用于验证多图并排展示',
        },
      ],
    } satisfies IImageMessageContent,
  });

export const createMockAudioPayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.AUDIO,
    content: {
      title: '本地 Mock 音频',
      description: `围绕“${prompt || '未提供内容'}”整理出的语音播报`,
      audios: [
        {
          key: 'briefing',
          title: '任务播报',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          duration: '00:32',
          transcript: '这里是本地 mock 音频文案，用于验证播放器与转写展示。',
          actions: [
            {
              key: 'summary',
              label: '提取音频摘要',
              submitAction: {
                action: 'request',
                promptTemplate:
                  '请根据音频转写生成摘要：标题={{audioTitle}}，内容={{transcript}}。',
                mockType: 'text',
              },
            },
          ],
        },
      ],
    } satisfies IAudioMessageContent,
  });

export const createMockTablePayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.TABLE,
    content: {
      title: '本地 Mock 表格',
      description: `根据问题“${prompt || '未提供内容'}”生成的演示数据`,
      columns: [
        { title: '任务', dataIndex: 'taskName' },
        { title: '负责人', dataIndex: 'owner' },
        { title: '进度', dataIndex: 'progress', valueType: 'percent' },
        { title: '状态', dataIndex: 'status', valueType: 'tag' },
        { title: '更新时间', dataIndex: 'updatedAt', valueType: 'dateTime' },
      ],
      dataSource: [
        {
          id: 'task-1',
          taskName: '接入 MessageRenderer',
          owner: '前端',
          progress: 100,
          status: ['已完成'],
          updatedAt: '2026-04-17 10:30:00',
        },
        {
          id: 'task-2',
          taskName: '联调本地 Mock Provider',
          owner: '前端',
          progress: 80,
          status: ['进行中'],
          updatedAt: '2026-04-17 10:45:00',
        },
        {
          id: 'task-3',
          taskName: '收口消息工厂',
          owner: '架构',
          progress: 60,
          status: ['待联调'],
          updatedAt: '2026-04-18 13:00:00',
        },
      ],
      rowKey: 'id',
    } satisfies ITableMessageContent,
    schema: {
      type: 'object',
      'x-component': 'Table',
      'x-component-props': {
        size: 'small',
      },
    },
  });

export const createMockChartPayload = (
  prompt: string,
  pickRandom: <T>(items: readonly T[]) => T,
  forcedChartType?: MockChartType,
): string => {
  const chartSamples: Array<
    IMessageItemDraft & {
      type: MessageType.CHART;
      content: IChartMessageContent;
    }
  > = [
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '近七日调用趋势',
        description: `折线图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'line',
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        height: 240,
        data: [
          { date: '04-11', value: 120, category: '推理' },
          { date: '04-12', value: 156, category: '推理' },
          { date: '04-13', value: 132, category: '推理' },
          { date: '04-11', value: 88, category: '工具调用' },
          { date: '04-12', value: 96, category: '工具调用' },
          { date: '04-13', value: 128, category: '工具调用' },
        ],
      },
      schema: { type: 'object', 'x-component': 'LineChart' },
    },
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '模块耗时分布',
        description: `柱状图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'column',
        xField: 'module',
        yField: 'duration',
        height: 240,
        data: [
          { module: 'Planner', duration: 180 },
          { module: 'Retriever', duration: 260 },
          { module: 'Renderer', duration: 140 },
          { module: 'Tool Call', duration: 320 },
        ],
      },
      schema: { type: 'object', 'x-component': 'ColumnChart' },
    },
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '消息类型占比',
        description: `饼图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'pie',
        angleField: 'value',
        colorField: 'name',
        height: 240,
        data: [
          { name: 'text', value: 48 },
          { name: 'table', value: 20 },
          { name: 'chart', value: 18 },
          { name: 'form', value: 14 },
        ],
      },
      schema: { type: 'object', 'x-component': 'PieChart' },
    },
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '稳定性水位区间',
        description: `面积图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'area',
        xField: 'date',
        yField: 'ratio',
        seriesField: 'metric',
        height: 240,
        data: [
          { date: '04-11', ratio: 0.96, metric: '成功率' },
          { date: '04-12', ratio: 0.975, metric: '成功率' },
          { date: '04-13', ratio: 0.982, metric: '成功率' },
          { date: '04-11', ratio: 0.88, metric: 'SLA' },
          { date: '04-12', ratio: 0.91, metric: 'SLA' },
          { date: '04-13', ratio: 0.94, metric: 'SLA' },
        ],
      },
      schema: { type: 'object', 'x-component': 'AreaChart' },
    },
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '团队处理效率对比',
        description: `条形图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'bar',
        xField: 'value',
        yField: 'team',
        colorField: 'team',
        height: 240,
        data: [
          { team: '前端', value: 21 },
          { team: '后端', value: 18 },
          { team: '测试', value: 12 },
          { team: '运维', value: 15 },
        ],
      },
      schema: { type: 'object', 'x-component': 'BarChart' },
    },
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '能力维度雷达图',
        description: `雷达图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'radar',
        xField: 'dimension',
        yField: 'score',
        colorField: 'role',
        height: 260,
        data: [
          { role: 'Agent', dimension: '规划', score: 84 },
          { role: 'Agent', dimension: '执行', score: 92 },
          { role: 'Agent', dimension: '稳定性', score: 88 },
          { role: 'Agent', dimension: '可解释性', score: 76 },
          { role: 'Baseline', dimension: '规划', score: 68 },
          { role: 'Baseline', dimension: '执行', score: 74 },
          { role: 'Baseline', dimension: '稳定性', score: 79 },
          { role: 'Baseline', dimension: '可解释性', score: 70 },
        ],
      },
      schema: { type: 'object', 'x-component': 'RadarChart' },
    },
    {
      role: 'assistant',
      type: MessageType.CHART,
      content: {
        title: '请求量与成功率双轴图',
        description: `双轴图 mock，问题关键词：${prompt || '未提供内容'}`,
        type: 'dualAxes',
        xField: 'date',
        yField: ['requests', 'successRate'],
        height: 260,
        data: [
          [
            { date: '04-11', requests: 320 },
            { date: '04-12', requests: 410 },
            { date: '04-13', requests: 368 },
          ],
          [
            { date: '04-11', successRate: 0.94 },
            { date: '04-12', successRate: 0.965 },
            { date: '04-13', successRate: 0.972 },
          ],
        ],
        config: {
          children: [
            { type: 'interval', yField: 'requests' },
            { type: 'line', yField: 'successRate' },
          ],
        },
      },
      schema: { type: 'object', 'x-component': 'DualAxesChart' },
    },
  ];

  const selectedChart =
    chartSamples.find((item) => item.content.type === forcedChartType) ??
    pickRandom(chartSamples);

  return stringifyStructuredMessage(selectedChart);
};

export const createMockFormPayload = (
  prompt: string,
  pickRandom: <T>(items: readonly T[]) => T,
): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.FORM,
    content: {
      title: '本地 Mock 表单',
      description: `用于验证 form 类型分发，问题关键词：${prompt || '未提供内容'}`,
      initialValues: {
        applicant: '张三',
        topic: '智能体消息联调',
        priority: 'high',
        needNotify: true,
        planDate: '2026-04-18',
      },
      submitAction: pickRandom([
        {
          action: 'request',
          promptTemplate:
            '我已提交工单，请根据以下字段生成处理建议：申请人={{applicant}}，主题={{topic}}，优先级={{priority}}，计划日期={{planDate}}。',
          mockType: 'text',
        },
        {
          action: 'insertMessage',
          message: {
            role: 'assistant',
            type: MessageType.TABLE,
            content: {
              title: '{{applicant}} 的提交结果卡片',
              description: '主题：{{topic}}，优先级：{{priority}}',
              columns: [
                { title: '字段', dataIndex: 'field' },
                { title: '说明', dataIndex: 'description' },
              ],
              dataSource: [
                { field: '申请人', description: '{{applicant}}' },
                { field: '主题', description: '{{topic}}' },
                { field: '优先级', description: '{{priority}}' },
                { field: '计划日期', description: '{{planDate}}' },
              ],
              rowKey: 'field',
            },
          },
        },
        {
          action: 'requestAndInsert',
          promptTemplate:
            '系统已生成提交确认卡片。请继续根据工单信息给出风险评估：申请人={{applicant}}，主题={{topic}}，优先级={{priority}}。',
          mockType: 'text',
          message: {
            role: 'assistant',
            type: MessageType.TEXT,
            content: {
              text: '提交成功。{{applicant}} 的 {{topic}} 已登记，当前优先级为 {{priority}}，系统正在继续分析。',
            },
          },
        },
        {
          action: 'callApi',
          api: 'createTicketWithRisk',
          retryable: true,
          errorMessages: {
            RATE_LIMITED: '当前高优工单提交过快，请稍后再试。',
            VALIDATION_ERROR: '表单字段校验未通过，请调整后再提交。',
          },
          beforeRequest: [
            {
              type: 'trackEvent',
              event: 'form_submit_started',
              properties: {
                api: 'createTicketWithRisk',
                applicant: '{{applicant}}',
                priority: '{{priority}}',
              },
            },
            {
              type: 'insertMessage',
              message: {
                role: 'assistant',
                type: MessageType.TEXT,
                content: {
                  text: '正在调用工单接口，准备为 {{applicant}} 创建 {{topic}}。',
                },
              },
            },
          ],
          afterSuccess: [
            { type: 'refreshConversation' },
            {
              type: 'trackEvent',
              event: 'form_submit_succeeded',
              properties: {
                api: 'createTicketWithRisk',
                ticketId: '{{ticketId}}',
                applicant: '{{applicant}}',
                priority: '{{priority}}',
              },
            },
            {
              type: 'insertMessage',
              message: {
                role: 'assistant',
                type: MessageType.TEXT,
                content: {
                  text: '接口执行完成，工单 {{ticketId}} 已进入待处理队列，负责人：{{owner}}。',
                },
              },
            },
            {
              type: 'request',
              promptTemplate:
                '工单 {{ticketId}} 已创建成功。请基于申请人 {{applicant}}、主题 {{topic}} 和优先级 {{priority}} 输出一份后续处理建议。',
              mockType: 'text',
            },
          ],
          payload: {
            applicant: '{{applicant}}',
            topic: '{{topic}}',
            priority: '{{priority}}',
            planDate: '{{planDate}}',
          },
          onSuccessMessage: {
            role: 'assistant',
            type: MessageType.TABLE,
            content: {
              title: 'API 执行结果',
              description: '工单接口已成功执行',
              columns: [
                { title: '字段', dataIndex: 'field' },
                { title: '值', dataIndex: 'value' },
              ],
              dataSource: [
                { field: '申请人', value: '{{applicant}}' },
                { field: '主题', value: '{{topic}}' },
                { field: '优先级', value: '{{priority}}' },
                { field: '工单号', value: '{{ticketId}}' },
                { field: '处理状态', value: '{{status}}' },
              ],
              rowKey: 'field',
            },
          },
          onErrorMessage: {
            role: 'assistant',
            type: MessageType.TEXT,
            content: {
              text: 'API 调用失败：{{apiMessage}}',
            },
          },
        },
      ]),
    } satisfies IFormMessageContent,
    schema: {
      type: 'object',
      required: ['applicant', 'topic', 'priority'],
      properties: {
        applicant: { type: 'string', title: '申请人', 'x-component': 'Input' },
        topic: {
          type: 'string',
          title: '主题',
          'x-component': 'TextArea',
          'x-component-props': { placeholder: '请输入本次提交的主题或诉求' },
        },
        priority: {
          type: 'string',
          title: '优先级',
          enum: ['low', 'medium', 'high'],
          'x-component': 'Select',
        },
        estimateHours: {
          type: 'number',
          title: '预计工时',
          'x-component': 'InputNumber',
          'x-component-props': { min: 1, max: 40 },
        },
        planDate: {
          type: 'string',
          title: '计划日期',
          'x-component': 'DatePicker',
        },
        needNotify: {
          type: 'boolean',
          title: '是否通知相关成员',
          'x-component': 'Switch',
        },
      },
    },
  });

export const createMockMapPayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.MAP,
    content: {
      title: '本地 Mock 地图',
      description: `围绕“${prompt || '未提供内容'}”展示的地理点位`,
      center: [121.4737, 31.2304],
      zoom: 10,
      markers: [
        {
          key: 'shanghai',
          title: '上海办公室',
          longitude: 121.4737,
          latitude: 31.2304,
          description: '主会场',
          clickAction: {
            key: 'office-detail',
            label: '查看点位详情',
            submitAction: {
              action: 'request',
              promptTemplate:
                '请基于地图点位生成详情说明：{{markerTitle}}，坐标={{longitude}},{{latitude}}，备注={{markerDescription}}。',
              mockType: 'text',
            },
          },
        },
        {
          key: 'pudong',
          title: '浦东机房',
          longitude: 121.5444,
          latitude: 31.2211,
          description: '主要服务节点',
        },
      ],
    } satisfies IMapMessageContent,
  });

export const createMockTimelinePayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.TIMELINE,
    content: {
      title: '智能体执行时间轴',
      description: `围绕“${prompt || '未提供内容'}”生成的流程进展`,
      items: [
        {
          title: '解析用户意图',
          description: '识别问题类型并选择合适的处理策略',
          time: '09:30',
          status: 'finish',
          tags: ['planner', 'intent'],
        },
        {
          title: '检索上下文',
          description: '拉取相关消息协议与页面渲染上下文',
          time: '09:31',
          status: 'finish',
          tags: ['retrieval'],
        },
        {
          title: '生成结构化结果',
          description: '已形成时间轴消息，可直接插入对话流',
          time: '09:32',
          status: 'process',
          tags: ['renderer', 'timeline'],
        },
      ],
    } satisfies ITimelineMessageContent,
  });

export const createMockApprovalPayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.APPROVAL,
    content: {
      title: '审批卡片摘要',
      description: `围绕“${prompt || '未提供内容'}”生成的审批信息`,
      summary: '当前申请已完成智能体预审，等待技术负责人确认。',
      status: 'pending',
      applicant: '张三',
      approver: '研发负责人',
      tags: ['高优先级', '发布申请'],
      fields: [
        {
          key: 'topic',
          label: '申请主题',
          value: prompt || '智能体界面迭代',
          emphasis: true,
        },
        {
          key: 'impactScope',
          label: '影响范围',
          value: 'chatbot UI / structured message',
        },
        {
          key: 'deadline',
          label: '期望完成时间',
          value: '2026-04-18 18:00',
        },
      ],
      actions: [
        {
          key: 'approve',
          label: '通过并通知',
          buttonType: 'primary',
          submitAction: {
            action: 'callApi',
            api: 'notifyMembers',
            payload: {
              topic: '{{topic}}',
              applicant: '{{applicant}}',
              status: 'approved',
            },
            onSuccessMessage: {
              role: 'assistant',
              type: MessageType.TEXT,
              content: {
                text: '审批已通过，已向相关成员发送“{{topic}}”通知。',
              },
            },
            afterSuccess: [
              {
                type: 'trackEvent',
                event: 'approval_action_completed',
                properties: {
                  action: 'approve',
                  topic: '{{topic}}',
                  applicant: '{{applicant}}',
                },
              },
            ],
          },
        },
        {
          key: 'ask-agent',
          label: '生成处理建议',
          submitAction: {
            action: 'request',
            promptTemplate:
              '请基于审批卡片内容生成处理建议：主题={{topic}}，申请人={{applicant}}，当前处理人={{approver}}，影响范围={{impactScope}}。',
            mockType: 'text',
          },
        },
      ],
    } satisfies IApprovalMessageContent,
  });

export const createMockAgentExecutionPayload = (prompt: string): string =>
  stringifyStructuredMessage({
    role: 'assistant',
    type: MessageType.AGENT_EXECUTION,
    content: {
      title: '智能体执行状态',
      description: `围绕“${prompt || '未提供内容'}”生成的执行态反馈`,
      summary: '已完成问题拆解与上下文检索，正在生成最终回答。',
      status: 'running',
      startedAt: '09:30',
      updatedAt: '09:32',
      steps: [
        {
          key: 'intent',
          title: '解析用户意图',
          description: '识别问题范围并确定输出形式。',
          status: 'success',
          startedAt: '09:30',
          finishedAt: '09:30',
          duration: '12ms',
          tags: ['planner', 'intent'],
        },
        {
          key: 'retrieval',
          title: '检索上下文',
          description: '读取相关实现文件与历史变更记录。',
          status: 'success',
          startedAt: '09:31',
          finishedAt: '09:31',
          duration: '84ms',
          tags: ['retrieval'],
        },
        {
          key: 'compose',
          title: '生成回答',
          description: '组织结构化结果并准备回填对话流。',
          status: 'running',
          startedAt: '09:32',
          tags: ['generator', 'response'],
        },
      ],
      controls: [
        {
          key: 'stop-execution',
          label: '停止',
          action: 'stop',
          danger: true,
        },
        {
          key: 'retry-execution',
          label: '重试',
          action: 'retry',
        },
        {
          key: 'continue-execution',
          label: '继续',
          action: 'continue',
          buttonType: 'primary',
        },
      ],
    } satisfies IAgentExecutionMessageContent,
  });
