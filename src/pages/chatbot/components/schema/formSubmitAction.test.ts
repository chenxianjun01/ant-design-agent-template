import { type IMessageItem, MessageType } from '../../data';
import type { SubmitActionAdapter } from '../../service';
import {
  applyPromptTemplate,
  buildRequestParams,
  executeFormSubmitAction,
  resolveTemplateValue,
} from './formSubmitAction';

const createSubmittedMessage = (
  submitAction: NonNullable<
    Extract<IMessageItem['content'], { submitAction?: unknown }>['submitAction']
  >,
  type: MessageType | string = MessageType.FORM,
  extraContent?: Record<string, unknown>,
): IMessageItem => ({
  id: 'form-message',
  role: 'assistant',
  type,
  content: {
    title: '工单申请',
    ...extraContent,
    submitAction,
  },
});

const createAdapter = (
  overrides?: Partial<SubmitActionAdapter>,
): SubmitActionAdapter => ({
  executeApiAction: jest.fn(),
  trackEvent: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('formSubmitAction', () => {
  it('applies prompt templates and nested template values', () => {
    expect(
      applyPromptTemplate('申请人={{applicant}}', { applicant: '张三' }),
    ).toBe('申请人=张三');

    expect(
      applyPromptTemplate('负责人={{assignee.name}}', {
        assignee: { name: '李四' },
      }),
    ).toBe('负责人=李四');

    expect(
      resolveTemplateValue(
        {
          title: '{{topic}}',
          items: ['{{applicant}}', { status: '{{status}}' }],
        },
        {
          applicant: '张三',
          topic: '智能体界面',
          status: 'done',
        },
      ),
    ).toEqual({
      title: '智能体界面',
      items: ['张三', { status: 'done' }],
    });

    expect(
      resolveTemplateValue(
        {
          fields: [
            {
              label: '通知状态',
              value: {
                $if: 'needNotify',
                $then: '已通知 {{assignee.name}}',
                $else: '无需通知',
              },
            },
            {
              $if: '!needNotify',
              $then: {
                label: '静默原因',
                value: '{{silentReason}}',
              },
            },
          ],
        },
        {
          needNotify: false,
          assignee: { name: '李四' },
          silentReason: '仅内部留档',
        },
      ),
    ).toEqual({
      fields: [
        {
          label: '通知状态',
          value: '无需通知',
        },
        {
          label: '静默原因',
          value: '仅内部留档',
        },
      ],
    });
  });

  it('builds request params differently for local and remote mode', () => {
    expect(
      buildRequestParams({
        isRemoteMode: true,
        messages: [{ role: 'user', content: 'hello' }],
        mockType: 'chart',
      }),
    ).toEqual({
      messages: [{ role: 'user', content: 'hello' }],
    });

    expect(
      buildRequestParams({
        isRemoteMode: false,
        messages: [{ role: 'user', content: 'hello' }],
        mockType: 'chart',
        mockChartType: 'line',
      }),
    ).toEqual({
      messages: [{ role: 'user', content: 'hello' }],
      mockType: 'chart',
      mockChartType: 'line',
    });
  });

  it('executes callApi success flow with success message and follow-up request', async () => {
    const insertStructuredMessage = jest.fn();
    const onRequest = jest.fn();
    const submitActionAdapter = createAdapter({
      executeApiAction: jest.fn().mockResolvedValue({
        success: true,
        message: '创建成功',
        data: {
          ticketId: 'TICKET-1001',
          status: 'created',
        },
      }),
    });

    const result = await executeFormSubmitAction({
      isRemoteMode: false,
      submittedMessage: createSubmittedMessage({
        action: 'callApi',
        api: 'createTicket',
        payload: {
          applicant: '{{applicant}}',
        },
        onSuccessMessage: {
          role: 'assistant',
          type: 'text',
          content: {
            text: '工单 {{ticketId}} 已创建',
          },
        },
        successPromptTemplate: '继续处理工单 {{ticketId}}',
        beforeRequest: [
          {
            type: 'trackEvent',
            event: 'ticket_submit_{{applicant}}',
          },
        ],
      }),
      values: {
        applicant: '张三',
      },
      insertStructuredMessage,
      clearStructuredMessages: jest.fn(),
      refreshConversation: jest.fn(),
      onRequest,
      submitActionAdapter,
    });

    expect(result).toEqual({
      status: 'success',
      message: '创建成功',
    });
    expect(submitActionAdapter.executeApiAction).toHaveBeenCalledWith(
      'createTicket',
      {
        applicant: '张三',
      },
    );
    expect(submitActionAdapter.trackEvent).toHaveBeenCalledWith({
      event: 'ticket_submit_张三',
      properties: {},
    });
    expect(insertStructuredMessage).toHaveBeenCalledWith(
      {
        role: 'assistant',
        type: 'text',
        content: {
          text: '工单 {{ticketId}} 已创建',
        },
      },
      {
        applicant: '张三',
        ticketId: 'TICKET-1001',
        status: 'created',
        apiMessage: '创建成功',
      },
    );
    expect(onRequest).toHaveBeenCalledWith({
      messages: [
        {
          role: 'user',
          content: '继续处理工单 TICKET-1001',
        },
      ],
      mockType: 'text',
      mockChartType: undefined,
    });
  });

  it('returns normalized error result for failed callApi execution', async () => {
    const insertStructuredMessage = jest.fn();
    const submitActionAdapter = createAdapter({
      executeApiAction: jest.fn().mockResolvedValue({
        success: false,
        code: 'RATE_LIMITED',
        retryable: true,
        message: '接口限流',
      }),
    });

    const result = await executeFormSubmitAction({
      isRemoteMode: false,
      submittedMessage: createSubmittedMessage({
        action: 'callApi',
        api: 'createTicket',
        retryable: false,
        errorMessages: {
          RATE_LIMITED: '当前提交过快，请稍后再试。',
        },
        onErrorMessage: {
          role: 'assistant',
          type: 'text',
          content: {
            text: '提交失败：{{apiMessage}}',
          },
        },
      }),
      values: {
        applicant: '李四',
      },
      insertStructuredMessage,
      clearStructuredMessages: jest.fn(),
      refreshConversation: jest.fn(),
      onRequest: jest.fn(),
      submitActionAdapter,
    });

    expect(result).toEqual({
      status: 'error',
      message: '当前提交过快，请稍后再试。',
      retryable: true,
    });
    expect(insertStructuredMessage).toHaveBeenCalledWith(
      {
        role: 'assistant',
        type: 'text',
        content: {
          text: '提交失败：{{apiMessage}}',
        },
      },
      {
        applicant: '李四',
        apiMessage: '接口限流',
      },
    );
  });

  it('executes requestAndInsert by inserting message and sending follow-up request', async () => {
    const insertStructuredMessage = jest.fn();
    const onRequest = jest.fn();

    const result = await executeFormSubmitAction({
      isRemoteMode: false,
      submittedMessage: createSubmittedMessage({
        action: 'requestAndInsert',
        promptTemplate: '继续处理 {{topic}}',
        mockType: 'chart',
        mockChartType: 'line',
        message: {
          role: 'assistant',
          type: 'text',
          content: {
            text: '{{topic}} 已插入确认卡片',
          },
        },
      }),
      values: {
        topic: '智能体测试',
      },
      insertStructuredMessage,
      clearStructuredMessages: jest.fn(),
      refreshConversation: jest.fn(),
      onRequest,
      submitActionAdapter: createAdapter(),
    });

    expect(result).toEqual({ status: 'success' });
    expect(insertStructuredMessage).toHaveBeenCalledWith(
      {
        role: 'assistant',
        type: 'text',
        content: {
          text: '{{topic}} 已插入确认卡片',
        },
      },
      {
        topic: '智能体测试',
      },
    );
    expect(onRequest).toHaveBeenCalledWith({
      messages: [
        {
          role: 'user',
          content: '继续处理 智能体测试',
        },
      ],
      mockType: 'chart',
      mockChartType: 'line',
    });
  });

  it('falls back to generated summary prompt for request action without promptTemplate', async () => {
    const onRequest = jest.fn();

    const result = await executeFormSubmitAction({
      isRemoteMode: false,
      submittedMessage: createSubmittedMessage({
        action: 'request',
      }),
      values: {
        applicant: '张三',
        topic: '性能压测',
      },
      insertStructuredMessage: jest.fn(),
      clearStructuredMessages: jest.fn(),
      refreshConversation: jest.fn(),
      onRequest,
      submitActionAdapter: createAdapter(),
    });

    expect(result).toEqual({ status: 'success' });
    expect(onRequest).toHaveBeenCalledWith({
      messages: [
        {
          role: 'user',
          content: [
            '我刚触发了《工单申请》的提交动作，请基于以下结果继续处理。',
            '',
            '我已提交表单，内容如下：',
            '- applicant: 张三',
            '- topic: 性能压测',
            '',
            '请确认接收并给出下一步建议。',
          ].join('\n'),
        },
      ],
      mockType: 'text',
      mockChartType: undefined,
    });
  });

  it('executes submitAction for approval messages through the same engine', async () => {
    const insertStructuredMessage = jest.fn();

    const result = await executeFormSubmitAction({
      isRemoteMode: false,
      submittedMessage: createSubmittedMessage(
        {
          action: 'insertMessage',
          message: {
            role: 'assistant',
            type: 'text',
            content: {
              text: '审批 {{topic}} 已通过',
            },
          },
        },
        MessageType.APPROVAL,
        {
          applicant: '张三',
        },
      ),
      values: {
        topic: '智能体审批联调',
      },
      insertStructuredMessage,
      clearStructuredMessages: jest.fn(),
      refreshConversation: jest.fn(),
      onRequest: jest.fn(),
      submitActionAdapter: createAdapter(),
    });

    expect(result).toEqual({ status: 'success' });
    expect(insertStructuredMessage).toHaveBeenCalledWith(
      {
        role: 'assistant',
        type: 'text',
        content: {
          text: '审批 {{topic}} 已通过',
        },
      },
      {
        topic: '智能体审批联调',
      },
    );
  });

  it('executes afterSuccess hooks with resolved side effects', async () => {
    const insertStructuredMessage = jest.fn();
    const clearStructuredMessages = jest.fn();
    const refreshConversation = jest.fn();
    const onRequest = jest.fn();
    const submitActionAdapter = createAdapter({
      executeApiAction: jest.fn().mockResolvedValue({
        success: true,
        message: '工单创建成功',
        data: {
          ticketId: 'T-2026',
          owner: '调度中心',
        },
      }),
    });

    const result = await executeFormSubmitAction({
      isRemoteMode: false,
      submittedMessage: createSubmittedMessage({
        action: 'callApi',
        api: 'createTicket',
        afterSuccess: [
          {
            type: 'clearStructuredMessages',
          },
          {
            type: 'refreshConversation',
          },
          {
            type: 'insertMessage',
            message: {
              role: 'assistant',
              type: 'text',
              content: {
                text: '工单 {{ticketId}} 已分配给 {{owner}}',
              },
            },
          },
          {
            type: 'request',
            promptTemplate: '继续推进 {{ticketId}}',
            mockType: 'text',
          },
          {
            type: 'trackEvent',
            event: 'ticket_after_success_{{ticketId}}',
            properties: {
              owner: '{{owner}}',
            },
          },
        ],
      }),
      values: {
        applicant: '王五',
      },
      insertStructuredMessage,
      clearStructuredMessages,
      refreshConversation,
      onRequest,
      submitActionAdapter,
    });

    expect(result).toEqual({
      status: 'success',
      message: '工单创建成功',
    });
    expect(clearStructuredMessages).toHaveBeenCalledTimes(1);
    expect(refreshConversation).toHaveBeenCalledTimes(1);
    expect(insertStructuredMessage).toHaveBeenCalledWith(
      {
        role: 'assistant',
        type: 'text',
        content: {
          text: '工单 {{ticketId}} 已分配给 {{owner}}',
        },
      },
      {
        applicant: '王五',
        ticketId: 'T-2026',
        owner: '调度中心',
        apiMessage: '工单创建成功',
      },
    );
    expect(onRequest).toHaveBeenCalledWith({
      messages: [
        {
          role: 'user',
          content: '继续推进 T-2026',
        },
      ],
      mockType: 'text',
      mockChartType: undefined,
    });
    expect(submitActionAdapter.trackEvent).toHaveBeenCalledWith({
      event: 'ticket_after_success_T-2026',
      properties: {
        owner: '调度中心',
      },
    });
  });
});
