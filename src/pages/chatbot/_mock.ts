import type { Request, Response } from 'express';

interface SubmitActionBody {
  api?: string;
  payload?: Record<string, unknown>;
}

const isHighPriority = (priority: unknown) => {
  const normalized = String(priority ?? '').toLowerCase();
  return normalized === 'high' || normalized === '高';
};

const submitActionHandler = (req: Request, res: Response) => {
  const { api, payload = {} } = req.body as SubmitActionBody;

  if (api === 'createTicket') {
    res.send({
      success: true,
      message: '工单创建成功',
      data: {
        ticketId: `TICKET-${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'created',
        owner: '智能体调度中心',
        ...payload,
      },
    });
    return;
  }

  if (api === 'notifyMembers') {
    res.send({
      success: true,
      message: '通知已发送',
      data: {
        notifyResult: 'sent',
        receivers: 3,
        ...payload,
      },
    });
    return;
  }

  if (api === 'createTicketWithRisk') {
    if (isHighPriority(payload.priority)) {
      res.send({
        success: false,
        code: 'RATE_LIMITED',
        retryable: true,
        message: '当前高优任务创建过于频繁，请稍后重试。',
        data: payload,
      });
      return;
    }

    res.send({
      success: false,
      code: 'VALIDATION_ERROR',
      retryable: false,
      message: '请求参数校验失败，请检查表单填写项。',
      data: payload,
    });
    return;
  }

  res.send({
    success: false,
    code: 'UNKNOWN_API',
    retryable: false,
    message: `未识别的 API: ${api ?? ''}`,
    data: payload,
  });
};

const trackEventHandler = (req: Request, res: Response) => {
  const { event, properties } = req.body as {
    event?: string;
    properties?: Record<string, unknown>;
  };

  res.send({
    success: true,
    message: '埋点已记录',
    data: {
      event,
      properties,
      trackedAt: new Date().toISOString(),
    },
  });
};

export default {
  'POST /api/chatbot/submit-action': submitActionHandler,
  'POST /api/chatbot/track-event': trackEventHandler,
};
