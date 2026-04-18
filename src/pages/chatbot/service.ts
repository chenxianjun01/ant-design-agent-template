import {
  AbstractChatProvider,
  AbstractXRequestClass,
  OpenAIChatProvider,
  type TransformMessage,
  XRequest,
  type XRequestOptions,
} from '@ant-design/x-sdk';
import { request } from '@umijs/max';

import {
  createMockApprovalPayload,
  createMockAudioPayload,
  createMockChartPayload,
  createMockFilePayload,
  createMockFormPayload,
  createMockImagePayload,
  createMockMapPayload,
  createMockTablePayload,
  createMockTextPayload,
  createMockTimelinePayload,
} from './mockPayloadFactory';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const MOCK_MESSAGE_TYPES = [
  'text',
  'file',
  'image',
  'audio',
  'table',
  'chart',
  'form',
  'map',
  'timeline',
  'approval',
] as const;
export const MOCK_CHART_TYPES = [
  'line',
  'column',
  'pie',
  'area',
  'bar',
  'radar',
  'dualAxes',
] as const;

export type MockMessageType = (typeof MOCK_MESSAGE_TYPES)[number];
export type MockChartType = (typeof MOCK_CHART_TYPES)[number];

export interface ChatRequestParams {
  messages: ChatMessage[];
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
}

export interface SubmitApiActionResult {
  success: boolean;
  code?: string;
  retryable?: boolean;
  data?: Record<string, unknown>;
  message?: string;
}

export interface TrackEventPayload {
  event: string;
  properties?: Record<string, unknown>;
}

export interface SubmitActionAdapter {
  executeApiAction: (
    api: string,
    payload: Record<string, unknown>,
  ) => Promise<SubmitApiActionResult>;
  trackEvent: (payload: TrackEventPayload) => Promise<void>;
}

type MockResponseChunk = string;

const MOCK_PROVIDER_MODE = 'mock';
const REMOTE_PROVIDER_MODE = 'remote';

export const CHAT_PROVIDER_MODE =
  process.env.CHAT_PROVIDER_MODE ?? MOCK_PROVIDER_MODE;
export const CHAT_MOCK_TYPE = process.env.CHAT_MOCK_TYPE;
export const CHAT_MOCK_CHART_TYPE = process.env.CHAT_MOCK_CHART_TYPE;

export const CHAT_API_URL =
  process.env.CHAT_API_URL ??
  'https://api.x.ant.design/api/big_model_glm-4.5-flash';
export const CHAT_SUBMIT_ACTION_API_URL =
  process.env.CHAT_SUBMIT_ACTION_API_URL ?? '/api/chatbot/submit-action';
export const CHAT_TRACK_EVENT_API_URL =
  process.env.CHAT_TRACK_EVENT_API_URL ?? '/api/chatbot/track-event';

interface RemoteSubmitActionResponse {
  success?: boolean;
  code?: string;
  retryable?: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

const normalizeSubmitApiActionResult = (
  response: RemoteSubmitActionResponse | undefined,
): SubmitApiActionResult => ({
  success: Boolean(response?.success),
  code: response?.code,
  retryable: response?.retryable,
  message: response?.message,
  data: response?.data,
});

const isHighPriority = (priority: unknown) => {
  const normalized = String(priority ?? '').toLowerCase();
  return normalized === 'high' || normalized === '高';
};

export const executeSubmitApiAction = async (
  api: string,
  payload: Record<string, unknown>,
): Promise<SubmitApiActionResult> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, randomBetween(300, 800));
  });

  if (api === 'createTicket') {
    return {
      success: true,
      message: '工单创建成功',
      data: {
        ticketId: `TICKET-${randomBetween(1000, 9999)}`,
        status: 'created',
        owner: '智能体调度中心',
        ...payload,
      },
    };
  }

  if (api === 'notifyMembers') {
    return {
      success: true,
      message: '通知已发送',
      data: {
        notifyResult: 'sent',
        receivers: 3,
        ...payload,
      },
    };
  }

  if (api === 'createTicketWithRisk') {
    if (isHighPriority(payload.priority)) {
      return {
        success: false,
        code: 'RATE_LIMITED',
        retryable: true,
        message: '当前高优任务创建过于频繁，请稍后重试。',
        data: payload,
      };
    }

    return {
      success: false,
      code: 'VALIDATION_ERROR',
      retryable: false,
      message: '请求参数校验失败，请检查表单填写项。',
      data: payload,
    };
  }

  return {
    success: false,
    code: 'UNKNOWN_API',
    retryable: false,
    message: `未识别的 mock API: ${api}`,
    data: payload,
  };
};

export const trackMockEvent = async ({
  event,
  properties,
}: TrackEventPayload): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 120);
  });

  console.info('[chatbot-track-event]', {
    event,
    properties,
    trackedAt: new Date().toISOString(),
  });
};

const executeRemoteSubmitApiAction = async (
  api: string,
  payload: Record<string, unknown>,
): Promise<SubmitApiActionResult> => {
  try {
    const response = await request<RemoteSubmitActionResponse>(
      CHAT_SUBMIT_ACTION_API_URL,
      {
        method: 'POST',
        data: {
          api,
          payload,
        },
        skipErrorHandler: true,
      },
    );

    return normalizeSubmitApiActionResult(response);
  } catch (error) {
    return {
      success: false,
      code: 'REMOTE_REQUEST_FAILED',
      retryable: true,
      message:
        error instanceof Error ? error.message : '远端 submitAction 请求失败。',
      data: payload,
    };
  }
};

const trackRemoteEvent = async (payload: TrackEventPayload): Promise<void> => {
  try {
    await request(CHAT_TRACK_EVENT_API_URL, {
      method: 'POST',
      data: payload,
      skipErrorHandler: true,
    });
  } catch (error) {
    console.warn('[chatbot-track-event] 远端埋点上报失败，已忽略。', {
      error,
      payload,
    });
  }
};

export const createSubmitActionAdapter = (): SubmitActionAdapter => {
  if (CHAT_PROVIDER_MODE === REMOTE_PROVIDER_MODE) {
    return {
      executeApiAction: executeRemoteSubmitApiAction,
      trackEvent: trackRemoteEvent,
    };
  }

  return {
    executeApiAction: executeSubmitApiAction,
    trackEvent: trackMockEvent,
  };
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)] as T;

const splitTextToChunks = (content: string, step = 18): string[] => {
  const chunks: string[] = [];

  for (let index = 0; index < content.length; index += step) {
    chunks.push(content.slice(index, index + step));
  }

  return chunks;
};

const createMockAssistantPayload = (
  prompt: string,
  forcedType?: MockMessageType,
  forcedChartType?: MockChartType,
): {
  mode: 'stream' | 'single';
  payload: string;
} => {
  const envForcedType = MOCK_MESSAGE_TYPES.find(
    (type) => type === CHAT_MOCK_TYPE,
  );
  const envForcedChartType = MOCK_CHART_TYPES.find(
    (type) => type === CHAT_MOCK_CHART_TYPE,
  );
  const type: MockMessageType =
    forcedType ?? envForcedType ?? pickRandom(MOCK_MESSAGE_TYPES);
  const chartType = forcedChartType ?? envForcedChartType;

  if (type === 'text') {
    return {
      mode: 'stream',
      payload: createMockTextPayload(prompt, pickRandom),
    };
  }

  if (type === 'table') {
    return {
      mode: 'single',
      payload: createMockTablePayload(prompt),
    };
  }

  if (type === 'file') {
    return {
      mode: 'single',
      payload: createMockFilePayload(prompt),
    };
  }

  if (type === 'image') {
    return {
      mode: 'single',
      payload: createMockImagePayload(prompt),
    };
  }

  if (type === 'audio') {
    return {
      mode: 'single',
      payload: createMockAudioPayload(prompt),
    };
  }

  if (type === 'chart') {
    return {
      mode: 'single',
      payload: createMockChartPayload(prompt, pickRandom, chartType),
    };
  }

  if (type === 'timeline') {
    return {
      mode: 'single',
      payload: createMockTimelinePayload(prompt),
    };
  }

  if (type === 'map') {
    return {
      mode: 'single',
      payload: createMockMapPayload(prompt),
    };
  }

  if (type === 'approval') {
    return {
      mode: 'single',
      payload: createMockApprovalPayload(prompt),
    };
  }

  return {
    mode: 'single',
    payload: createMockFormPayload(prompt, pickRandom),
  };
};

export const chatbotMockPayloadFactory = {
  createAssistantPayload: createMockAssistantPayload,
};

class MockXRequestClass extends AbstractXRequestClass<
  ChatRequestParams,
  MockResponseChunk,
  ChatMessage
> {
  private _asyncHandler: Promise<void> = Promise.resolve();
  private _isRequesting = false;
  private readonly _manual: boolean;
  private timerIds: number[] = [];
  private aborted = false;

  constructor(
    baseURL: string,
    options?: XRequestOptions<
      ChatRequestParams,
      MockResponseChunk,
      ChatMessage
    >,
  ) {
    super(baseURL, options);
    this._manual = options?.manual ?? false;
  }

  get asyncHandler(): Promise<void> {
    return this._asyncHandler;
  }

  get isTimeout(): boolean {
    return false;
  }

  get isStreamTimeout(): boolean {
    return false;
  }

  get isRequesting(): boolean {
    return this._isRequesting;
  }

  get manual(): boolean {
    return this._manual;
  }

  run(params?: ChatRequestParams): void {
    if (!params) {
      return;
    }

    this.abort();
    this.aborted = false;
    this._isRequesting = true;
    const headers = new Headers({ 'content-type': 'application/json' });
    const prompt = params.messages.at(-1)?.content ?? '';
    const response = createMockAssistantPayload(
      prompt,
      params.mockType,
      params.mockChartType,
    );

    this._asyncHandler = (async () => {
      try {
        if (response.mode === 'stream') {
          const chunks = splitTextToChunks(
            response.payload,
            randomBetween(12, 24),
          );
          const collected: string[] = [];

          for (const chunk of chunks) {
            await this.schedule(randomBetween(30, 90));
            if (this.aborted) {
              throw new DOMException('Aborted', 'AbortError');
            }
            collected.push(chunk);
            this.options.callbacks?.onUpdate?.(chunk, headers);
          }

          this._isRequesting = false;
          this.options.callbacks?.onSuccess?.(collected, headers);
          return;
        }

        await this.schedule(randomBetween(450, 900));
        if (this.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        this._isRequesting = false;
        this.options.callbacks?.onSuccess?.([response.payload], headers);
      } catch (error) {
        this._isRequesting = false;
        const normalizedError =
          error instanceof Error
            ? error
            : new Error('Mock provider request failed');
        this.options.callbacks?.onError?.(normalizedError);
      }
    })();
  }

  abort(): void {
    this.aborted = true;
    this._isRequesting = false;
    this.timerIds.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    this.timerIds = [];
  }

  private schedule(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timerId = window.setTimeout(() => {
        this.timerIds = this.timerIds.filter((id) => id !== timerId);
        resolve();
      }, ms);

      this.timerIds.push(timerId);
    });
  }
}

class MockChatProvider extends AbstractChatProvider<
  ChatMessage,
  ChatRequestParams,
  MockResponseChunk
> {
  transformParams(
    requestParams: Partial<ChatRequestParams>,
    options: XRequestOptions<ChatRequestParams, MockResponseChunk, ChatMessage>,
  ): ChatRequestParams {
    return {
      ...(options?.params || {}),
      ...requestParams,
      messages: this.getMessages(),
    } as ChatRequestParams;
  }

  transformLocalMessage(
    requestParams: Partial<ChatRequestParams>,
  ): ChatMessage[] {
    return requestParams.messages ?? [];
  }

  transformMessage({
    originMessage,
    chunk,
    chunks,
  }: TransformMessage<ChatMessage, MockResponseChunk>): ChatMessage {
    const content = chunk
      ? `${originMessage?.content || ''}${chunk}`
      : chunks.join('');

    return {
      role: 'assistant',
      content,
    };
  }
}

const createMockRequest = () =>
  new MockXRequestClass('mock://chat', {
    manual: true,
  });

const createRemoteChatProvider = () =>
  new OpenAIChatProvider({
    request: XRequest(CHAT_API_URL, {
      manual: true,
      params: { model: 'glm-4.5-flash', stream: true },
    }),
  });

const createMockChatProvider = () =>
  new MockChatProvider({
    request: createMockRequest(),
  });

/**
 * Factory — call once per component mount (wrap in useMemo).
 * 默认走本地 mock provider，设置 CHAT_PROVIDER_MODE=remote 后切到真实接口。
 */
export const createChatProvider = () =>
  CHAT_PROVIDER_MODE === REMOTE_PROVIDER_MODE
    ? createRemoteChatProvider()
    : createMockChatProvider();
