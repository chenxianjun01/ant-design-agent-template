import type { Request, Response } from 'express';
import type {
  IAgentExecutionControl,
  IAgentExecutionMessagePatch,
} from './data';

interface SubmitActionBody {
  api?: string;
  payload?: Record<string, unknown>;
}

interface RuntimeStreamBody {
  messageId?: string;
  cursor?: string;
}

interface ExecutionControlBody {
  messageId?: string;
  control?: IAgentExecutionControl;
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

const createRuntimeStreamBatches = (): IAgentExecutionMessagePatch[] => {
  const now = new Date();

  return [
    {
      updatedAt: new Date(now.getTime() + 5_000).toISOString(),
      summary: '已完成上下文检索，准备生成执行计划。',
      updateSteps: [
        {
          key: 'retrieve-context',
          status: 'success',
          finishedAt: new Date(now.getTime() + 5_000).toISOString(),
          duration: '5s',
          tags: ['知识库', '命中 4 条'],
        },
      ],
      appendSteps: [
        {
          key: 'plan-response',
          title: '生成执行计划',
          description: '整理回答结构与依赖动作',
          status: 'running',
          startedAt: new Date(now.getTime() + 5_000).toISOString(),
          tags: ['规划'],
        },
      ],
    },
    {
      status: 'success',
      updatedAt: new Date(now.getTime() + 11_000).toISOString(),
      summary: '执行完成，已生成可返回给用户的最终结果。',
      updateSteps: [
        {
          key: 'plan-response',
          status: 'success',
          finishedAt: new Date(now.getTime() + 11_000).toISOString(),
          duration: '6s',
          tags: ['规划', '完成'],
        },
      ],
      appendSteps: [
        {
          key: 'final-answer',
          title: '输出最终结果',
          description: '写入最终回答并结束执行',
          status: 'success',
          startedAt: new Date(now.getTime() + 11_000).toISOString(),
          finishedAt: new Date(now.getTime() + 12_000).toISOString(),
          duration: '1s',
          tags: ['answer'],
        },
      ],
    },
  ];
};

const runtimeStreamHandler = (req: Request, res: Response) => {
  const { messageId = 'unknown', cursor } = req.body as RuntimeStreamBody;
  const patches = createRuntimeStreamBatches();
  const currentIndex = Number(cursor ?? 0);

  if (!Number.isFinite(currentIndex) || currentIndex >= patches.length) {
    res.send({
      messageId,
      patches: [],
      done: true,
    });
    return;
  }

  const nextCursor = currentIndex + 1;

  res.send({
    messageId,
    patches: [patches[currentIndex]],
    nextCursor: nextCursor < patches.length ? String(nextCursor) : undefined,
    done: nextCursor >= patches.length,
    pollIntervalMs: 120,
  });
};

const executionControlHandler = (req: Request, res: Response) => {
  const { messageId = 'unknown', control } = req.body as ExecutionControlBody;
  const action = control?.action;
  const actionLabel =
    action === 'stop' ? '停止' : action === 'retry' ? '重试' : '继续';
  const patch: IAgentExecutionMessagePatch =
    action === 'stop'
      ? {
          clearPendingControl: true,
          clearControlError: true,
          summary: `已提交${actionLabel}请求，等待执行链路收敛。`,
          updatedAt: new Date().toISOString(),
        }
      : {
          clearPendingControl: true,
          clearControlError: true,
          status: 'running',
          summary: `已提交${actionLabel}请求，执行链路将继续推进。`,
          updatedAt: new Date().toISOString(),
        };

  res.send({
    success: true,
    message: `${actionLabel}请求已接收`,
    data: {
      messageId,
      action,
    },
    patch,
  });
};

export default {
  'POST /api/chatbot/submit-action': submitActionHandler,
  'POST /api/chatbot/track-event': trackEventHandler,
  'POST /api/chatbot/runtime-stream': runtimeStreamHandler,
  'POST /api/chatbot/execution-control': executionControlHandler,
};
