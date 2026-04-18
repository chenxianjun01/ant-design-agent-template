import { render, screen } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../data';
import MessageRenderer from './MessageRenderer';

jest.mock('./messages/TextMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'text-message' },
      'text-message',
    ),
}));

jest.mock('./messages/FileMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'file-message' },
      'file-message',
    ),
}));

jest.mock('./messages/ImageMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'image-message' },
      'image-message',
    ),
}));

jest.mock('./messages/AudioMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'audio-message' },
      'audio-message',
    ),
}));

jest.mock('./messages/TableMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'table-message' },
      'table-message',
    ),
}));

jest.mock('./messages/ChartMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'chart-message' },
      'chart-message',
    ),
}));

jest.mock('./messages/FormMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'form-message' },
      'form-message',
    ),
}));

jest.mock('./messages/TimelineMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'timeline-message' },
      'timeline-message',
    ),
}));

jest.mock('./messages/MapMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'map-message' },
      'map-message',
    ),
}));

jest.mock('./messages/ApprovalMessage', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'approval-message' },
      'approval-message',
    ),
}));

jest.mock('./messages/UnsupportedMessage', () => ({
  __esModule: true,
  default: (props: { message: { type: string } }) => {
    return require('react').createElement(
      'div',
      { 'data-testid': 'unsupported-message' },
      String(props.message.type),
    );
  },
}));

const createMessage = (type: string) => {
  const content =
    type === MessageType.TEXT
      ? { text: 'hello' }
      : type === MessageType.FILE
        ? { files: [] }
        : type === MessageType.IMAGE
          ? { images: [] }
          : type === MessageType.AUDIO
            ? { audios: [] }
            : type === MessageType.TABLE
              ? { dataSource: [] }
              : type === MessageType.CHART
                ? { type: 'line', data: [] }
                : type === MessageType.MAP
                  ? { center: [121.47, 31.23] }
                  : type === MessageType.TIMELINE
                    ? { items: [] }
                    : type === MessageType.APPROVAL
                      ? { title: 'approval' }
                      : { title: 'form' };

  return {
    id: `message-${String(type)}`,
    role: 'assistant' as const,
    type,
    content,
  } as any;
};

describe('MessageRenderer', () => {
  it('renders mapped component for known message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.TABLE),
      }),
    );

    expect(screen.getByTestId('table-message')).toBeTruthy();
  });

  it('renders file component for file message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.FILE),
      }),
    );

    expect(screen.getByTestId('file-message')).toBeTruthy();
  });

  it('renders image component for image message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.IMAGE),
      }),
    );

    expect(screen.getByTestId('image-message')).toBeTruthy();
  });

  it('renders audio component for audio message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.AUDIO),
      }),
    );

    expect(screen.getByTestId('audio-message')).toBeTruthy();
  });

  it('renders timeline component for timeline message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.TIMELINE),
      }),
    );

    expect(screen.getByTestId('timeline-message')).toBeTruthy();
  });

  it('renders map component for map message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.MAP),
      }),
    );

    expect(screen.getByTestId('map-message')).toBeTruthy();
  });

  it('renders approval component for approval message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage(MessageType.APPROVAL),
      }),
    );

    expect(screen.getByTestId('approval-message')).toBeTruthy();
  });

  it('falls back to unsupported component for unknown message type', () => {
    render(
      React.createElement(MessageRenderer, {
        message: createMessage('audit-card'),
      }),
    );

    expect(screen.getByTestId('unsupported-message').textContent).toBe(
      'audit-card',
    );
  });
});
