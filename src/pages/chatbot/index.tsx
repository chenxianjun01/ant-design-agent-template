import { UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Bubble, Conversations, Sender, XProvider } from '@ant-design/x';
import type {
  BubbleItemType,
  BubbleListProps,
} from '@ant-design/x/es/bubble/interface';
import XMarkdown from '@ant-design/x-markdown';
import { useXChat } from '@ant-design/x-sdk';
import { Avatar, Card, Segmented, Space, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { buildBubbleItems } from './buildBubbleItems';
import {
  buildRequestParams,
  executeFormSubmitAction,
} from './components/schema/formSubmitAction';
import useLocalStructuredMessages from './components/schema/useLocalStructuredMessages';
import {
  applySentMessageToConversation,
  createDraftConversation,
  deleteConversationItem,
  refreshConversationItem,
} from './conversationHelpers';
import type { ConversationItem, IMessageItem, ParsedMessage } from './data';
import { parseChatMessage } from './parser';
import {
  CHAT_PROVIDER_MODE,
  type ChatMessage,
  type ChatRequestParams,
  createChatProvider,
  createSubmitActionAdapter,
  MOCK_CHART_TYPES,
  MOCK_MESSAGE_TYPES,
  type MockChartType,
  type MockMessageType,
} from './service';
import { useStyles } from './style';

const WELCOME_TEXT = '🤖 你好，有什么可以帮你？';

const MOCK_MESSAGE_TYPE_META: Record<MockMessageType, { label: string }> = {
  text: {
    label: '文本',
  },
  file: {
    label: '文件',
  },
  image: {
    label: '图片',
  },
  audio: {
    label: '音频',
  },
  table: {
    label: '表格',
  },
  chart: {
    label: '图表',
  },
  form: {
    label: '表单',
  },
  map: {
    label: '地图',
  },
  timeline: {
    label: '时间轴',
  },
  approval: {
    label: '审批',
  },
};

const MOCK_CHART_TYPE_META: Record<MockChartType, string> = {
  line: '折线图',
  column: '柱状图',
  pie: '饼图',
  area: '面积图',
  bar: '条形图',
  radar: '雷达图',
  dualAxes: '双轴图',
};

const TypewriterTitle: React.FC = () => {
  const { styles } = useStyles();
  const [index, setIndex] = useState(0);
  const done = index >= WELCOME_TEXT.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => {
        if (i >= WELCOME_TEXT.length) {
          clearInterval(timer);
          return i;
        }
        return i + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {WELCOME_TEXT.slice(0, index)}
      {!done && <span className={styles.cursor}>|</span>}
    </>
  );
};

const STREAMING_ACTIVE = { hasNextChunk: true, enableAnimation: true };
const STREAMING_IDLE = { hasNextChunk: false, enableAnimation: true };

const roleConfig: BubbleListProps['role'] = {
  user: {
    placement: 'end',
    avatar: <Avatar icon={<UserOutlined />} />,
  },
  ai: {
    placement: 'start',
    avatar: (
      <Avatar
        style={{
          background: 'transparent',
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🤖
      </Avatar>
    ),
    typing: { effect: 'typing', step: 2, interval: 20 },
    contentRender: (
      content: React.ReactNode,
      info: { status?: string; loading?: boolean },
    ) => {
      if (info?.loading || !content) return undefined;
      if (typeof content !== 'string') return content;
      return (
        <XMarkdown
          streaming={
            info?.status === 'updating' ? STREAMING_ACTIVE : STREAMING_IDLE
          }
        >
          {content}
        </XMarkdown>
      );
    },
  },
};

const ChatbotPage: React.FC = () => {
  const { styles } = useStyles();

  const [conversations, setConversations] = useState<ConversationItem[]>([
    { key: 'default', label: '💬 新对话', group: '今天', isDraft: true },
    {
      key: 'preset-1',
      label: '🧩 Ant Design 的 Form 表单如何做联动校验？',
      group: '今天',
    },
    {
      key: 'preset-2',
      label: '📋 ProTable 如何自定义工具栏按钮？',
      group: '今天',
    },
    {
      key: 'preset-3',
      label: '🎨 如何用 antd-style 实现暗色主题切换？',
      group: '昨天',
    },
    {
      key: 'preset-4',
      label: '🗂️ ProLayout 侧边菜单如何动态生成？',
      group: '昨天',
    },
    {
      key: 'preset-5',
      label: '📊 Ant Design Charts 折线图数据格式',
      group: '昨天',
    },
    {
      key: 'preset-6',
      label: '🚀 Ant Design Pro 如何接入后端权限系统？',
      group: '更早',
    },
    {
      key: 'preset-7',
      label: '🔍 ProForm 中 Select 远程搜索怎么实现？',
      group: '更早',
    },
    {
      key: 'preset-8',
      label: '⚙️ Ant Design Token 定制主题最佳实践',
      group: '更早',
    },
  ]);
  const [activeKey, setActiveKey] = useState<string>('default');
  const [inputValue, setInputValue] = useState('');
  const [mockType, setMockType] = useState<MockMessageType>('text');
  const [mockChartType, setMockChartType] = useState<MockChartType>('line');
  const {
    structuredMessages,
    insertStructuredMessage,
    clearStructuredMessages,
    removeConversationStructuredMessages,
  } = useLocalStructuredMessages({
    conversationKey: activeKey,
  });
  const submitActionAdapter = useMemo(() => createSubmitActionAdapter(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider = useMemo(() => createChatProvider() as any, []);
  const { onRequest, abort, isRequesting, parsedMessages } = useXChat<
    ChatMessage,
    ParsedMessage,
    ChatRequestParams
  >({
    provider,
    conversationKey: activeKey,
    parser: parseChatMessage,
    requestPlaceholder: { role: 'assistant', content: '' },
  });

  const handleFormSubmit = (
    submittedMessage: IMessageItem,
    values: Record<string, unknown>,
  ) => {
    return executeFormSubmitAction({
      isRemoteMode: CHAT_PROVIDER_MODE === 'remote',
      submittedMessage,
      values,
      insertStructuredMessage,
      clearStructuredMessages,
      refreshConversation: () => {
        const refreshedAt = new Date().toISOString();
        setConversations((previous) =>
          refreshConversationItem(previous, activeKey, refreshedAt),
        );
      },
      onRequest,
      submitActionAdapter,
    });
  };

  const sendMessage = (
    content: string,
    options?: {
      mockType?: MockMessageType;
      mockChartType?: MockChartType;
    },
  ) => {
    setInputValue('');
    const sentAt = new Date().toISOString();
    setConversations((prev) =>
      applySentMessageToConversation(prev, activeKey, content, sentAt),
    );
    onRequest(
      buildRequestParams({
        isRemoteMode: CHAT_PROVIDER_MODE === 'remote',
        messages: [{ role: 'user', content }],
        mockType: options?.mockType,
        mockChartType: options?.mockChartType,
      }),
    );
  };

  const handleSenderSubmit = (content: string) => {
    sendMessage(content, {
      mockType,
      mockChartType: mockType === 'chart' ? mockChartType : undefined,
    });
  };

  const newChat = () => {
    const key = crypto.randomUUID();
    setConversations((prev) => [createDraftConversation(key), ...prev]);
    setActiveKey(key);
  };

  const bubbleItems = useMemo<BubbleItemType[]>(
    () =>
      buildBubbleItems({
        activeKey,
        parsedMessages,
        structuredMessages,
        onFormSubmit: handleFormSubmit,
      }),
    [activeKey, parsedMessages, structuredMessages],
  );

  const hasMessages = parsedMessages.length > 0;
  const showMockToolbar = CHAT_PROVIDER_MODE !== 'remote';
  const currentMockTypeLabel =
    mockType === 'chart'
      ? `${MOCK_MESSAGE_TYPE_META[mockType].label} · ${MOCK_CHART_TYPE_META[mockChartType]}`
      : MOCK_MESSAGE_TYPE_META[mockType].label;

  return (
    <PageContainer
      ghost
      childrenContentStyle={{
        paddingBlock: 0,
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Card
        variant="borderless"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        styles={{
          body: {
            flex: 1,
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <XProvider>
          <div className={styles.layout}>
            <div className={styles.sidebar}>
              <Conversations
                items={conversations}
                activeKey={activeKey}
                onActiveChange={setActiveKey}
                groupable
                menu={(conversation) => ({
                  items: [{ key: 'delete', label: '删除', danger: true }],
                  onClick: ({ key }) => {
                    if (key === 'delete') {
                      removeConversationStructuredMessages(conversation.key);
                      setConversations((prev) => {
                        const next = deleteConversationItem(
                          prev,
                          conversation.key,
                          activeKey,
                        );
                        setActiveKey(next.nextActiveKey);
                        return next.conversations;
                      });
                    }
                  },
                })}
                creation={{ onClick: newChat, label: '新建对话' }}
              />
            </div>

            <div className={styles.main}>
              {hasMessages && (
                <div className={styles.messages}>
                  <Bubble.List
                    items={bubbleItems}
                    role={roleConfig}
                    autoScroll
                    styles={{ root: { maxWidth: 940 } }}
                  />
                </div>
              )}

              <div
                className={hasMessages ? styles.footer : styles.footerCenter}
              >
                {!hasMessages && (
                  <div className={styles.welcomeTitle}>
                    <TypewriterTitle />
                  </div>
                )}
                {showMockToolbar && (
                  <div className={styles.mockToolbarCompact}>
                    <Space size={[12, 8]} wrap>
                      <Tag color="blue">Mock</Tag>
                      <Typography.Text type="secondary">
                        返回类型
                      </Typography.Text>
                      <Segmented<MockMessageType>
                        size="small"
                        value={mockType}
                        onChange={(value) => setMockType(value)}
                        options={MOCK_MESSAGE_TYPES.map((type) => ({
                          label: MOCK_MESSAGE_TYPE_META[type].label,
                          value: type,
                        }))}
                      />
                      {mockType === 'chart' && (
                        <>
                          <Typography.Text type="secondary">
                            图表类型
                          </Typography.Text>
                          <Segmented<MockChartType>
                            size="small"
                            value={mockChartType}
                            onChange={(value) => setMockChartType(value)}
                            options={MOCK_CHART_TYPES.map((type) => ({
                              label: MOCK_CHART_TYPE_META[type],
                              value: type,
                            }))}
                          />
                        </>
                      )}
                    </Space>
                  </div>
                )}
                <Sender
                  value={inputValue}
                  onChange={setInputValue}
                  loading={isRequesting}
                  onSubmit={handleSenderSubmit}
                  onCancel={abort}
                  placeholder={`输入消息，按 Enter 发送，当前返回 ${currentMockTypeLabel}...`}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  style={{ maxWidth: 940, width: '100%' }}
                  styles={{ input: { paddingBlock: 0 } }}
                />
              </div>
            </div>
          </div>
        </XProvider>
      </Card>
    </PageContainer>
  );
};

export default ChatbotPage;
