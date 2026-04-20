import { applyAgentExecutionMessagePatch, MessageType } from '../../data';
import {
  appendStructuredMessage,
  clearStructuredMessagesByConversation,
  getStructuredMessagesByConversation,
  removeStructuredMessagesByConversation,
  type StructuredMessageMap,
  updateStructuredMessageByConversation,
  upsertStructuredMessageByConversation,
} from './structuredMessageStore';

const createStoredMessage = (id: string) =>
  ({
    id,
    role: 'assistant',
    type: 'text',
    content: {
      text: id,
    },
  }) as const;

describe('structuredMessageStore', () => {
  it('appends structured message to target conversation', () => {
    const store = appendStructuredMessage({}, 'conversation-a', {
      role: 'assistant',
      type: 'text',
      content: {
        text: 'hello',
      },
    });

    expect(
      getStructuredMessagesByConversation(store, 'conversation-a'),
    ).toHaveLength(1);
  });

  it('resolves message template before appending', () => {
    const store = appendStructuredMessage(
      {},
      'conversation-a',
      {
        role: 'assistant',
        type: 'text',
        content: {
          text: '你好，{{name}}',
        },
      },
      {
        name: '张三',
      },
    );

    expect(
      getStructuredMessagesByConversation(store, 'conversation-a')[0]?.content,
    ).toEqual({
      text: '你好，张三',
    });
  });

  it('clears one conversation without affecting others', () => {
    const initialStore = {
      'conversation-a': [createStoredMessage('1')],
      'conversation-b': [createStoredMessage('2')],
    } satisfies StructuredMessageMap;

    const nextStore = clearStructuredMessagesByConversation(
      initialStore,
      'conversation-a',
    );

    expect(
      getStructuredMessagesByConversation(nextStore, 'conversation-a'),
    ).toEqual([]);
    expect(
      getStructuredMessagesByConversation(nextStore, 'conversation-b'),
    ).toHaveLength(1);
  });

  it('removes one conversation bucket entirely', () => {
    const initialStore = {
      'conversation-a': [createStoredMessage('1')],
      'conversation-b': [createStoredMessage('2')],
    } satisfies StructuredMessageMap;

    const nextStore = removeStructuredMessagesByConversation(
      initialStore,
      'conversation-a',
    );

    expect('conversation-a' in nextStore).toBe(false);
    expect(
      getStructuredMessagesByConversation(nextStore, 'conversation-b'),
    ).toHaveLength(1);
  });

  it('updates an existing structured message by id', () => {
    const initialStore = {
      'conversation-a': [
        {
          id: 'execution-1',
          role: 'assistant',
          type: MessageType.AGENT_EXECUTION,
          content: {
            title: '执行状态',
            status: 'running',
            summary: '正在检索上下文',
            steps: [
              {
                key: 'retrieval',
                title: '检索上下文',
                status: 'running',
              },
            ],
          },
        },
      ],
    } satisfies StructuredMessageMap;

    const nextStore = updateStructuredMessageByConversation(
      initialStore,
      'conversation-a',
      'execution-1',
      (message) =>
        applyAgentExecutionMessagePatch(message, {
          status: 'success',
          summary: '已完成回答生成',
          updateSteps: [
            {
              key: 'retrieval',
              status: 'success',
            },
          ],
          appendSteps: [
            {
              key: 'response',
              title: '生成回答',
              status: 'success',
            },
          ],
        }),
    );

    expect(
      getStructuredMessagesByConversation(nextStore, 'conversation-a')[0],
    ).toMatchObject({
      content: {
        status: 'success',
        summary: '已完成回答生成',
        steps: [
          {
            key: 'retrieval',
            status: 'success',
          },
          {
            key: 'response',
            status: 'success',
          },
        ],
      },
    });
  });

  it('upserts structured message by id without duplicating the conversation list', () => {
    const initialStore = appendStructuredMessage({}, 'conversation-a', {
      id: 'execution-1',
      role: 'assistant',
      type: MessageType.AGENT_EXECUTION,
      content: {
        title: '执行状态',
        status: 'running',
        summary: '正在检索上下文',
        steps: [],
      },
    });

    const nextStore = upsertStructuredMessageByConversation(
      initialStore,
      'conversation-a',
      {
        id: 'execution-1',
        role: 'assistant',
        type: MessageType.AGENT_EXECUTION,
        content: {
          title: '执行状态',
          status: 'success',
          summary: '执行完成',
          steps: [],
        },
      },
    );

    expect(
      getStructuredMessagesByConversation(nextStore, 'conversation-a'),
    ).toHaveLength(1);
    expect(
      getStructuredMessagesByConversation(nextStore, 'conversation-a')[0],
    ).toMatchObject({
      id: 'execution-1',
      content: {
        status: 'success',
        summary: '执行完成',
      },
    });
  });
});
