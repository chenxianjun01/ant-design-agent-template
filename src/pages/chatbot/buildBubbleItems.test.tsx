import { buildBubbleItems } from './buildBubbleItems';
import { MessageType } from './data';

jest.mock('./components/MessageRenderer', () => ({
  __esModule: true,
  default: ({ message }: { message: { id: string; type: string } }) =>
    require('react').createElement(
      'div',
      {
        'data-testid': `message-renderer-${message.id}`,
      },
      message.type,
    ),
}));

describe('buildBubbleItems', () => {
  it('skips remote structured execution card when the same message is mirrored into local store', () => {
    const executionMessage = {
      id: 'execution-1',
      role: 'assistant' as const,
      type: MessageType.AGENT_EXECUTION,
      content: {
        title: '执行状态',
        status: 'running' as const,
        steps: [],
      },
    };

    const items = buildBubbleItems({
      activeKey: 'conversation-a',
      parsedMessages: [
        {
          id: 'chat-1',
          status: 'success',
          message: {
            role: 'assistant',
            content: JSON.stringify(executionMessage),
            structuredMessage: executionMessage,
          },
        },
      ],
      structuredMessages: [executionMessage],
      onFormSubmit: jest.fn(),
    });

    expect(items).toHaveLength(1);
    expect(String(items[0]?.key)).toContain('local-structured_conversation-a');
  });
});
