import {
  appendStructuredMessage,
  clearStructuredMessagesByConversation,
  getStructuredMessagesByConversation,
  removeStructuredMessagesByConversation,
  type StructuredMessageMap,
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
});
