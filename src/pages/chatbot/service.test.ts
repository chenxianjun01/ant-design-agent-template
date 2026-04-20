import { MessageType, normalizeStructuredMessage } from './data';

const mockRequest = jest.fn();

jest.mock('@umijs/max', () => ({
  request: (...args: unknown[]) => mockRequest(...args),
}));

type ServiceModule = typeof import('./service');

const loadServiceModule = async (
  providerMode?: string,
): Promise<ServiceModule> => {
  jest.resetModules();

  if (providerMode) {
    process.env.CHAT_PROVIDER_MODE = providerMode;
  } else {
    delete process.env.CHAT_PROVIDER_MODE;
  }

  return require('./service') as ServiceModule;
};

describe('chatbot mock payload contract', () => {
  let chatbotMockPayloadFactory: ServiceModule['chatbotMockPayloadFactory'];

  beforeEach(async () => {
    mockRequest.mockReset();
    ({ chatbotMockPayloadFactory } = await loadServiceModule());
  });

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

  it('normalizes agent execution mock payload successfully', () => {
    const result = chatbotMockPayloadFactory.createAssistantPayload(
      '测试执行态消息',
      'agent-execution',
    );

    expect(result.mode).toBe('single');

    const parsed = normalizeStructuredMessage(JSON.parse(result.payload));
    expect(parsed?.type).toBe(MessageType.AGENT_EXECUTION);
    expect(parsed?.role).toBe('assistant');
  });
});

describe('chatbot submitAction adapter runtime', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  afterEach(() => {
    delete process.env.CHAT_PROVIDER_MODE;
    jest.restoreAllMocks();
  });

  it('uses local adapter capabilities in mock mode', async () => {
    const service = await loadServiceModule('mock');

    const adapter = service.createSubmitActionAdapter();

    expect(adapter.executeApiAction).toBe(service.executeSubmitApiAction);
    expect(adapter.trackEvent).toBe(service.trackMockEvent);
  });

  it('uses remote adapter capabilities in remote mode', async () => {
    const service = await loadServiceModule('remote');

    const adapter = service.createSubmitActionAdapter();

    expect(adapter.executeApiAction).toBe(service.executeRemoteSubmitApiAction);
    expect(adapter.trackEvent).toBe(service.trackRemoteEvent);
  });

  it('normalizes remote submitAction success response', async () => {
    mockRequest.mockResolvedValueOnce({
      success: true,
      code: 'OK',
      retryable: false,
      message: '工单创建成功',
      data: { ticketId: 'TICKET-1001' },
    });

    const service = await loadServiceModule('remote');
    const payload = { priority: 'low', title: '联调验证' };

    const result = await service.executeRemoteSubmitApiAction(
      'createTicket',
      payload,
    );

    expect(mockRequest).toHaveBeenCalledWith(
      service.CHAT_SUBMIT_ACTION_API_URL,
      {
        method: 'POST',
        data: {
          api: 'createTicket',
          payload,
        },
        skipErrorHandler: true,
      },
    );
    expect(result).toEqual({
      success: true,
      code: 'OK',
      retryable: false,
      message: '工单创建成功',
      data: { ticketId: 'TICKET-1001' },
    });
  });

  it('falls back to normalized remote failure result', async () => {
    mockRequest.mockRejectedValueOnce(new Error('network down'));

    const service = await loadServiceModule('remote');
    const payload = { priority: 'high' };

    const result = await service.executeRemoteSubmitApiAction(
      'createTicketWithRisk',
      payload,
    );

    expect(result).toEqual({
      success: false,
      code: 'REMOTE_REQUEST_FAILED',
      retryable: true,
      message: 'network down',
      data: payload,
    });
  });

  it('sends remote trackEvent payload through request', async () => {
    mockRequest.mockResolvedValueOnce(undefined);

    const service = await loadServiceModule('remote');
    const payload = {
      event: 'chatbot.submit.success',
      properties: { source: 'jest' },
    };

    await expect(service.trackRemoteEvent(payload)).resolves.toBeUndefined();

    expect(mockRequest).toHaveBeenCalledWith(service.CHAT_TRACK_EVENT_API_URL, {
      method: 'POST',
      data: payload,
      skipErrorHandler: true,
    });
  });

  it('swallows remote trackEvent request failures', async () => {
    mockRequest.mockRejectedValueOnce(new Error('track failed'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const service = await loadServiceModule('remote');
    const payload = {
      event: 'chatbot.submit.failed',
      properties: { reason: 'network' },
    };

    await expect(service.trackRemoteEvent(payload)).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('requests remote runtime stream batches with message id and cursor', async () => {
    mockRequest.mockResolvedValueOnce({
      messageId: 'execution-1',
      patches: [{ summary: '已完成上下文检索' }],
      nextCursor: '1',
      done: false,
      pollIntervalMs: 120,
    });

    const service = await loadServiceModule('remote');
    const result = await service.fetchRemoteAgentRuntimeStreamBatch(
      'execution-1',
      '0',
    );

    expect(mockRequest).toHaveBeenCalledWith(
      service.CHAT_AGENT_RUNTIME_STREAM_API_URL,
      {
        method: 'POST',
        data: {
          messageId: 'execution-1',
          cursor: '0',
        },
        skipErrorHandler: true,
      },
    );
    expect(result).toEqual({
      messageId: 'execution-1',
      patches: [{ summary: '已完成上下文检索' }],
      nextCursor: '1',
      done: false,
      pollIntervalMs: 120,
    });
  });

  it('falls back to terminal error patch when remote runtime stream fails', async () => {
    mockRequest.mockRejectedValueOnce(new Error('stream down'));

    const service = await loadServiceModule('remote');
    const result =
      await service.fetchRemoteAgentRuntimeStreamBatch('execution-1');

    expect(result.messageId).toBe('execution-1');
    expect(result.done).toBe(true);
    expect(result.patches[0]).toMatchObject({
      status: 'error',
      summary: '运行时事件流拉取失败：stream down',
    });
  });

  it('sends execution control request through dedicated endpoint', async () => {
    mockRequest.mockResolvedValueOnce({
      success: true,
      message: '停止请求已接收',
      patch: {
        summary: '已提交停止请求，等待执行链路收敛。',
        clearPendingControl: true,
      },
    });

    const service = await loadServiceModule('remote');
    const control = {
      key: 'stop-execution',
      label: '停止',
      action: 'stop' as const,
      danger: true,
    };
    const result = await service.executeRemoteAgentExecutionControl(
      'execution-1',
      control,
    );

    expect(mockRequest).toHaveBeenCalledWith(
      service.CHAT_AGENT_EXECUTION_CONTROL_API_URL,
      {
        method: 'POST',
        data: {
          messageId: 'execution-1',
          control,
        },
        skipErrorHandler: true,
      },
    );
    expect(result).toEqual({
      success: true,
      message: '停止请求已接收',
      patch: {
        summary: '已提交停止请求，等待执行链路收敛。',
        clearPendingControl: true,
      },
      code: undefined,
      retryable: undefined,
    });
  });

  it('normalizes execution control failure without throwing', async () => {
    mockRequest.mockRejectedValueOnce(new Error('control down'));

    const service = await loadServiceModule('remote');
    const result = await service.executeRemoteAgentExecutionControl(
      'execution-1',
      {
        key: 'retry-execution',
        label: '重试',
        action: 'retry',
      },
    );

    expect(result).toMatchObject({
      success: false,
      code: 'REMOTE_CONTROL_FAILED',
      retryable: true,
      message: 'control down',
      patch: {
        clearPendingControl: true,
        controlErrorMessage: 'control down',
      },
    });
  });
});
