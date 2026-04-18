import { MessageType } from './data';
import { parseChatMessage } from './parser';

describe('parseChatMessage', () => {
  it('returns user message directly for non-assistant role', () => {
    expect(parseChatMessage({ role: 'user', content: 'hello' })).toEqual({
      role: 'user',
      content: 'hello',
    });
  });

  it('extracts think content and structured message from assistant response', () => {
    const parsed = parseChatMessage({
      role: 'assistant',
      content:
        '<think>先分析数据</think>{"role":"assistant","type":"text","content":{"text":"结果"}}',
    });

    expect(parsed.role).toBe('assistant');
    if (parsed.role !== 'assistant') {
      throw new Error('expected assistant message');
    }
    expect(parsed.thinkContent).toBe('先分析数据');
    expect(parsed.structuredMessage?.type).toBe(MessageType.TEXT);
  });

  it('handles partial think block safely', () => {
    const parsed = parseChatMessage({
      role: 'assistant',
      content: '<think>仍在思考中',
    });

    expect(parsed).toEqual({
      role: 'assistant',
      thinkContent: '仍在思考中',
      content: '',
    });
  });
});
