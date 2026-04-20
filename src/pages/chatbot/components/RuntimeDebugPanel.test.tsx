import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import RuntimeDebugPanel from './RuntimeDebugPanel';

describe('RuntimeDebugPanel', () => {
  it('shows collapsed summary by default and expands runtime events on demand', () => {
    render(
      React.createElement(RuntimeDebugPanel, {
        events: [
          {
            id: 'event-1',
            timestamp: '2026-04-19T08:00:00.000Z',
            conversationKey: 'conversation-a',
            type: 'chat.request',
            level: 'info',
            summary: '已发起聊天请求',
            details: { mockType: 'text' },
          },
        ],
      }),
    );

    expect(screen.getByText('已记录 1 条 runtime 事件')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '展开' }));

    expect(screen.getByText('已发起聊天请求')).toBeTruthy();
    expect(screen.getByText('chat.request')).toBeTruthy();
  });
});
