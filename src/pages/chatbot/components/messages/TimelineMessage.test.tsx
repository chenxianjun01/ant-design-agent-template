import { render, screen } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../../data';
import TimelineMessage from './TimelineMessage';

describe('TimelineMessage', () => {
  it('renders timeline title, description, and items', () => {
    render(
      React.createElement(TimelineMessage, {
        message: {
          id: 'timeline-1',
          role: 'assistant',
          type: MessageType.TIMELINE,
          content: {
            title: '执行进展',
            description: '本次任务的关键阶段',
            items: [
              {
                title: '开始规划',
                description: '已完成问题拆解',
                time: '10:00',
                tags: ['planner'],
              },
              {
                title: '开始实现',
                description: '进入开发阶段',
                time: '10:05',
                status: 'process',
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('执行进展')).toBeTruthy();
    expect(screen.getByText('本次任务的关键阶段')).toBeTruthy();
    expect(screen.getByText('开始规划')).toBeTruthy();
    expect(screen.getByText('已完成问题拆解')).toBeTruthy();
    expect(screen.getByText('planner')).toBeTruthy();
  });
});
