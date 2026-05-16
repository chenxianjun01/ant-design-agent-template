import {
  ArrowLeftOutlined,
  CompassOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Bubble, Conversations, Sender, XProvider } from '@ant-design/x';
import type {
  BubbleItemType,
  BubbleListProps,
} from '@ant-design/x/es/bubble/interface';
import xZhCN from '@ant-design/x/es/locale/zh_CN';
import XMarkdown from '@ant-design/x-markdown';
import { useXChat } from '@ant-design/x-sdk';
import { history } from '@umijs/max';
import { Avatar, Button, Card, Segmented, Space, Tag, Typography } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { buildBubbleItems } from './buildBubbleItems';
import {
  loadChatbotWorkspaceSnapshot,
  type PersistedParsedChatRecord,
} from './chatPersistence';
import RuntimeDebugPanel from './components/RuntimeDebugPanel';
import useLocalStructuredMessages from './components/schema/useLocalStructuredMessages';
import {
  DEFAULT_ACTIVE_KEY,
  DEFAULT_CONVERSATIONS,
} from './conversationPresets';
import type { ConversationItem, ParsedMessage } from './data';
import { parseChatMessage } from './parser';
import {
  type ChatMessage,
  type ChatRequestParams,
  createChatProvider,
  createSubmitActionAdapter,
  type MockChartType,
  type MockMessageType,
} from './service';
import { useStyles } from './style';
import { useChatActions } from './useChatActions';
import { useChatMessagePersistence } from './useChatMessagePersistence';
import { useConversationController } from './useConversationController';
import { useMockToolbar } from './useMockToolbar';
import { useRuntimeExecutionSync } from './useRuntimeExecutionSync';
import { useStarterPromptBootstrap } from './useStarterPromptBootstrap';
import { useWorkspaceSnapshotPersistence } from './useWorkspaceSnapshotPersistence';

const WELCOME_TEXT = '🤖 你好，有什么可以帮你？';

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
const X_SENDER_LOCALE = {
  ...xZhCN,
  Sender: {
    ...xZhCN.Sender,
    stopLoading: '停止',
  },
};

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
        <span>
          <XMarkdown
            streaming={
              info?.status === 'updating' ? STREAMING_ACTIVE : STREAMING_IDLE
            }
          >
            {content}
          </XMarkdown>
          {info?.status === 'updating' && (
            <span className="chatbot-stream-cursor">|</span>
          )}
        </span>
      );
    },
  },
};

const ChatbotPage: React.FC = () => {
  const { styles } = useStyles();
  const initialSnapshotRef = useRef(loadChatbotWorkspaceSnapshot());

  const [conversations, setConversations] = useState<ConversationItem[]>(
    initialSnapshotRef.current?.conversations?.length
      ? initialSnapshotRef.current.conversations
      : DEFAULT_CONVERSATIONS,
  );
  const [activeKey, setActiveKey] = useState<string>(() => {
    const snapshot = initialSnapshotRef.current;
    const candidateKey = snapshot?.activeKey;
    const availableKeys = new Set(
      snapshot?.conversations?.map((conversation) => conversation.key) ??
        DEFAULT_CONVERSATIONS.map((conversation) => conversation.key),
    );

    return candidateKey && availableKeys.has(candidateKey)
      ? candidateKey
      : DEFAULT_ACTIVE_KEY;
  });
  const [inputValue, setInputValue] = useState('');
  const [mockType, setMockType] = useState<MockMessageType>(
    initialSnapshotRef.current?.mockType ?? 'text',
  );
  const [mockChartType, setMockChartType] = useState<MockChartType>(
    initialSnapshotRef.current?.mockChartType ?? 'line',
  );
  const [bootstrappedConversationKeys, setBootstrappedConversationKeys] =
    useState<Record<string, true>>(
      initialSnapshotRef.current?.bootstrappedConversationKeys ?? {},
    );
  const {
    messageMap,
    structuredMessages,
    insertStructuredMessage,
    upsertStructuredMessage,
    updateStructuredMessage,
    clearStructuredMessages,
    removeConversationStructuredMessages,
  } = useLocalStructuredMessages({
    conversationKey: activeKey,
    initialMessageMap: initialSnapshotRef.current?.structuredMessageMap,
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
  const { chatMessageMap, setChatMessageMap } = useChatMessagePersistence({
    activeKey,
    initialChatMessageMap: initialSnapshotRef.current?.chatMessageMap,
    parsedMessages: parsedMessages as PersistedParsedChatRecord[],
  });
  const displayedParsedMessages =
    parsedMessages.length > 0 || isRequesting
      ? parsedMessages
      : (chatMessageMap[activeKey] ?? []);
  const { runtimeEvents, recordRuntimeEvent } = useRuntimeExecutionSync({
    activeKey,
    parsedMessages: parsedMessages as PersistedParsedChatRecord[],
    structuredMessages,
    upsertStructuredMessage,
    updateStructuredMessage,
  });
  useWorkspaceSnapshotPersistence({
    activeKey,
    bootstrappedConversationKeys,
    chatMessageMap,
    conversations,
    mockChartType,
    mockType,
    structuredMessageMap: messageMap,
  });
  const {
    handleAgentExecutionControl,
    handleFormSubmit,
    handleSenderSubmit,
    sendMessage,
  } = useChatActions({
    activeKey,
    clearStructuredMessages,
    insertStructuredMessage,
    mockChartType,
    mockType,
    onRequest,
    recordRuntimeEvent,
    setConversations,
    setInputValue,
    submitActionAdapter,
    updateStructuredMessage,
  });
  const { getConversationMenu, newChat } = useConversationController({
    activeKey,
    setActiveKey,
    setChatMessageMap,
    setConversations,
    removeConversationStructuredMessages,
  });

  useStarterPromptBootstrap({
    activeKey,
    bootstrappedConversationKeys,
    conversations,
    displayedParsedMessagesLength: displayedParsedMessages.length,
    isRequesting,
    mockType,
    sendMessage,
    setBootstrappedConversationKeys,
    structuredMessagesLength: structuredMessages.length,
  });

  const bubbleItems = useMemo<BubbleItemType[]>(
    () =>
      buildBubbleItems({
        activeKey,
        parsedMessages: displayedParsedMessages,
        structuredMessages,
        onFormSubmit: handleFormSubmit,
        onAgentExecutionControl: handleAgentExecutionControl,
      }),
    [
      activeKey,
      displayedParsedMessages,
      handleAgentExecutionControl,
      structuredMessages,
    ],
  );

  const hasMessages =
    displayedParsedMessages.length > 0 || structuredMessages.length > 0;
  const {
    currentMockTypeLabel,
    mockChartTypeOptions,
    mockMessageTypeOptions,
    showMockToolbar,
  } = useMockToolbar({
    mockChartType,
    mockType,
  });
  const senderPlaceholder = `输入消息，按 Enter 发送，当前返回 ${currentMockTypeLabel}...`;
  const handleSenderKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const isModifierPressed = event.ctrlKey || event.altKey || event.metaKey;
      const shouldSubmit =
        event.key === 'Enter' &&
        !event.shiftKey &&
        !isModifierPressed &&
        !event.nativeEvent.isComposing;

      if (!shouldSubmit) {
        return undefined;
      }

      event.preventDefault();

      if (isRequesting || !inputValue.trim()) {
        return false;
      }

      handleSenderSubmit(inputValue);
      return false;
    },
    [handleSenderSubmit, inputValue, isRequesting],
  );
  return (
    <PageContainer
      ghost
      title={
        <Space size={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.push('/welcome')}
            aria-label="返回首页"
          />
          <span>AI 智能体对话</span>
        </Space>
      }
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
        <XProvider locale={X_SENDER_LOCALE as any}>
          <div className={styles.layout}>
            <div className={styles.sidebar}>
              <Conversations
                items={conversations}
                activeKey={activeKey}
                onActiveChange={setActiveKey}
                groupable
                menu={getConversationMenu}
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
                  />
                </div>
              )}

              <div
                className={hasMessages ? styles.footer : styles.footerCenter}
              >
                {!hasMessages && (
                  <div className={styles.emptyState}>
                    <div className={styles.welcomeTitle}>
                      <TypewriterTitle />
                    </div>
                    <Typography.Paragraph
                      type="secondary"
                      className={styles.welcomeDescription}
                    >
                      这里是前端智能体联调工作台。可以直接输入问题，验证结构化消息、执行态更新、表单和动作编排链路。
                    </Typography.Paragraph>
                    <Button
                      icon={<CompassOutlined />}
                      onClick={() => history.push('/chatbot/demo')}
                    >
                      进入 Demo 页面
                    </Button>
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
                        options={mockMessageTypeOptions}
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
                            options={mockChartTypeOptions}
                          />
                        </>
                      )}
                    </Space>
                  </div>
                )}
                <div className={styles.debugPanel}>
                  <RuntimeDebugPanel events={runtimeEvents} />
                </div>
                <Sender
                  value={inputValue}
                  onChange={setInputValue}
                  loading={isRequesting}
                  onSubmit={handleSenderSubmit}
                  onKeyDown={handleSenderKeyDown}
                  onCancel={abort}
                  placeholder={senderPlaceholder}
                  rootClassName={styles.chatSender}
                  autoSize={{ minRows: 2, maxRows: 6 }}
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
