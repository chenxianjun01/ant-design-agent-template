import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../../data';
import ApprovalMessage from './ApprovalMessage';

describe('ApprovalMessage', () => {
  it('renders approval summary, status, and fields', () => {
    render(
      React.createElement(ApprovalMessage, {
        message: {
          id: 'approval-1',
          role: 'assistant',
          type: MessageType.APPROVAL,
          content: {
            title: '工单审批摘要',
            description: '智能体已汇总本次审批关键信息',
            summary: '当前申请已进入技术负责人审批阶段。',
            status: 'pending',
            applicant: '张三',
            approver: '李四',
            tags: ['高优', '研发'],
            fields: [
              {
                key: 'topic',
                label: '申请主题',
                value: '智能体联调发布',
                emphasis: true,
              },
              { label: '计划日期', value: '2026-04-18' },
            ],
            actions: [
              {
                key: 'approve',
                label: '通过',
                buttonType: 'primary',
                submitAction: {
                  action: 'insertMessage',
                  message: {
                    role: 'assistant',
                    type: 'text',
                    content: { text: '审批已通过' },
                  },
                },
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('工单审批摘要')).toBeTruthy();
    expect(screen.getByText('待审批')).toBeTruthy();
    expect(screen.getByText('智能体已汇总本次审批关键信息')).toBeTruthy();
    expect(screen.getByText('当前申请已进入技术负责人审批阶段。')).toBeTruthy();
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('李四')).toBeTruthy();
    expect(screen.getByText('智能体联调发布')).toBeTruthy();
    expect(screen.getByText('高优')).toBeTruthy();
    expect(screen.getByRole('button', { name: /通\s*过/ })).toBeTruthy();
  });

  it('triggers approval action through the shared submitAction handler', async () => {
    const onFormSubmit = jest.fn().mockResolvedValue({ status: 'success' });

    render(
      React.createElement(ApprovalMessage, {
        onFormSubmit,
        message: {
          id: 'approval-2',
          role: 'assistant',
          type: MessageType.APPROVAL,
          content: {
            title: '工单审批摘要',
            status: 'pending',
            applicant: '张三',
            approver: '李四',
            fields: [
              {
                key: 'topic',
                label: '申请主题',
                value: '结构化消息发布',
              },
            ],
            actions: [
              {
                key: 'approve',
                label: '通过并通知',
                submitAction: {
                  action: 'request',
                  promptTemplate: '继续处理 {{topic}}',
                  mockType: 'text',
                },
              },
            ],
          },
        },
      } as any),
    );

    fireEvent.click(screen.getByRole('button', { name: '通过并通知' }));

    await waitFor(() => {
      expect(onFormSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onFormSubmit.mock.calls[0][0].content.submitAction).toEqual({
      action: 'request',
      promptTemplate: '继续处理 {{topic}}',
      mockType: 'text',
    });
    expect(onFormSubmit.mock.calls[0][1]).toMatchObject({
      title: '工单审批摘要',
      applicant: '张三',
      approver: '李四',
      topic: '结构化消息发布',
      status: 'pending',
    });
  });
});
