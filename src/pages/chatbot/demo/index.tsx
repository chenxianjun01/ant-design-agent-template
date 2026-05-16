import {
  ArrowLeftOutlined,
  BarChartOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  CopyOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FormOutlined,
  GlobalOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  PictureOutlined,
  RocketOutlined,
  TableOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Alert,
  message as antdMessage,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import MessageRenderer from '../components/MessageRenderer';
import type { FormSubmitExecutionResult } from '../components/schema/formSubmitAction';
import {
  createMessageItem,
  type IAgentExecutionControl,
  type IAgentExecutionMessageContent,
  type IMessageItem,
  MessageType,
} from '../data';
import type { AgentExecutionControlHandler, FormSubmitHandler } from '../types';
import { copyTextToClipboard } from '../useMessageActions';

const { Title, Text } = Typography;

const sectionTitleMap: Record<string, string> = {
  text: '文本',
  file: '文件',
  image: '图片',
  audio: '音频',
  video: '视频',
  table: '表格',
  chart: '图表',
  form: '表单',
  map: '地图',
  timeline: '时间轴',
  approval: '审批',
  'agent-execution': '执行态',
};

const typeIconMap: Record<string, React.ReactNode> = {
  text: <FileTextOutlined />,
  file: <PaperClipOutlined />,
  image: <PictureOutlined />,
  audio: <CustomerServiceOutlined />,
  video: <VideoCameraOutlined />,
  table: <TableOutlined />,
  chart: <BarChartOutlined />,
  form: <FormOutlined />,
  map: <GlobalOutlined />,
  timeline: <HistoryOutlined />,
  approval: <CheckCircleOutlined />,
  'agent-execution': <RocketOutlined />,
};

const categoryIconMap: Record<string, React.ReactNode> = {
  基础内容: <FileTextOutlined />,
  多媒体: <PictureOutlined />,
  数据展示: <BarChartOutlined />,
  流程与交互: <FormOutlined />,
};

const categories = [
  {
    title: '基础内容',
    description: '最常用的原子化信息承载协议，适用于简单的消息反馈和附件分发。',
    types: ['text', 'file'],
    color: '#1677ff',
  },
  {
    title: '多媒体',
    description: '丰富的流媒体与富文本展示协议，增强 AI 交互的视觉与听觉体验。',
    types: ['image', 'audio', 'video'],
    color: '#722ed1',
  },
  {
    title: '数据展示',
    description: '结构化数据与可视化分析协议，让 AI 输出的结果更加直观和专业。',
    types: ['table', 'chart', 'map'],
    color: '#13c2c2',
  },
  {
    title: '流程与交互',
    description: '复杂任务处理与业务状态流转协议，实现从对话到业务闭环的跨越。',
    types: ['form', 'timeline', 'approval'],
    color: '#fa8c16',
  },
];

const buildDemoMessages = (): IMessageItem[] => [
  createMessageItem({
    role: 'assistant',
    type: MessageType.TEXT,
    content: {
      text: '这是 `text` 类型效果，支持普通文本、强调信息和基础说明内容。',
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.FILE,
    content: {
      title: '附件列表',
      description: '用于展示报告、导出结果和参考文档。',
      files: [
        {
          name: 'analysis-report.pdf',
          url: 'https://example.com/files/analysis-report.pdf',
          size: '240 KB',
          mimeType: 'application/pdf',
          description: '分析报告',
        },
        {
          name: 'raw-data.xlsx',
          url: 'https://example.com/files/raw-data.xlsx',
          size: '128 KB',
          mimeType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          description: '原始数据表',
        },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.IMAGE,
    content: {
      title: '图片结果',
      description: '用于截图、示意图和视觉化结果。',
      images: [
        {
          title: '趋势图',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          alt: '数据趋势图',
          width: 412,
          height: 275,
          description: '适合看单图卡片布局效果',
        },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.AUDIO,
    content: {
      title: '语音结果',
      description: '用于语音回复、播报结果和录音附件。',
      audios: [
        {
          title: '语音摘要',
          url: 'https://www.w3schools.com/html/horse.mp3',
          duration: '00:32',
          transcript: '这是音频转写内容，用于预览播放器和文字转写组合效果。',
        },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.VIDEO,
    content: {
      title: '演示视频',
      description: '用于录屏、结果演示和操作说明。',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      poster:
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
      duration: '01:36',
      format: 'mp4',
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.TABLE,
    content: {
      title: '用户列表',
      description: '适合展示结构化明细数据。',
      rowKey: 'id',
      bordered: true,
      pagination: false,
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '部门',
          dataIndex: 'department',
        },
        {
          title: '标签',
          dataIndex: 'tags',
          valueType: 'tag',
        },
      ],
      dataSource: [
        {
          id: 1,
          name: '张三',
          department: '研发部',
          tags: ['负责人', '北京'],
        },
        {
          id: 2,
          name: '李四',
          department: '产品部',
          tags: ['协作人'],
        },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.CHART,
    content: {
      title: '部门人数统计',
      description: '各部门当前在编人数对比分析。',
      type: 'column',
      xField: 'department',
      yField: 'count',
      height: 240,
      data: [
        { department: '研发部', count: 35 },
        { department: '产品部', count: 18 },
        { department: '运营部', count: 12 },
        { department: '市场部', count: 22 },
        { department: '人事部', count: 8 },
        { department: '财务部', count: 10 },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.FORM,
    content: {
      title: '创建工单',
      description: '适合参数配置。',
      initialValues: { title: '', priority: 'medium', notify: true },
      submitAction: { action: 'callApi', api: 'createTicket' },
    },
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', title: '标题', 'x-component': 'Input' },
        priority: {
          type: 'string',
          title: '优先级',
          enum: ['low', 'medium', 'high'],
          'x-component': 'Select',
        },
        notify: {
          type: 'boolean',
          title: '通知负责人',
          'x-component': 'Switch',
        },
      },
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.MAP,
    content: {
      title: '港口分布',
      description: '适合空间信息。',
      center: [121.4737, 31.2304],
      zoom: 4,
      height: 200,
      markers: [
        {
          key: 'shanghai',
          title: '上海港',
          longitude: 121.4737,
          latitude: 31.2304,
        },
        {
          key: 'ningbo',
          title: '宁波港',
          longitude: 121.5503,
          latitude: 29.8746,
        },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.TIMELINE,
    content: {
      title: '审批过程',
      description: '适合过程回放。',
      items: [
        {
          key: 'step_1',
          time: '2026-05-15 10:00',
          title: '提交申请',
          description: '用户提交采购申请',
          color: 'blue',
          status: 'finish',
        },
        {
          key: 'step_2',
          time: '2026-05-15 10:30',
          title: '主管审批',
          description: '主管审核中',
          color: 'green',
          status: 'process',
        },
      ],
    },
  }),
  createMessageItem({
    role: 'assistant',
    type: MessageType.APPROVAL,
    content: {
      title: '费用审批',
      status: 'pending',
      description: '请确认费用。',
      summary: '待主管审批',
      fields: [
        { label: '申请人', value: '张三' },
        { label: '金额', value: '¥ 12,800' },
      ],
      actions: [
        {
          key: 'approve',
          label: '同意',
          buttonType: 'primary',
          submitAction: {
            action: 'insertMessage',
            message: {
              role: 'assistant',
              type: MessageType.TEXT,
              content: { text: '费用审批：已同意' },
            },
          },
        },
        {
          key: 'reject',
          label: '拒绝',
          danger: true,
          submitAction: {
            action: 'insertMessage',
            message: {
              role: 'assistant',
              type: MessageType.TEXT,
              content: { text: '费用审批：已拒绝' },
            },
          },
        },
      ],
    },
  }),
];

const initialExecutionMessage = createMessageItem({
  role: 'assistant',
  type: MessageType.AGENT_EXECUTION,
  content: {
    title: '危货分析任务',
    description: '正在执行检索与分析',
    status: 'running',
    summary: '已完成知识库检索，正在整理结果',
    startedAt: '2026-05-15T10:00:00.000Z',
    updatedAt: '2026-05-15T10:01:12.000Z',
    steps: [
      {
        key: 'step_1',
        title: '读取用户问题',
        status: 'success',
        startedAt: '2026-05-15T10:00:00.000Z',
        finishedAt: '2026-05-15T10:00:03.000Z',
        duration: '3s',
      },
      {
        key: 'step_2',
        title: '检索知识库',
        status: 'running',
        startedAt: '2026-05-15T10:00:04.000Z',
        tags: ['知识库', '检索'],
      },
      {
        key: 'step_3',
        title: '生成结论',
        status: 'wait',
      },
    ],
    controls: [
      { key: 'stop', label: '停止', action: 'stop', danger: true },
      { key: 'retry', label: '重试', action: 'retry' },
    ],
  },
});

const ChatbotRendererDemoPage: React.FC = () => {
  const { token } = theme.useToken();
  const [executionMessage, setExecutionMessage] = useState<IMessageItem>(
    initialExecutionMessage,
  );
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  const demoMessages = useMemo(() => buildDemoMessages(), []);

  const getDisplayCode = (message: IMessageItem) => {
    const { id, ...displayMessage } = message;
    return JSON.stringify(displayMessage, null, 2);
  };

  const showCode = (message: IMessageItem) => {
    setCurrentCode(getDisplayCode(message));
    setCurrentTitle(`${sectionTitleMap[String(message.type)]} 协议 JSON`);
    setCodeModalVisible(true);
  };

  const copyCode = async () => {
    if (!currentCode.trim()) {
      return;
    }

    try {
      await copyTextToClipboard(currentCode);
      void antdMessage.success('已复制到剪贴板');
    } catch (error) {
      void antdMessage.error(
        error instanceof Error ? error.message : '复制失败，请稍后重试',
      );
    }
  };

  const copyMessageCode = async (message: IMessageItem) => {
    try {
      await copyTextToClipboard(getDisplayCode(message));
      void antdMessage.success(
        `${sectionTitleMap[String(message.type)]} 协议已复制`,
      );
    } catch (error) {
      void antdMessage.error(
        error instanceof Error ? error.message : '复制失败，请稍后重试',
      );
    }
  };

  const handleFormSubmit = useMemo<FormSubmitHandler>(
    () => async (message, values) => {
      void antdMessage.info(
        `${sectionTitleMap[String(message.type)] ?? message.type} 已触发交互`,
      );
      return { status: 'success' } satisfies FormSubmitExecutionResult;
    },
    [],
  );

  const handleAgentExecutionControl = useMemo<AgentExecutionControlHandler>(
    () => async (_message, control) => {
      const normalizedControl = control as IAgentExecutionControl;
      setExecutionMessage((previous) => {
        const content = previous.content as IAgentExecutionMessageContent;
        if (normalizedControl.action === 'stop') {
          return {
            ...previous,
            content: {
              ...content,
              status: 'error',
              summary: '任务已手动停止',
              updatedAt: new Date().toISOString(),
              steps: content.steps.map((step) =>
                step.key === 'step_2'
                  ? { ...step, status: 'error', duration: '68s' }
                  : step,
              ),
            },
          };
        }
        return {
          ...previous,
          content: {
            ...content,
            status: 'success',
            summary: '任务已完成',
            updatedAt: new Date().toISOString(),
            steps: content.steps.map((step) => {
              if (step.key === 'step_2')
                return {
                  ...step,
                  status: 'success',
                  duration: '72s',
                  finishedAt: new Date().toISOString(),
                };
              if (step.key === 'step_3')
                return {
                  ...step,
                  status: 'success',
                  startedAt: new Date().toISOString(),
                  finishedAt: new Date().toISOString(),
                  duration: '5s',
                };
              return step;
            }),
          },
        };
      });
    },
    [],
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerFontSizeSM: 14,
            headerHeightSM: 44,
          },
        },
      }}
    >
      <PageContainer
        header={{
          title: 'AI Agent UI DSL 协议预览',
          subTitle: '一套面向 AI 原生应用的组件协议与渲染引擎',
          extra: [
            <Button
              key="back"
              icon={<ArrowLeftOutlined />}
              onClick={() => history.push('/chatbot')}
            >
              返回聊天室
            </Button>,
          ],
        }}
      >
        <Card style={{ background: '#f2f2f2' }}>
          <Space direction="vertical" size={40} style={{ width: '100%' }}>
            <Alert
              message={
                <Text strong style={{ fontSize: 16 }}>
                  开发者友好
                </Text>
              }
              description="点击卡片右上角的「查看协议」按钮，可以实时查看该组件对应的 DSL 协议内容，方便快速接入。"
              type="info"
              showIcon
              icon={<BulbOutlined />}
              style={{
                borderRadius: 12,
                padding: '20px 24px',
                background: `linear-gradient(135deg, ${token.colorInfoBg} 0%, ${token.colorBgContainer} 100%)`,
                border: `1px solid ${token.colorInfoBorder}`,
              }}
            />

            {categories.map((category) => (
              <div key={category.title}>
                <div
                  style={{
                    marginBottom: 24,
                    padding: '20px 24px',
                    background: token.colorBgContainer,
                    borderRadius: 12,
                    borderLeft: `4px solid ${category.color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${category.color}15`,
                      color: category.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {categoryIconMap[category.title]}
                  </div>
                  <div>
                    <Title
                      level={4}
                      style={{ marginBottom: 4, marginTop: 0, fontSize: 18 }}
                    >
                      {category.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {category.description}
                    </Text>
                  </div>
                </div>
                <Row
                  gutter={[24, 24]}
                  style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                  {demoMessages
                    .filter((m) => category.types.includes(String(m.type)))
                    .map((message) => (
                      <Col
                        key={message.id}
                        xs={24}
                        lg={12}
                        xl={8}
                        style={{ display: 'flex' }}
                      >
                        <Card
                          hoverable
                          bordered={false}
                          styles={{ body: { flex: 1, overflow: 'auto' } }}
                          style={{
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: `1px solid ${token.colorBorderSecondary}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                          }}
                          title={
                            <Space size={8}>
                              <span
                                style={{
                                  color: token.colorPrimary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontSize: 16,
                                }}
                              >
                                {typeIconMap[String(message.type)]}
                              </span>
                              <span style={{ fontWeight: 600, fontSize: 15 }}>
                                {sectionTitleMap[String(message.type)]}
                              </span>
                            </Space>
                          }
                          extra={
                            <Space size={12}>
                              <Tag
                                bordered={false}
                                color="default"
                                style={{ fontSize: 12 }}
                              >
                                {message.type}
                              </Tag>
                              <Tooltip title="查看协议代码">
                                <CodeOutlined
                                  style={{
                                    color: token.colorTextSecondary,
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => showCode(message)}
                                />
                              </Tooltip>
                            </Space>
                          }
                        >
                          <MessageRenderer
                            message={message}
                            onFormSubmit={handleFormSubmit}
                          />
                        </Card>
                      </Col>
                    ))}
                </Row>
              </div>
            ))}

            <div>
              <div
                style={{
                  marginBottom: 24,
                  padding: '20px 24px',
                  background: token.colorBgContainer,
                  borderRadius: 12,
                  borderLeft: `4px solid ${token.colorPrimary}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${token.colorPrimary}15`,
                    color: token.colorPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  <RocketOutlined />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <Title
                      level={4}
                      style={{ marginBottom: 4, marginTop: 0, fontSize: 18 }}
                    >
                      任务执行态
                    </Title>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      实时渲染与状态控制演示
                    </Text>
                  </div>
                  <Badge status="processing" text="实时渲染中" />
                </div>
              </div>

              <Card
                bordered={false}
                style={{
                  borderRadius: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
                title={
                  <Space size={8}>
                    <span
                      style={{
                        color: token.colorPrimary,
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {typeIconMap['agent-execution']}
                    </span>
                    <span style={{ fontWeight: 700 }}>
                      {sectionTitleMap['agent-execution']}
                    </span>
                  </Space>
                }
                extra={
                  <Space size={12}>
                    <Tag bordered={false} color="blue">
                      {MessageType.AGENT_EXECUTION}
                    </Tag>
                    <Tooltip title="查看协议代码">
                      <CodeOutlined
                        style={{
                          color: token.colorTextSecondary,
                          cursor: 'pointer',
                        }}
                        onClick={() => showCode(executionMessage)}
                      />
                    </Tooltip>
                  </Space>
                }
              >
                <MessageRenderer
                  message={executionMessage}
                  onFormSubmit={handleFormSubmit}
                  onAgentExecutionControl={handleAgentExecutionControl}
                />
              </Card>
            </div>
          </Space>
        </Card>

        <Modal
          title={currentTitle}
          open={codeModalVisible}
          onCancel={() => setCodeModalVisible(false)}
          footer={[
            <Button
              key="copy"
              icon={<CopyOutlined />}
              onClick={() => {
                void copyCode();
              }}
            >
              复制代码
            </Button>,
            <Button
              key="close"
              type="primary"
              onClick={() => setCodeModalVisible(false)}
            >
              关闭
            </Button>,
          ]}
          width={720}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <SyntaxHighlighter
              language="json"
              style={oneLight}
              customStyle={{
                margin: 0,
                padding: '24px',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {currentCode}
            </SyntaxHighlighter>
          </div>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default ChatbotRendererDemoPage;
