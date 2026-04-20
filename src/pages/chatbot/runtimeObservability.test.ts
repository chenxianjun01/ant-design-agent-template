import {
  appendRuntimeEvent,
  getRuntimeEventsByConversation,
} from './runtimeObservability';

describe('runtimeObservability', () => {
  it('appends runtime events to the target conversation', () => {
    const eventMap = appendRuntimeEvent({}, 'conversation-a', {
      type: 'chat.request',
      level: 'info',
      summary: '已发起请求',
    });

    expect(
      getRuntimeEventsByConversation(eventMap, 'conversation-a'),
    ).toHaveLength(1);
    expect(
      getRuntimeEventsByConversation(eventMap, 'conversation-a')[0],
    ).toMatchObject({
      conversationKey: 'conversation-a',
      type: 'chat.request',
      level: 'info',
      summary: '已发起请求',
    });
  });

  it('keeps only the most recent events within the limit', () => {
    const eventMap = [1, 2, 3].reduce(
      (previous, value) =>
        appendRuntimeEvent(
          previous,
          'conversation-a',
          {
            id: `event-${value}`,
            timestamp: `2026-04-19T00:00:0${value}.000Z`,
            type: 'patch.apply',
            level: 'success',
            summary: `patch-${value}`,
          },
          2,
        ),
      {},
    );

    expect(getRuntimeEventsByConversation(eventMap, 'conversation-a')).toEqual([
      expect.objectContaining({ id: 'event-2', summary: 'patch-2' }),
      expect.objectContaining({ id: 'event-3', summary: 'patch-3' }),
    ]);
  });
});
