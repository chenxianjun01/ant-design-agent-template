import {
  CHATBOT_WORKSPACE_STORAGE_KEY,
  loadChatbotWorkspaceSnapshot,
  saveChatbotWorkspaceSnapshot,
} from './chatPersistence';

describe('chatPersistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and loads a valid chatbot workspace snapshot', () => {
    saveChatbotWorkspaceSnapshot({
      version: 1,
      conversations: [{ key: 'default', label: '新对话' }],
      activeKey: 'default',
      bootstrappedConversationKeys: { default: true },
      chatMessageMap: {
        default: [
          {
            id: 'chat-1',
            status: 'success',
            message: {
              role: 'assistant',
              content: 'hello',
            },
          },
        ],
      },
      structuredMessageMap: {
        default: [
          {
            id: 'execution-1',
            role: 'assistant',
            type: 'agent-execution',
            content: {
              title: '执行状态',
              status: 'running',
              steps: [],
            },
          },
        ],
      },
      mockType: 'agent-execution',
      mockChartType: 'line',
    });

    expect(loadChatbotWorkspaceSnapshot()).toEqual({
      version: 1,
      conversations: [{ key: 'default', label: '新对话' }],
      activeKey: 'default',
      bootstrappedConversationKeys: { default: true },
      chatMessageMap: {
        default: [
          {
            id: 'chat-1',
            status: 'success',
            message: {
              role: 'assistant',
              content: 'hello',
            },
          },
        ],
      },
      structuredMessageMap: {
        default: [
          {
            id: 'execution-1',
            role: 'assistant',
            type: 'agent-execution',
            content: {
              title: '执行状态',
              status: 'running',
              steps: [],
            },
          },
        ],
      },
      mockType: 'agent-execution',
      mockChartType: 'line',
    });
  });

  it('falls back safely when local snapshot is invalid', () => {
    window.localStorage.setItem(
      CHATBOT_WORKSPACE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        conversations: 'invalid',
      }),
    );

    expect(loadChatbotWorkspaceSnapshot()).toBeUndefined();
  });
});
