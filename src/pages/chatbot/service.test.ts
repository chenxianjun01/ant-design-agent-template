import { MessageType, normalizeStructuredMessage } from './data';
import { chatbotMockPayloadFactory } from './service';

describe('chatbot mock payload contract', () => {
  it('keeps text mock payload in stream mode and non-structured content', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试文本消息',
      'text',
    );

    expect(result.mode).toBe('stream');
    expect(typeof result.payload).toBe('string');
    expect(normalizeStructuredMessage(result.payload)).toBeUndefined();
  });

  it('normalizes table mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试表格消息',
      'table',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.TABLE);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes file mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试文件消息',
      'file',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.FILE);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes image mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试图片消息',
      'image',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.IMAGE);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes audio mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试音频消息',
      'audio',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.AUDIO);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes chart mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试图表消息',
      'chart',
      'line',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.CHART);
    expect(parsed?.role).toBe('assistant');
  });

  it.each([
    'area',
    'bar',
    'radar',
    'dualAxes',
  ] as const)('normalizes %s chart mock payload successfully', (chartType) => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      `测试${chartType}图表消息`,
      'chart',
      chartType,
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.CHART);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes form mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试表单消息',
      'form',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.FORM);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes map mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试地图消息',
      'map',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.MAP);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes timeline mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试时间轴消息',
      'timeline',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.TIMELINE);
    expect(parsed?.role).toBe('assistant');
  });

  it('normalizes approval mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试审批卡片消息',
      'approval',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.APPROVAL);
    expect(parsed?.role).toBe('assistant');
  });
});
