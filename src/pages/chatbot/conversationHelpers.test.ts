import {
  applySentMessageToConversation,
  createDraftConversation,
  deleteConversationItem,
  refreshConversationItem,
} from './conversationHelpers';

describe('conversationHelpers', () => {
  it('creates a draft conversation', () => {
    expect(createDraftConversation('conversation-a')).toEqual({
      key: 'conversation-a',
      label: '新对话',
      group: '今天',
      isDraft: true,
    });
  });

  it('applies sent message to active draft conversation', () => {
    const result = applySentMessageToConversation(
      [createDraftConversation('conversation-a')],
      'conversation-a',
      '这是一条很长的发送消息',
      '2026-04-18T10:00:00.000Z',
    );

    expect(result[0]).toMatchObject({
      key: 'conversation-a',
      label: '这是一条很长的发送消息',
      isDraft: false,
      updatedAt: '2026-04-18T10:00:00.000Z',
    });
  });

  it('keeps existing label for non-draft preset conversations', () => {
    const result = applySentMessageToConversation(
      [
        {
          key: 'preset-1',
          label: '预置问题',
          starterPrompt: '请解释联动校验',
        },
      ],
      'preset-1',
      '真正发送的内容',
      '2026-04-18T10:00:00.000Z',
    );

    expect(result[0]).toMatchObject({
      key: 'preset-1',
      label: '预置问题',
      starterPrompt: '请解释联动校验',
      updatedAt: '2026-04-18T10:00:00.000Z',
    });
  });

  it('refreshes active conversation to top', () => {
    const result = refreshConversationItem(
      [
        { key: 'conversation-a', label: 'A', group: '更早' },
        { key: 'conversation-b', label: 'B', group: '更早' },
      ],
      'conversation-b',
      '2026-04-18T10:00:00.000Z',
    );

    expect(result[0]?.key).toBe('conversation-b');
    expect(result[0]?.updatedAt).toBe('2026-04-18T10:00:00.000Z');
  });

  it('deletes active conversation and falls back to first remaining', () => {
    const result = deleteConversationItem(
      [
        { key: 'conversation-a', label: 'A' },
        { key: 'conversation-b', label: 'B' },
      ],
      'conversation-a',
      'conversation-a',
    );

    expect(result.conversations).toHaveLength(1);
    expect(result.nextActiveKey).toBe('conversation-b');
  });
});
