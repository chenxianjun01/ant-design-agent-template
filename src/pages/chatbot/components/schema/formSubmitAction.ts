import type {
  IFormSubmitAction,
  IFormSubmitActionHook,
  IMessageItem,
  IMessageItemDraft,
} from '../../data';
import {
  applyTemplateString,
  MessageType,
  resolveTemplateValue,
} from '../../data';
import type {
  ChatMessage,
  ChatRequestParams,
  MockChartType,
  MockMessageType,
  SubmitActionAdapter,
} from '../../service';

export const buildFormSubmitSummary = (
  values: Record<string, unknown>,
): string => {
  const lines = Object.entries(values).map(
    ([key, value]) =>
      `- ${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`,
  );

  return ['我已提交表单，内容如下：', ...lines].join('\n');
};

export const applyPromptTemplate = applyTemplateString;
export { resolveTemplateValue };

export interface BuildRequestParamsOptions {
  isRemoteMode: boolean;
  messages: ChatMessage[];
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
}

export const buildRequestParams = ({
  isRemoteMode,
  messages,
  mockType,
  mockChartType,
}: BuildRequestParamsOptions): ChatRequestParams => {
  if (isRemoteMode) {
    return { messages };
  }

  return {
    messages,
    mockType,
    mockChartType,
  };
};

export interface ExecuteFormSubmitActionOptions {
  isRemoteMode: boolean;
  submittedMessage: IMessageItem;
  values: Record<string, unknown>;
  insertStructuredMessage: (
    message: IMessageItemDraft,
    values?: Record<string, unknown>,
  ) => void;
  clearStructuredMessages: () => void;
  refreshConversation: () => void;
  onRequest: (params: ChatRequestParams) => void;
  submitActionAdapter: SubmitActionAdapter;
}

export interface FormSubmitExecutionResult {
  status: 'success' | 'error';
  message?: string;
  retryable?: boolean;
}

const resolveErrorMessage = (
  code: string | undefined,
  fallbackMessage: string | undefined,
  errorMessages?: Record<string, string>,
) => {
  if (code && errorMessages?.[code]) {
    return errorMessages[code];
  }

  return fallbackMessage ?? '异步操作执行失败，请稍后重试。';
};

const isMessageContentRecord = (
  content: IMessageItem['content'],
): content is Record<string, unknown> =>
  typeof content === 'object' && content !== null && !Array.isArray(content);

const getMessageTitle = (submittedMessage: IMessageItem) => {
  if (
    isMessageContentRecord(submittedMessage.content) &&
    typeof submittedMessage.content.title === 'string'
  ) {
    return submittedMessage.content.title;
  }

  if (submittedMessage.type === MessageType.FORM) {
    return '动态表单';
  }

  if (submittedMessage.type === MessageType.APPROVAL) {
    return '审批卡片';
  }

  return '结构化消息';
};

const getSubmitAction = (
  submittedMessage: IMessageItem,
): IFormSubmitAction | undefined => {
  if (
    isMessageContentRecord(submittedMessage.content) &&
    'submitAction' in submittedMessage.content
  ) {
    return submittedMessage.content.submitAction as
      | IFormSubmitAction
      | undefined;
  }

  return undefined;
};

interface RunSubmitHooksOptions {
  hooks?: IFormSubmitActionHook[];
  contextValues: Record<string, unknown>;
  isRemoteMode: boolean;
  insertStructuredMessage: (
    message: IMessageItemDraft,
    values?: Record<string, unknown>,
  ) => void;
  clearStructuredMessages: () => void;
  refreshConversation: () => void;
  onRequest: (params: ChatRequestParams) => void;
  submitActionAdapter: SubmitActionAdapter;
}

type HookExecutionContext = Omit<RunSubmitHooksOptions, 'hooks'>;

type HookExecutorMap = {
  [K in IFormSubmitActionHook['type']]: (
    hook: Extract<IFormSubmitActionHook, { type: K }>,
    context: HookExecutionContext,
  ) => void;
};

const hookExecutorMap: HookExecutorMap = {
  insertMessage: (hook, context) => {
    context.insertStructuredMessage(hook.message, context.contextValues);
  },
  clearStructuredMessages: (_, context) => {
    context.clearStructuredMessages();
  },
  refreshConversation: (_, context) => {
    context.refreshConversation();
  },
  request: (hook, context) => {
    context.onRequest(
      buildRequestParams({
        isRemoteMode: context.isRemoteMode,
        messages: [
          {
            role: 'user',
            content: applyPromptTemplate(
              hook.promptTemplate,
              context.contextValues,
            ),
          },
        ],
        mockType: hook.mockType ?? 'text',
        mockChartType: hook.mockChartType,
      }),
    );
  },
  trackEvent: (hook, context) => {
    void context.submitActionAdapter.trackEvent({
      event: applyPromptTemplate(hook.event, context.contextValues),
      properties: (resolveTemplateValue(
        hook.properties ?? {},
        context.contextValues,
      ) ?? {}) as Record<string, unknown>,
    });
  },
};

const runSubmitHooks = ({
  hooks,
  contextValues,
  isRemoteMode,
  insertStructuredMessage,
  clearStructuredMessages,
  refreshConversation,
  onRequest,
  submitActionAdapter,
}: RunSubmitHooksOptions) => {
  const context: HookExecutionContext = {
    contextValues,
    isRemoteMode,
    insertStructuredMessage,
    clearStructuredMessages,
    refreshConversation,
    onRequest,
    submitActionAdapter,
  };

  hooks?.forEach((hook) => {
    const executor = hookExecutorMap[hook.type] as (
      currentHook: typeof hook,
      currentContext: HookExecutionContext,
    ) => void;
    executor(hook, context);
  });
};

export const executeFormSubmitAction = ({
  isRemoteMode,
  submittedMessage,
  values,
  insertStructuredMessage,
  clearStructuredMessages,
  refreshConversation,
  onRequest,
  submitActionAdapter,
}: ExecuteFormSubmitActionOptions): Promise<FormSubmitExecutionResult> => {
  const title = getMessageTitle(submittedMessage);
  const submitAction = getSubmitAction(submittedMessage);

  if (submitAction?.action === 'insertMessage') {
    insertStructuredMessage(submitAction.message, values);
    return Promise.resolve({ status: 'success' });
  }

  if (submitAction?.action === 'requestAndInsert') {
    insertStructuredMessage(submitAction.message, values);
  }

  if (submitAction?.action === 'callApi') {
    const payload = (resolveTemplateValue(submitAction.payload ?? {}, values) ??
      {}) as Record<string, unknown>;

    runSubmitHooks({
      hooks: submitAction.beforeRequest,
      contextValues: values,
      isRemoteMode,
      insertStructuredMessage,
      clearStructuredMessages,
      refreshConversation,
      onRequest,
      submitActionAdapter,
    });

    return submitActionAdapter
      .executeApiAction(submitAction.api, payload)
      .then((result) => {
        const contextValues = {
          ...values,
          ...(result.data ?? {}),
          apiMessage: result.message ?? '',
        };

        if (result.success) {
          if (submitAction.onSuccessMessage) {
            insertStructuredMessage(
              submitAction.onSuccessMessage,
              contextValues,
            );
          }

          if (submitAction.successPromptTemplate) {
            onRequest(
              buildRequestParams({
                isRemoteMode,
                messages: [
                  {
                    role: 'user',
                    content: applyPromptTemplate(
                      submitAction.successPromptTemplate,
                      contextValues,
                    ),
                  },
                ],
                mockType: submitAction.mockType ?? 'text',
                mockChartType: submitAction.mockChartType,
              }),
            );
          }

          runSubmitHooks({
            hooks: submitAction.afterSuccess,
            contextValues,
            isRemoteMode,
            insertStructuredMessage,
            clearStructuredMessages,
            refreshConversation,
            onRequest,
            submitActionAdapter,
          });

          return { status: 'success' as const, message: result.message };
        }

        if (submitAction.onErrorMessage) {
          insertStructuredMessage(submitAction.onErrorMessage, contextValues);
        }

        return {
          status: 'error' as const,
          message: resolveErrorMessage(
            result.code,
            result.message,
            submitAction.errorMessages,
          ),
          retryable: result.retryable ?? submitAction.retryable ?? true,
        };
      });
  }

  const prompt =
    (submitAction?.action === 'request' ||
      submitAction?.action === 'requestAndInsert') &&
    submitAction.promptTemplate
      ? applyPromptTemplate(submitAction.promptTemplate, values)
      : [
          `我刚触发了《${title}》的提交动作，请基于以下结果继续处理。`,
          '',
          buildFormSubmitSummary(values),
          '',
          '请确认接收并给出下一步建议。',
        ].join('\n');

  onRequest(
    buildRequestParams({
      isRemoteMode,
      messages: [{ role: 'user', content: prompt }],
      mockType:
        submitAction?.action === 'request' ||
        submitAction?.action === 'requestAndInsert'
          ? (submitAction.mockType ?? 'text')
          : 'text',
      mockChartType:
        submitAction?.action === 'request' ||
        submitAction?.action === 'requestAndInsert'
          ? submitAction.mockChartType
          : undefined,
    }),
  );

  return Promise.resolve({ status: 'success' });
};
