import { render, screen } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../../data';
import ChartMessage from './ChartMessage';

jest.mock('@ant-design/plots', () => ({
  Area: () =>
    require('react').createElement('div', { 'data-testid': 'plot-area' }),
  Bar: () =>
    require('react').createElement('div', { 'data-testid': 'plot-bar' }),
  Column: () =>
    require('react').createElement('div', { 'data-testid': 'plot-column' }),
  DualAxes: () =>
    require('react').createElement('div', { 'data-testid': 'plot-dual-axes' }),
  Line: () =>
    require('react').createElement('div', { 'data-testid': 'plot-line' }),
  Pie: () =>
    require('react').createElement('div', { 'data-testid': 'plot-pie' }),
  Radar: () =>
    require('react').createElement('div', { 'data-testid': 'plot-radar' }),
}));

jest.mock('../schema/SchemaSlot', () => ({
  __esModule: true,
  default: () => null,
}));

const createChartMessage = (type: string, data: unknown) =>
  ({
    id: `chart-${type}`,
    role: 'assistant',
    type: MessageType.CHART,
    content: {
      title: '图表消息',
      type,
      data,
      xField: 'x',
      yField: type === 'dualAxes' ? ['value', 'value2'] : 'y',
    },
  }) as any;

describe('ChartMessage', () => {
  it('renders area chart', () => {
    render(
      React.createElement(ChartMessage, {
        message: createChartMessage('area', [{ x: 'A', y: 1 }]),
      }),
    );

    expect(screen.getByTestId('plot-area')).toBeTruthy();
  });

  it('renders bar chart', () => {
    render(
      React.createElement(ChartMessage, {
        message: createChartMessage('bar', [{ x: 1, y: 'A' }]),
      }),
    );

    expect(screen.getByTestId('plot-bar')).toBeTruthy();
  });

  it('renders radar chart', () => {
    render(
      React.createElement(ChartMessage, {
        message: createChartMessage('radar', [{ x: 'A', y: 1 }]),
      }),
    );

    expect(screen.getByTestId('plot-radar')).toBeTruthy();
  });

  it('renders dual axes chart', () => {
    render(
      React.createElement(ChartMessage, {
        message: createChartMessage('dualAxes', [
          [{ x: 'A', value: 1 }],
          [{ x: 'A', value2: 2 }],
        ]),
      }),
    );

    expect(screen.getByTestId('plot-dual-axes')).toBeTruthy();
  });

  it('shows empty state for invalid dual axes data', () => {
    render(
      React.createElement(ChartMessage, {
        message: createChartMessage('dualAxes', [{ x: 'A', value: 1 }]),
      }),
    );

    expect(screen.getByText('当前双轴图数据格式不正确')).toBeTruthy();
  });
});
