import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../../data';
import AgentExecutionMessage from './AgentExecutionMessage';

describe('AgentExecutionMessage', () => {
  it('renders execution summary and step statuses', () => {
    render(
      React.createElement(AgentExecutionMessage, {
        message: {
          id: 'execution-1',
          role: 'assistant',
          type: MessageType.AGENT_EXECUTION,
          content: {
            title: '智能体执行状态',
            description: '当前正在生成回答',
            summary: '已完成规划与检索，继续整理输出。',
            status: 'running',
            startedAt: '09:30',
            updatedAt: '09:32',
            steps: [
              {
                title: '解析意图',
                description: '识别用户目标',
                status: 'success',
                duration: '12ms',
                tags: ['planner'],
              },
              {
                title: '生成回答',
                description: '组织最终输出',
                status: 'running',
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('智能体执行状态')).toBeTruthy();
    expect(screen.getByText('当前正在生成回答')).toBeTruthy();
    expect(screen.getByText('已完成规划与检索，继续整理输出。')).toBeTruthy();
    expect(screen.getByText('解析意图')).toBeTruthy();
    expect(screen.getByText('识别用户目标')).toBeTruthy();
    expect(screen.getByText('planner')).toBeTruthy();
    expect(screen.getByText('生成回答')).toBeTruthy();
    expect(screen.getAllByText('进行中').length).toBeGreaterThan(0);
  });

  it('renders controls and forwards click events', () => {
    const handleControl = jest.fn();

    render(
      React.createElement(AgentExecutionMessage, {
        message: {
          id: 'execution-2',
          role: 'assistant',
          type: MessageType.AGENT_EXECUTION,
          content: {
            title: '执行控制',
            summary: '正在执行',
            status: 'running',
            steps: [],
            controls: [
              {
                key: 'stop-execution',
                label: '停止',
                action: 'stop',
                danger: true,
              },
              {
                key: 'continue-execution',
                label: '继续',
                action: 'continue',
                buttonType: 'primary',
              },
            ],
          },
        },
        onAgentExecutionControl: handleControl,
      } as any),
    );

    fireEvent.click(screen.getByRole('button', { name: /停\s*止/ }));
    expect(handleControl).toHaveBeenCalledTimes(1);
    expect(handleControl.mock.calls[0][1]).toMatchObject({
      key: 'stop-execution',
      action: 'stop',
    });
  });

  it('shows control error and pending button loading state', () => {
    render(
      React.createElement(AgentExecutionMessage, {
        message: {
          id: 'execution-3',
          role: 'assistant',
          type: MessageType.AGENT_EXECUTION,
          content: {
            title: '执行控制',
            summary: '正在执行',
            status: 'running',
            steps: [],
            pendingControlKey: 'retry-execution',
            controlErrorMessage: '控制请求失败',
            controls: [
              {
                key: 'retry-execution',
                label: '重试',
                action: 'retry',
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('控制请求失败')).toBeTruthy();
    expect(screen.getByRole('button', { name: /重\s*试/ })).toHaveProperty(
      'disabled',
      true,
    );
  });
});
